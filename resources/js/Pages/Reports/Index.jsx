import React, { useEffect } from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head, useForm } from '@inertiajs/inertia-react';

export default function Reports(props) {


    const [data, setData] = React.useState(props.tickets);

   const cariData = (e) => {
        var input, filter, table, tr, td, td2, td3, i, txtValue, txtValue2, txtValue3;
        input = document.getElementById("search");
        filter = input.value.toUpperCase();
        table = document.getElementById("table-report");
        tr = table.getElementsByTagName("tr");
        for (i = 0; i < tr.length; i++) {
            td = tr[i].getElementsByTagName("td")[0];
            td2 = tr[i].getElementsByTagName("td")[1];
            td3 = tr[i].getElementsByTagName("td")[2];

            if (td || td2 || td3) {
                txtValue = td.textContent || td.innerText;
                txtValue2 = td2.textContent || td2.innerText;
                txtValue3 = td3.textContent || td3.innerText;

                if (
                    (txtValue.toUpperCase().indexOf(filter) > -1) ||
                    (txtValue2.toUpperCase().indexOf(filter) > -1) ||
                    (txtValue3.toUpperCase().indexOf(filter) > -1)
                ) {
                    tr[i].style.display = "";
                } else {
                    tr[i].style.display = "none";
                }
            }
        }
    }

    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
        >
            <Head title="Daftar Pemesan" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className='flex justify-between flex-wrap border-b border-gray-200'>
                            <div className="p-6 bg-white  text-lg font-weight-bold">Laporan Pemesanan</div>
                            <input type="text" id="search" onKeyUp={(e) => cariData(e)} placeholder="Cari daftar pemesan .." className="input input-bordered w-full max-w-xs mt-3 mr-3" />
                        </div>
                        <div className="p-6 overflow-x-auto">
                            <table className="table w-full" id="table-report">
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>No Tiket</th>
                                        <th>No KTP</th>
                                        <th>Nama</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        data.length > 0 ?
                                        (data.map((ticket, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td> {++index}</td>
                                                    <td> {ticket.no_ticket}</td>
                                                    <td> {ticket.order.customer.identity_no}</td>
                                                    <td> {ticket.order.customer.name}</td>
                                                    <td>
                                                        {
                                                            ticket.status == 1 ? (
                                                                <div className="badge bg-gray-400 gap-1 border-none py-4">
                                                                    Belum Check-In
                                                                </div>
                                                            ) : (
                                                                <div className="badge bg-green-600 gap-1 border-none py-4">
                                                                    Sudah Check-In
                                                                </div>
                                                            )
                                                        }
                                                    </td>
                                                </tr>
                                            )
                                        }))
                                        :  (
                                            <tr>
                                                <td colSpan={6} align="center"> Data belum tersedia </td>
                                            </tr>
                                        )
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>



        </Authenticated>
    );
}
