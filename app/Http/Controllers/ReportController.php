<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Customer;
use App\Models\Ticket;
use Inertia\Inertia;


class ReportController extends Controller
{
    //'
    public function index(Request $request)
    {
        $tickets = Ticket::with('order.customer')->get();
        $param['tickets'] = $tickets;
        return Inertia::render('Reports/Index', $param);
    }
}
