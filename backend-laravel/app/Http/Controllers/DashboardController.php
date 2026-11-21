<?php

namespace App\Http\Controllers;

use App\Models\Accessory;
use App\Models\ActivityLog;
use App\Models\Laptop;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\StockLog;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $today = Carbon::today();
        $yesterday = Carbon::yesterday();

        // 1. Sales Statistics
        $todaySalesCount = Sale::whereDate('created_at', $today)->count();
        $todaySalesTotal = (float) Sale::whereDate('created_at', $today)->sum('total');

        $yesterdaySalesCount = Sale::whereDate('created_at', $yesterday)->count();
        $yesterdaySalesTotal = (float) Sale::whereDate('created_at', $yesterday)->sum('total');

        $totalSalesCount = Sale::count();
        $totalSalesRevenue = (float) Sale::sum('total');

        // 2. Inventory Statistics
        $totalLaptopModels = Laptop::count();
        $totalLaptopPieces = (int) Laptop::sum('piece');

        $totalAccessories = Accessory::count();
        $totalAccessoryPieces = (int) Accessory::sum('piece');

        $lowStockLaptops = Laptop::where('piece', '>', 0)->where('piece', '<=', 2)->count();
        $lowStockAccessories = Accessory::where('piece', '>', 0)->where('piece', '<=', 2)->count();
        $lowStockTotal = $lowStockLaptops + $lowStockAccessories;

        $outOfStockLaptops = Laptop::where('piece', 0)->count();
        $outOfStockAccessories = Accessory::where('piece', 0)->count();
        $outOfStockTotal = $outOfStockLaptops + $outOfStockAccessories;

        $totalSoldUnits = (int) SaleItem::sum('qty');

        // 3. Last 7 Days Sales Trend
        $salesTrend = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            $dateStr = $date->format('Y-m-d');
            $dayLabel = $date->format('D, M d');
            $rev = (float) Sale::whereDate('created_at', $date)->sum('total');
            $units = (int) SaleItem::whereDate('created_at', $date)->sum('qty');
            $salesTrend[] = [
                'date' => $dateStr,
                'label' => $dayLabel,
                'revenue' => $rev,
                'units' => $units,
            ];
        }

        // 4. Recent Sales
        $recentSales = Sale::with(['items', 'user'])
            ->orderBy('id', 'desc')
            ->limit(10)
            ->get();

        // 5. Recent Stock Activity
        $recentActivity = StockLog::with('user')
            ->orderBy('id', 'desc')
            ->limit(10)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'sales' => [
                    'today' => [
                        'count' => $todaySalesCount,
                        'revenue' => $todaySalesTotal,
                    ],
                    'yesterday' => [
                        'count' => $yesterdaySalesCount,
                        'revenue' => $yesterdaySalesTotal,
                    ],
                    'total' => [
                        'count' => $totalSalesCount,
                        'revenue' => $totalSalesRevenue,
                    ],
                    'trend' => $salesTrend,
                ],
                'inventory' => [
                    'laptop_models' => $totalLaptopModels,
                    'laptop_pieces' => $totalLaptopPieces,
                    'accessories_models' => $totalAccessories,
                    'accessories_pieces' => $totalAccessoryPieces,
                    'total_items' => $totalLaptopModels + $totalAccessories,
                    'total_stock' => $totalLaptopPieces + $totalAccessoryPieces,
                    'sold_units' => $totalSoldUnits,
                    'low_stock' => $lowStockTotal,
                    'out_of_stock' => $outOfStockTotal,
                ],
                'recent_sales' => $recentSales,
                'recent_activity' => $recentActivity,
            ],
        ]);
    }
}
