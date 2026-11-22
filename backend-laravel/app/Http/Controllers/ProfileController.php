<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class ProfileController extends Controller
{
    /**
     * Get authenticated user profile and all store settings.
     */
    public function getProfile(Request $request)
    {
        $authUser = $request->attributes->get('auth_user');
        if (!$authUser) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        $user = User::find($authUser['id']);
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'User record not found.'], 404);
        }

        // Fetch all store and social settings
        $settings = Setting::all()->pluck('val', 'key')->toArray();

        $profileData = [
            'id' => $user->id,
            'name' => $user->name,
            'display_name' => $user->display_name ?: $user->name,
            'email' => $user->email,
            'phone' => $user->phone ?: '',
            'avatar' => $user->avatar ?: '',
            'designation' => $user->designation ?: 'Shop Owner / Administrator',
            'bio' => $user->bio ?: '',
            'role' => $user->role,
            'branch' => $user->branch,
        ];

        return response()->json([
            'success' => true,
            'data' => $profileData,
            'user' => $profileData,
            'settings' => $settings,
        ]);
    }

    /**
     * Update user profile and/or shop branch settings.
     */
    public function updateProfile(Request $request)
    {
        $authUser = $request->attributes->get('auth_user');
        if (!$authUser) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        $user = User::find($authUser['id']);
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'User not found.'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'nullable|string|max:255',
            'display_name' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:50',
            'avatar' => 'nullable|string',
            'designation' => 'nullable|string|max:255',
            'bio' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error.',
                'errors' => $validator->errors(),
            ], 422);
        }

        // 1. Update User Profile Fields
        if ($request->has('name')) $user->name = trim($request->input('name'));
        if ($request->has('display_name')) $user->display_name = trim($request->input('display_name'));
        if ($request->has('email')) $user->email = trim(strtolower($request->input('email')));
        if ($request->has('phone')) $user->phone = trim($request->input('phone'));
        if ($request->has('avatar')) $user->avatar = $request->input('avatar');
        if ($request->has('designation')) $user->designation = trim($request->input('designation'));
        if ($request->has('bio')) $user->bio = trim($request->input('bio'));
        $user->save();

        // 2. Update Shop Profile & Social Media Settings if passed
        $settingsKeys = [
            'shop_name', 'branch_name', 'shop_email', 'shop_phone', 'shop_whatsapp',
            'shop_address', 'shop_city', 'shop_state', 'shop_pincode', 'business_hours',
            'instagram_url', 'facebook_url', 'youtube_url', 'linkedin_url', 'website_url'
        ];

        foreach ($settingsKeys as $k) {
            if ($request->has($k)) {
                Setting::updateOrCreate(['key' => $k], ['val' => $request->input($k)]);
            }
        }

        // 3. Update Token Session Cache so /me returns live updated info
        $token = $this->extractToken($request);
        $updatedSession = [
            'id' => $user->id,
            'name' => $user->name,
            'display_name' => $user->display_name ?: $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'avatar' => $user->avatar,
            'designation' => $user->designation,
            'role' => $user->role,
            'branch' => $user->branch,
            'logged_at' => $authUser['logged_at'] ?? now()->toIso8601String(),
        ];

        if ($token) {
            Cache::put('admin_token_' . $token, $updatedSession, now()->addHours(24));
        }

        $allSettings = Setting::all()->pluck('val', 'key')->toArray();

        return response()->json([
            'success' => true,
            'message' => 'Profile and showroom details updated successfully!',
            'data' => $updatedSession,
            'user' => $updatedSession,
            'settings' => $allSettings,
        ]);
    }

    /**
     * Change authenticated user password.
     */
    public function changePassword(Request $request)
    {
        $authUser = $request->attributes->get('auth_user');
        if (!$authUser) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        $user = User::find($authUser['id']);
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'User not found.'], 404);
        }

        $validator = Validator::make($request->all(), [
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:6',
            'confirm_password' => 'required|same:new_password',
        ], [
            'confirm_password.same' => 'New password and confirmation do not match.',
            'new_password.min' => 'New password must be at least 6 characters.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()->first(),
                'errors' => $validator->errors(),
            ], 422);
        }

        if (!Hash::check($request->input('current_password'), $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'The current password you entered is incorrect.',
            ], 400);
        }

        $user->password = Hash::make($request->input('new_password'));
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Password updated successfully! Please use your new password next time you log in.',
        ]);
    }

    /**
     * Get all store settings.
     */
    public function getSettings()
    {
        $settings = Setting::all()->pluck('val', 'key')->toArray();
        return response()->json(['success' => true, 'data' => $settings]);
    }

    /**
     * Extract token helper.
     */
    private function extractToken(Request $request): ?string
    {
        $authHeader = $request->header('Authorization', '');
        if (preg_match('/Bearer\s+(\S+)/i', $authHeader, $matches)) {
            return $matches[1];
        }
        return $request->input('token') ?: $request->query('token');
    }
}
