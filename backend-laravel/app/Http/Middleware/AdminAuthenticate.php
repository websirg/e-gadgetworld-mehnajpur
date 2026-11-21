<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class AdminAuthenticate
{
    public function handle(Request $request, Closure $next, ?string $role = null)
    {
        $token = $this->extractToken($request);

        if (!$token) {
            return response()->json([
                'success' => false,
                'message' => 'Authentication token required.',
            ], 401);
        }

        $sessionData = Cache::get('admin_token_' . $token);

        if (!$sessionData) {
            return response()->json([
                'success' => false,
                'message' => 'Session expired or invalid. Please sign in again.',
            ], 401);
        }

        if ($role && $role === 'super_admin' && !in_array($sessionData['role'], ['super_admin', 'owner'])) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied. Super Admin privileges required.',
            ], 403);
        }

        $request->attributes->set('auth_user', $sessionData);

        return $next($request);
    }

    private function extractToken(Request $request): ?string
    {
        $authHeader = $request->header('Authorization', '');
        if (preg_match('/Bearer\s+(\S+)/i', $authHeader, $matches)) {
            return $matches[1];
        }

        return $request->input('token') ?: $request->query('token');
    }
}
