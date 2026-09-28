<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class HealthController extends Controller
{
    /**
     * Check system health and vital dependencies.
     */
    public function check()
    {
        $checks = [
            'database' => 'ok',
            'storage' => 'ok',
            'cache' => 'ok',
        ];
        $isHealthy = true;

        // 1. Database Check
        try {
            DB::connection()->getPdo();
        } catch (\Throwable $e) {
            $checks['database'] = 'error: ' . $e->getMessage();
            $isHealthy = false;
        }

        // 2. Storage Check
        try {
            $disk = config('filesystems.default') === 'r2' ? 'r2' : 'public';
            $testFile = 'health_check_' . time() . '.txt';
            Storage::disk($disk)->put($testFile, 'health');
            Storage::disk($disk)->delete($testFile);
        } catch (\Throwable $e) {
            $checks['storage'] = 'warning: ' . $e->getMessage();
            // Don't fail the whole app if external storage is offline during boot, but flag it
        }

        // 3. Cache Check
        try {
            Cache::put('health_test', 1, 10);
            Cache::forget('health_test');
        } catch (\Throwable $e) {
            $checks['cache'] = 'error: ' . $e->getMessage();
            $isHealthy = false;
        }

        $statusCode = $isHealthy ? 200 : 503;

        return response()->json([
            'status' => $isHealthy ? 'healthy' : 'degraded',
            'timestamp' => now()->toIso8601String(),
            'environment' => config('app.env'),
            'checks' => $checks,
        ], $statusCode);
    }
}
