<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Ticket;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use App\Models\Customer;
use App\Models\Event;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    //

    public function index(Request $request)
    {
        $orders = Order::with('customer')->get();
        $param['orders'] = $orders;
        return Inertia::render('Orders/Index', $param);
    }

    public function deleteOrder(Request $request, $orderId)
    {
        Ticket::where('order_id', $orderId)->delete();
        $order = Order::find($orderId);
        Customer::find($order->customer->id)->delete();
        $order->delete();
        return Redirect::route('orders');
    }

    public function orderTicket(Request $request)
    {

        DB::beginTransaction();
        try {

            $newCustomer = Customer::create([
                'name' => $request->name,
                'identity_no' => $request->identityNo,
                'email' => $request->email,
                'phone_no' => $request->phone_no,
            ]);

            $event = Event::latest('id')->first();
            if (is_null($event)) {
                $event = Event::create([
                    "title" => "Kolam Renang",
                    "location" => "Kolam Renang, Tangerang Selatan",
                    "event_date" => "'2023-05-01'",
                    "start_time" => "07:00:00",
                    "price" => 200000,
                    "created_at" => "2022-07-27 00:00:00",
                    "updated_at" => "2022-07-27 00:00:00"
                ]);
            }


            $totalPayment = $event->price * $request->qty_ticket;

            $order = Order::create([
                'event_id' => $event->id,
                'customer_id' => $newCustomer->id,
                'order_time' => date("Y-m-d H:i:s"),
                'qty_order' => $request->qty_ticket,
                'total_payment' => $totalPayment
            ]);


            for ($i = 0; $i < $request->qty_ticket; $i++) {
                $ticketNo = strtoupper(Str::random(7)) . '-' . rand(1, 99999999) . '-' . strtoupper(Str::random(4));

                Ticket::create([
                    'order_id' => $order->id,
                    'no_ticket' => $ticketNo,
                    'status' => 1,
                ]);
            }

            DB::commit();

            return Inertia::render('Welcome');
        } catch (\Exception $e) {
            DB::rollback();
            if ($e->getCode() == "23000") {
                $param['error'] = "Email sudah digunakan. Masukkan email yang lain";
            } else {
                $param['error'] = $e->getMessage();
            }
            return Inertia::render('Welcome', $param);
        }
    }

    public function show(Request $request, $orderId)
    {
        $param['order'] = Order::where('id', $orderId)->with('customer')->first();
        return response()->json($param);
    }

    public function update(Request $request)
    {
        DB::beginTransaction();
        try {

            Order::find($request->orderId)
                ->update([
                    'qty_order' => $request->qty_ticket
                ]);

            Ticket::where('order_id', $request->orderId)->delete();

            for ($i = 0; $i < $request->qty_ticket; $i++) {
                $ticketNo = strtoupper(Str::random(7)) . '-' . rand(1, 99999999) . '-' . strtoupper(Str::random(4));
                Ticket::create([
                    'order_id' => $request->orderId,
                    'no_ticket' => $ticketNo,
                    'status' => 1,
                ]);
            }

            DB::commit();

            return Redirect::route('orders');
        } catch (\Exception $e) {
            DB::rollback();
            return Inertia::render('Orders/Index', [
                'error' => $e->getMessage()
            ]);
        }
    }
}
