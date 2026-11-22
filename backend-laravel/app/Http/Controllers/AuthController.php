<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    /**
     * Handle staff/admin login request.
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string',
            'branch' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Please provide a valid email and password.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $email = trim(strtolower($request->input('email')));
        $password = $request->input('password');

        $user = User::where('email', $email)->first();

        if (!$user || !Hash::check($password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid email or password. Please check your credentials.',
            ], 401);
        }

        // Generate high-entropy session token
        $token = bin2hex(random_bytes(32));

        $sessionData = [
            'id' => $user->id,
            'name' => $user->name,
            'display_name' => $user->display_name ?: $user->name,
            'email' => $user->email,
            'phone' => $user->phone ?: '',
            'avatar' => $user->avatar ?: '',
            'designation' => $user->designation ?: 'Shop Owner / Administrator',
            'role' => $user->role,
            'branch' => $user->branch,
            'logged_at' => now()->toIso8601String(),
        ];

        // Store session token in database cache for 24 hours
        Cache::put('admin_token_' . $token, $sessionData, now()->addHours(24));

        return response()->json([
            'success' => true,
            'message' => 'Authentication successful. Redirecting to dashboard...',
            'token' => $token,
            'user' => $sessionData,
            'redirect' => 'dashboard.html',
        ]);
    }

    /**
     * Get authenticated staff details.
     */
    public function me(Request $request)
    {
        $token = $this->extractToken($request);

        if (!$token) {
            return response()->json([
                'success' => false,
                'authenticated' => false,
                'message' => 'No authentication token provided.',
            ], 401);
        }

        $sessionData = Cache::get('admin_token_' . $token);

        if (!$sessionData) {
            return response()->json([
                'success' => false,
                'authenticated' => false,
                'message' => 'Session expired or invalid.',
            ], 401);
        }

        return response()->json([
            'success' => true,
            'authenticated' => true,
            'user' => $sessionData,
        ]);
    }

    /**
     * Terminate staff session (logout).
     */
    public function logout(Request $request)
    {
        $token = $this->extractToken($request);

        if ($token) {
            Cache::forget('admin_token_' . $token);
        }

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully.',
        ]);
    }

    /**
     * Helper to extract token from Bearer header or request body/query.
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
