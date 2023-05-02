import React from 'react';
import { Link, Head, useForm} from '@inertiajs/inertia-react';
import bg from '@/Images/wp12345.jpg';

let bgShadow = {
    background: "rgb(34 34 34 / 54%)",
    zIndex: 1,
    top: 9,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: "absolute"
}

export default function Welcome(props) {

    const { data, setData, post } = useForm({
        name: '',
        identityNo: '',
        email: '',
        phone_no: '',
        qty_ticket: ''
    });

    const [errors, setErrors] = React.useState({
        name: '',
        identityNo: '',
        email: '',
        phone_no: '',
        qty_ticket: ''
    })

    const showModal = (e) => {
        document.getElementById('my-modal-3').checked = true;
        reset(e);
    }

    const onHandleChange = (event) => {
        setData(event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value);
    };

    const reset = (e) => {
        e.preventDefault();
        setData({
             name: '',
            identityNo: '',
            email: '',
            phone_no: '',
            qty_ticket: ''
        });

        setErrors({
            name: '',
            identityNo: '',
            email: '',
            phone_no: '',
            qty_ticket: ''
        });
    }

    const validateForm = () => {
        let errorMessage = {};

        if ( data.name == "" ) {
            errorMessage.name = "Nama wajib diisi";
        } else {
            errorMessage.name = "";
        }

        if ( data.identityNo == "" ) {
            errorMessage.identityNo = "No KTP Wajib diisi";
        } else if ( data.identityNo.length != 15 ) {
            errorMessage.identityNo = "No KTP Wajib diisi 16 karakter";
        } else {
            errorMessage.identityNo = "";
        }

        if ( data.email == "" ) {
            errorMessage.email = "Email wajib diisi";
        } else {
            errorMessage.email = "";
        }

        if ( data.phone_no == "" ) {
            errorMessage.phone_no = "No HP wajib diisi";
        } else {
            errorMessage.phone_no = "";
        }

        if ( data.qty_ticket == "" ) {
            errorMessage.qty_ticket = "Jumlah tiket wajib diisi";
        } else {
            errorMessage.qty_ticket = "";
        }

        setErrors(errorMessage);
    }

    const hanyaAngka = (event) => {
        if (!/[0-9]/.test(event.key)) {
            event.preventDefault();
        }
    }

    const submit = (e) => {
        e.preventDefault();

        validateForm();

        // cek apakah seluruh form valid atau masih ada error
        let formValid = true;
        for (let propName in errors) {
            if (errors[propName].length > 0) {
                formValid = false;
            }
        }

        if ( formValid ) {
            document.getElementById("my-modal-3").checked = false;

            post(route('orders.ticket'), {
                onSuccess: (datas) => {
                    let data = datas.props;
                    document.getElementById("modalFeedback").checked = true;

                    if ( data.error ) {
                        document.getElementById("info").innerText = "Gagal";
                        document.getElementById("message").innerText = data.error;
                        document.getElementById("icon").classList.add("hidden");
                    } else {
                        document.getElementById("info").innerText = "Sukses";
                        document.getElementById("message").innerText = "Pembelian tiket berhasil. \n Tiket akan dikirimkan melalu WA sesuai dengan No Hp yang telah didaftarkan";
                        document.getElementById("icon").classList.remove("hidden");
                    }

                    setTimeout(() => {
                        document.getElementById("modalFeedback").checked = false;
                    }, 3000);
                }
            });
        } else {

        }
    }

    return (
        <>
            <Head title="Welcome" />

            <div className="relative flex items-top justify-center min-h-screen bg-gray-100 dark:bg-gray-900 sm:items-center sm:pt-0 after:bg-slate-400"
               style={{
                backgroundImage: `url(${bg})`,
                backgroundSize: 'cover'
             }}>
                <div style={ bgShadow }></div>

                <div style={{  zIndex: 2 }}>

                <div className="fixed top-0 right-0 px-6 py-4 sm:block">
                        {props.auth.user ? (
                            <Link href={route('dashboard')} className="text-sm text-gray-700 underline">
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link href={route('login')} className="text-sm text-white hover:underline">
                                    Log in
                                </Link>

                                <Link href={route('register')} className="ml-4 text-sm text-white hover:underline">
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                    <h1 className='text-white text-4xl font-bold uppercase mt-40'> Kolam Renang Tangeran Selatan </h1>

                    <div className='flex min-h-screen items-center justify-center bg-'>
                        <button className='my-10 block mx-auto bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 py-3 px-3 rounded-xl font-inter font-semibold text-white shadow-2xl' onClick={(e) => showModal(e)}> Beli Tiket </button>
                    </div>

                    <input type="checkbox" id="my-modal-3" className="modal-toggle" />
                    <div className="modal">
                        <div className="modal-box relative">
                            <label htmlFor="my-modal-3" className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
                            <h1 className='text-lg font-bold text-white bg-red'>Kolam Renang Tangeran Selatan </h1>

                            <h3 className="text-lg font-bold text-slate-600">Beli Tiket</h3>
                            <p className="py-4 text-sm pt-0">Silakan isi biodata Anda</p>

                            <form onSubmit={submit}>

                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text">Nama Lengkap</span>
                                    </label>
                                    <input type="text" onChange={onHandleChange} value={data.name} className="input input-bordered w-full" name="name" id="name"/>
                                    {
                                        errors.name &&
                                        <label className="label">
                                            <span className="label-text-alt text-xs text-red-600">{errors.name}</span>
                                        </label>
                                    }
                                </div>

                                <div className="form-control w-full mt-3">
                                    <label className="label">
                                        <span className="label-text">No KTP</span>
                                    </label>
                                    <input type="text" onKeyPress={(event) => hanyaAngka(event)} maxLength="16" onChange={onHandleChange} value={data.identityNo} className="input input-bordered w-full" name="identityNo" id="identityNo" />
                                    {
                                        errors.identityNo &&
                                        <label className="label">
                                            <span className="label-text-alt text-xs text-red-600">{errors.identityNo}</span>
                                        </label>
                                    }
                                </div>

                                <div className="form-control w-full mt-3">
                                    <label className="label">
                                        <span className="label-text">Email</span>
                                    </label>
                                    <input type="email" onChange={onHandleChange} value={data.email} className="input input-bordered w-full" name="email" id="email" />
                                    {
                                        errors.email &&
                                        <label className="label">
                                            <span className="label-text-alt text-xs text-red-600">{errors.email}</span>
                                        </label>
                                    }
                                </div>

                                <div className="form-control w-full mt-3">
                                    <label className="label">
                                        <span className="label-text">No Hp</span>
                                    </label>
                                    <input type="text" onKeyPress={(event) => hanyaAngka(event)} maxLength="20" onChange={onHandleChange} value={data.phone_no} className="input input-bordered w-full" name="phone_no" id="phone_no" />
                                    {
                                        errors.phone_no &&
                                        <label className="label">
                                            <span className="label-text-alt text-xs text-red-600">{errors.phone_no}</span>
                                        </label>
                                    }
                                </div>

                                <div className="form-control w-full mt-3">
                                    <label className="label">
                                        <span className="label-text">Jumlah tiket</span>
                                    </label>
                                    <input type="text" onKeyPress={(event) => hanyaAngka(event)} maxLength="2" onChange={onHandleChange} value={data.qty_ticket} className="input input-bordered w-full" name="qty_ticket" id="qty_ticket" />
                                    {
                                        errors.qty_ticket &&
                                        <label className="label">
                                            <span className="label-text-alt text-xs text-red-600">{errors.qty_ticket}</span>
                                        </label>
                                    }
                                </div>

                                <div className='mt-5 text-right'>
                                    <button className='hover:bg-gray-400 py-2 rounded-xl px-3 hover:text-white text-right mr-3' onClick={(e) => reset(e)}> Reset </button>
                                    <button type="submit" className='bg-gray-500 hover:bg-gray-600 py-2 rounded-xl px-3 text-white text-right'> Simpan </button>
                                </div>

                            </form>
                        </div>
                    </div>

                </div>

            </div>

            <input type="checkbox" id="modalFeedback" className="modal-toggle" />
            <label htmlFor="my-modal-4" className="modal cursor-pointer">
                <label className="modal-box relative" htmlFor="">
                    <label className='flex items-start'>
                        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10" id="icon">
                            <svg className="h-6 w-6 text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                {/*  */}
                            </svg>
                        </div>
                        <div className='ml-4'>
                            <h3 className="text-lg font-bold" id="info"></h3>
                            <p className="" id="message"></p>
                        </div>
                    </label>
                </label>
            </label>
        </>


    );
}
