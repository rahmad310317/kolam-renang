<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CheckInController extends Controller
{
    //
    public function index(Request $request)
    {
        $param = [];
        if (isset($request->ticketNo)) {
            $ticket = Ticket::where('no_ticket', $request->ticketNo)->with('order')->first();
            if (!is_null($ticket)) {

                if ($ticket->status == 2) {
                    // Sudah Checkim
                    $param['message'] = 'No tiket tidak dapat digunakan check in lebih dari satu kali';
                } else {
                    $event = Order::where('id', $ticket->order_id)->with(['customer', 'event'])->first();
                    // Update status order
                    Ticket::where('no_ticket', $request->ticketNo)->update(['status' => 2]); // Sudah CheckIn

                    $param['event'] = $event;
                    $param['ticket'] = $ticket;
                    $param['ticketNo'] = $request->ticketNo;
                }
            } else {
                $param['message'] = 'No tiket tidak ditemukan';
            }
        }

        return Inertia::render('CheckIn/Index', $param);
    }
}
