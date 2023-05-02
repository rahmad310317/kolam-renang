import React, { useEffect, useRef } from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head, useForm } from '@inertiajs/inertia-react';

export default function CheckIn(props) {

    const {get} = useForm();
    const [ticketNo, setTicketNo] = React.useState("");
    const [disableButton, setDisableButton] = React.useState("disabled");
    const [displayValidation, setDisplayValidation] = React.useState("hidden");
    const [dataTicket, setDataTicket] = React.useState({
        noTicket: "",
    });

    const handleChangeInput = (e) => {
        let value = e.target.value;

        console.log(value.length);

        if ( value.length <= 0 ) {
            setDisableButton("disabled");
            setDisplayValidation("block");
        } else {
            setDisableButton("");
            setDisplayValidation("hidden");
        }

        setTicketNo(e.target.value);
    }

    const cariTiket = () => {
        let url = route('checkIn', {ticketNo: ticketNo});
        get(url, {
            onSuccess: (datas) => {
                let data = datas.props;
                console.log(data);

                if ( datas.props?.event ) {
                    document.getElementById('my-modal-5').checked = true;

                    let eventDate = new Date(data.event.event.event_date).toLocaleDateString('in-ID')
                    let eventTime = data.event.event.start_time.substring(0, 5);
                    let price = data.event.event.price;
                    let title = data.event.event.title;

                    document.getElementById("waktu_dan_tempat").innerText = eventDate + ' ' + eventTime + '\n' + data.event.event.location;
                    document.getElementById("harga").innerText = price.toLocaleString('in-ID');
                    document.getElementById("name").innerText = data.event.customer.name;
                    document.getElementById("title").innerText = data.event.event.title;
                    document.getElementById("noticket").innerText = data.ticket.no_ticket;
                    document.getElementById("tgl_pesan").innerText = data.event.order_time;
                } else {

                    document.getElementById("msg").innerText = data.message;
                    document.getElementById("modalFeedback").checked = true;
                    setTimeout(() => {
                        document.getElementById("modalFeedback").checked = false;
                        document.getElementById("btn-cari").removeAttribute("disabled");
                    }, 3000);
                }

                document.getElementById("keyword").value = ticketNo;


            }
        })
    }

    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
        >
            <Head title="Check In Ticket" />



            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200 flex items-start">
                            <div className="form-control">
                                <div className="input-group">
                                    <input type="text" id="keyword" value={ticketNo} onChange={(e) => handleChangeInput(e)} placeholder="Cari no tiket ..." className="input input-bordered" style={{ 'flex': '0 0 100%' }}/>
                                    <button id="btn-cari" className="btn btn-square" disabled={disableButton} onClick={() => cariTiket()}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                    </button>
                                </div>
                                <p className={'text-xs mt-2 text-red-600 ' + displayValidation}> Wajib diisi</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* <label htmlFor="my-modal-5" className="btn modal-button">open modal</label> */}


            <input type="checkbox" id="my-modal-5" className="modal-toggle" />
            <div className="modal">
                <div className="modal-box w-11/12 max-w-5xl p-0 ">
                        <label htmlFor="my-modal-5" className="btn btn-sm btn-circle hover:bg-slate-400 absolute right-2 top-2 bg-white text-gray-600">✕</label>

                    <div className="flex bg-zinc-700">
                        <div className='border-r-2 border-dashed py-5' style={{'flex': '3'}}>
                            <h3 className="text-lg text-white pl-5" id="title">

                            </h3>
                        </div>
                        <div className='text-white ml-2 w-32 py-3 px-5' style={{'flex': '1'}}>
                            <p className='mb-3 text-xs mb-0'> NO TIKET .</p>
                            <p className='mb-3 text-md mb-0' id="noticket">  </p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between ">
                        <div className='border-r-2 border-dashed border-black pt-5' style={{'flex': '3'}}>
                            <div className='mb-3 px-5'>
                                <p className='text-gray-400'> Waktu & Tempat </p>
                                <p className="py-4 pt-1" id="waktu_dan_tempat"></p>
                            </div>

                            <div className='mb-3 px-5'>
                                <p className='text-gray-400'> Harga </p>
                                <p className="py-4 pt-1" id="harga"></p>
                            </div>

                            <div className='border-t-2 border-black flex'>
                                <div className='flex-1 border-r-2 border-black'>
                                    <div className='py-3 px-5'>
                                        <p className='text-gray-400'> Nama </p>
                                        <p className="py-4 pt-1" id="name"></p>
                                    </div>
                                </div>
                                <div className='flex-1'>
                                <div className='py-3 pl-3' >
                                        <p className='text-gray-400'> Tanggal Pemesanan </p>
                                        <p className="py-4 pt-1" id="tgl_pesan"></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='ml-2 py-3 px-5' style={{'flex': '1'}}>
                            <p className='text-gray-400'> Status </p>
                            <p className='mb-3 text-md'> Berhasil Check in </p>
                        </div>
                    </div>
                </div>
            </div>


            <input type="checkbox" id="modalFeedback" className="modal-toggle" />
            <label htmlFor="my-modal-4" className="modal cursor-pointer">
                <label className="modal-box relative" htmlFor="">
                    <label className='flex items-start'>
                        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
                            <svg className="h-6 w-6 text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className='ml-4'>
                            <h3 className="text-lg font-bold">Warning</h3>
                            <p className="" id="msg">No Tiket tidak ditemukan</p>
                        </div>
                    </label>
                </label>
            </label>



        </Authenticated>
    );
}
