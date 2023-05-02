import React, { useEffect } from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head, useForm } from '@inertiajs/inertia-react';
import axios from 'axios';

export default function Orders(props) {

    const [dataOrder, setDataOrder] = React.useState(props.orders);
    const { data, setData, get, post, errors} = useForm({
        qty_ticket: '',
        orderId: ''
    });

    const [showModal, setShowModal] = React.useState(false);
    const [orderId, setOrderId] = React.useState();

    const [errorsForm, setErrorsForm] = React.useState({
        orderId: '',
        qty_ticket: ''
    })

    const showModalDelete = (orderId) => {
        event.preventDefault();
        document.getElementById('my-modal').checked = true; // Show Modal
        setOrderId(orderId);
    }

    const hapus =() => {
        let url = route('orders.delete', {id: orderId});
        get(url, {
            onSuccess: () => {
                // setSuccess(true);
                document.getElementById('modalFeedback').checked = true;
                setTimeout(() => {
                    document.getElementById('modalFeedback').checked = false;
                }, 2000)
            },
        });
    }

    const showModalEdit = async (e, orderId) => {
        document.getElementById("modalForm").checked = true;

        let url = route('orders.show', {id: orderId});
        let response = await axios.get(url);
        let data = response.data;


        document.getElementById("name").value = data.order.customer.name;
        document.getElementById("identityNo").value = data.order.customer.identity_no;
        document.getElementById("qty_ticket").value = data.order.qty_order;
        document.getElementById("order_id").value = data.order.id;

        let newData = {
            qty_ticket: data.order.qty_order,
            orderId: data.order.id
        };

        setData(newData);
    }

    const onHandleChange = (event) => {
        setData(event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value);
    };

    const hanyaAngka = (event) => {
        if (!/[0-9]/.test(event.key)) {
            event.preventDefault();
        }
    }

    const validateForm = () => {
        let errorMessage = {};

        if ( data.qty_ticket == "" ) {
            errorMessage.qty_ticket = "Jumlah tiket wajib diisi";
        } else {
            errorMessage.qty_ticket = "";
        }

        setErrorsForm(errorMessage);
    }

    const submit = async (e) => {
        e.preventDefault();

        validateForm();

        // cek apakah seluruh form valid atau masih ada error
        let formValid = true;
        for (let propName in errors) {
            if (errorsForm[propName].length > 0) {
                formValid = false;
            }
        }

        if ( formValid ) {
            document.getElementById("modalForm").checked = false;

            post(route('orders.update'), {
                onSuccess: (datas) => {
                    let data = datas.props;
                    document.getElementById("modalFeedback").checked = true;

                    if ( data.error ) {
                        document.getElementById("info").innerText = "Gagal";
                        document.getElementById("message").innerText = data.error;
                        document.getElementById("icon").classList.add("hidden");
                    } else {
                        document.getElementById("info").innerText = "Sukses";
                        document.getElementById("message").innerText = "Pesanan berhasil diedit";
                        document.getElementById("icon").classList.remove("hidden");
                    }

                    setTimeout(() => {
                        document.getElementById("modalFeedback").checked = false;
                    }, 3000);

                    setDataOrder(data.orders);
                }
            });
        } else {

        }

    }

    const cariPemesan = (e) => {
        var input, filter, table, tr, td, td2, td3, i, txtValue, txtValue2, txtValue3;
        input = document.getElementById("search");
        filter = input.value.toUpperCase();
        table = document.getElementById("table-pemesan");
        tr = table.getElementsByTagName("tr");
        for (i = 0; i < tr.length; i++) {
            td = tr[i].getElementsByTagName("td")[1];
            td2 = tr[i].getElementsByTagName("td")[2];
            td3 = tr[i].getElementsByTagName("td")[3];

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
                        <div className='flex justify-between flex-wrap border-b border-gray-200 '>
                            <div className="p-6 bg-white text-lg font-weight-bold">Daftar Pemesan</div>
                            <input type="text" id="search" onKeyUp={(e) => cariPemesan(e)} placeholder="Cari daftar pemesan .." className="input input-bordered w-full max-w-xs mt-3 mr-3" />
                        </div>

                        <div className="p-6 overflow-x-auto">
                            <table className="table w-full" id="table-pemesan">
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>Waktu Pemesanan</th>
                                        <th>No KTP</th>
                                        <th>Nama</th>
                                        <th>Jumlah Pemesanan</th>
                                        <th align='center'>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        dataOrder.length > 0 ?
                                        (dataOrder.map((order, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td> {++index}</td>
                                                    <td> {
                                                            new Date(order.order_time).toLocaleDateString('in-ID', {
                                                                hour: 'numeric',
                                                                minute: 'numeric',
                                                            })
                                                    }</td>
                                                    <td> {order.customer.identity_no}</td>
                                                    <td> {order.customer.name}</td>
                                                    <td> {order.qty_order}</td>
                                                    <td align='center'>
                                                        <label className="bg-gray-400 hover:bg-gray-600 text-white py-1 px-3 rounded-xl cursor-pointer" onClick={(e) => showModalEdit(e, order.id)}>Edit</label>
                                                        <label htmlFor="my-modal" className="bg-red-600 hover:bg-red-900 text-white py-1 px-3 mx-2 rounded-xl cursor-pointer" onClick={() => showModalDelete(order.id)}>Hapus</label>
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


            {/* Modal Edit */}
            <input type="checkbox" id="modalForm" className="modal-toggle" />
            <div className="modal">
                <div className="modal-box relative">
                    <label htmlFor="modalForm" className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>

                    <h3 className="text-lg font-bold">Edit Pesanan</h3>

                    <form onSubmit={submit}>

                        <input type="hidden" name="order_id" value={data.orderId} id="order_id" />

                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text">Nama Lengkap</span>
                            </label>
                            <input type="text" value={data.name} className="input input-bordered w-full" name="name" id="name" disabled/>
                            {
                                errorsForm.name &&
                                <label className="label">
                                    <span className="label-text-alt text-xs text-red-600">{errorsForm.name}</span>
                                </label>
                            }
                        </div>

                        <div className="form-control w-full mt-3">
                            <label className="label">
                                <span className="label-text">No KTP</span>
                            </label>
                            <input type="text" value={data.identityNo} className="input input-bordered w-full" name="identityNo" id="identityNo" disabled/>
                            {
                                errorsForm.identityNo &&
                                <label className="label">
                                    <span className="label-text-alt text-xs text-red-600">{errorsForm.identityNo}</span>
                                </label>
                            }
                        </div>

                        <div className="form-control w-full mt-3">
                            <label className="label">
                                <span className="label-text">Jumlah tiket</span>
                            </label>
                            <input type="text" onKeyPress={(event) => hanyaAngka(event)} maxLength="2" onChange={onHandleChange} value={data.qty_ticket} className="input input-bordered w-full" name="qty_ticket" id="qty_ticket" />
                            {
                                errorsForm.qty_ticket &&
                                <label className="label">
                                    <span className="label-text-alt text-xs text-red-600">{errorsForm.qty_ticket}</span>
                                </label>
                            }
                        </div>

                        <div className='mt-5 text-right'>
                            <button type="submit" className='bg-gray-500 hover:bg-gray-600 py-2 rounded-xl px-3 text-white text-right'> Simpan </button>
                        </div>

                    </form>
                </div>
            </div>

            <input type="checkbox" id="my-modal" className="modal-toggle" />
            <div className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Konfirmasi</h3>
                    <p className="py-4">Anda yakin akan menghapus data pemesanan ini?</p>
                    <div className="modal-action">
                        <label htmlFor="my-modal2" className="btn btn-ghost  hover:bg-gray-500 hover:text-white border-none px-3 rounded-xl" onClick={() => document.getElementById('my-modal').checked=false}>Batal</label>
                        <label htmlFor="my-modal" className="btn bg-red-600 hover:bg-red-900 border-none px-3 rounded-xl" onClick={() => hapus()}>Hapus</label>
                    </div>
                </div>
            </div>


            <input type="checkbox" id="modalFeedback" className="modal-toggle" />
            <label htmlFor="my-modal-4" className="modal cursor-pointer">
                <label className="modal-box relative" htmlFor="">
                    <label className='flex items-start'>
                        <div id="icon" className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                            <svg className="h-6 w-6 text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className='ml-4'>
                            <h3 className="text-lg font-bold" id="info">Sukses</h3>
                            <p className="" id="message">Data berhasil dihapus</p>
                        </div>
                    </label>
                </label>
            </label>
        </Authenticated>
    );
}
