<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        \App\Models\Event::create([
            'title' => 'Kolam Renang',
            'location' => 'Kolam Renang, Tangerang Selatan',
            'event_date' => '2023-05-01',
            'start_time' => '07:00:00',
            'price' => 200000,
        ]);

        \App\Models\User::create([
            'name' => 'Agen-X',
            'email' => 'agenx@gmail.com',
            'email_verified_at' => date('Y-m-d H:i:s'),
            'password' => Hash::make('12345678'),
        ]);
    }
}
