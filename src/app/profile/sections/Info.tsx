import React, { useEffect, useState } from 'react'

type Props = {
    user: any
}


const Info = ({ user }: Props) => {
    const info = user && user.profile;
    const [edit, setEdit] = useState<string>('');
    const [inputData, setInputData] = useState<string>('');


    console.log(inputData);


    const updateProfile = async (field: string) => {
        const URL = process.env.NEXT_PUBLIC_API_URL;
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${URL}profile/update/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ [field]: inputData })
            });
            const data = await response.json();
            if (response) {
                setEdit('');
            }
        } catch (error) {
            console.error('No se pudo obtener los datos', error);
        }
    }


    const inputStyle = 'bg-neutral-200 outline-none px-1'

    return (
        <div className="space-y-4 bg-white border border-gray-300 rounded-lg p-5 shadow-sm">
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-sm font-semibold text-gray-800">Dirección</p>
                    {
                        edit === 'address' ? <input onChange={(e) => setInputData(e.target.value)} className={inputStyle} type="text" name="address" id="address" /> :
                            <p className="text-sm text-gray-600">{info?.address || "Sin especificar"}</p>

                    }
                </div>
                {
                    edit === 'address' ? <button onClick={() => updateProfile('address')} className="text-xs font-medium border border-gray-800 px-3 py-1 rounded hover:bg-gray-100 transition">
                        Guardar
                    </button> :
                        <button onClick={() => setEdit('address')} className="text-xs font-medium border border-gray-800 px-3 py-1 rounded hover:bg-gray-100 transition">
                            Editar
                        </button>
                }

            </div>

            {/* Fecha de nacimiento */}
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-sm font-semibold text-gray-800">Fecha de nacimiento</p>
                    {
                        edit === 'bdate' ? <input onChange={(e) => setInputData(e.target.value)} className={inputStyle} type="text" name="bdate" id="bdate" /> :
                            <p className="text-sm text-gray-600">{info?.birthday || "Sin especificar"}</p>

                    }
                </div>
                {
                    edit === 'bdate' ? <button onClick={() => updateProfile('birthdate')} className="text-xs font-medium border border-gray-800 px-3 py-1 rounded hover:bg-gray-100 transition">
                        Guardar
                    </button> :
                        <button onClick={() => setEdit('bdate')} className="text-xs font-medium border border-gray-800 px-3 py-1 rounded hover:bg-gray-100 transition">
                            Editar
                        </button>
                }

            </div>

            {/* DNI */}
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-sm font-semibold text-gray-800">DNI</p>
                    {
                        edit === 'dni' ? <input onChange={(e) => setInputData(e.target.value)} className={inputStyle} type="text" name="dni" id="dni" /> :
                            <p className="text-sm text-gray-600">{info?.dni || "Sin especificar"}</p>

                    }
                </div>
                {
                    edit === 'dni' ? <button onClick={() => updateProfile('dni')} className="text-xs font-medium border border-gray-800 px-3 py-1 rounded hover:bg-gray-100 transition">
                        Guardar
                    </button> :
                        <button onClick={() => setEdit('dni')} className="text-xs font-medium border border-gray-800 px-3 py-1 rounded hover:bg-gray-100 transition">
                            Editar
                        </button>
                }

            </div>

            {/* Teléfono */}
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-sm font-semibold text-gray-800">Teléfono</p>
                    {
                        edit === 'phone' ? <input onChange={(e) => setInputData(e.target.value)} className={inputStyle} type="text" name="phone" id="phone" /> :
                            <p className="text-sm text-gray-600">{info?.phone || "Sin especificar"}</p>

                    }
                </div>
                {
                    edit === 'phone' ? <button onClick={() => updateProfile('phone')} className="text-xs font-medium border border-gray-800 px-3 py-1 rounded hover:bg-gray-100 transition">
                        Guardar
                    </button> :
                        <button onClick={() => setEdit('phone')} className="text-xs font-medium border border-gray-800 px-3 py-1 rounded hover:bg-gray-100 transition">
                            Editar
                        </button>
                }

            </div>
        </div>
    )
}

export default Info
