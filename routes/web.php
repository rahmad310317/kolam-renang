<?php

use App\Http\Controllers\OrderController;
use App\Http\Controllers\CheckInController;
use App\Http\Controllers\ReportController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Auth;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/



Route::get('/', function () {


    if (Auth::check()) {
        return Redirect::route('orders');
    } else {
        return Inertia::render('Welcome', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'laravelVersion' => Application::VERSION,
            'phpVersion' => PHP_VERSION,
        ]);
    }
})->name('welcome');

Route::post('/', [OrderController::class, 'orderTicket'])->name('orders.ticket');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    Route::get('orders', [OrderController::class, 'index'])->name('orders');
    Route::post('orders', [OrderController::class, 'update'])->name('orders.update');
    Route::get('orders/show/{id}', [OrderController::class, 'show'])->name('orders.show');
    Route::get('orders/{id}', [OrderController::class, 'deleteOrder'])->name('orders.delete');

    Route::get('checkIn', [CheckInController::class, 'index'])->name('checkIn');
    Route::get('reports', [ReportController::class, 'index'])->name('reports');
});


require __DIR__ . '/auth.php';
