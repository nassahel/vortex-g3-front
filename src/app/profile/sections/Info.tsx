import { User } from '@/types/types';
import { useEffect, useState } from 'react';

type Props = {
    user: User;
};

const Info = ({ user }: Props) => {
    // const info = user && user.profile;
    const [edit, setEdit] = useState<string>('');
    const [inputData, setInputData] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [dni, setDni] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [birthday, setBirthday] = useState<string>('');

    const updateProfile = async (field: string) => {
        const URL = process.env.NEXT_PUBLIC_API_URL;
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${URL}profile/update/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ [field]: inputData }),
            });
            const data = await response.json();
            console.log(data);
            

            if (response.ok) {
                // Actualiza el estado local de forma adecuada
                switch (field) {
                    case 'address':
                        setAddress(inputData);
                        break;
                    case 'dni':
                        setDni(inputData);
                        break;
                    case 'phone':
                        setPhone(inputData);
                        break;
                    case 'birthdate':
                        setBirthday(inputData);
                        break;
                }
                setEdit('');
            }
        } catch (error) {
            console.error('No se pudo obtener los datos', error);
        }
    };

    useEffect(() => {
        if (user?.profile) {
            setAddress(user.profile.address);
            setBirthday(user.profile.birthday);
            setDni(user.profile.dni);
            setPhone(user.profile.phone);
        }
    }, [user]); // Solo dependemos de `user` para que se ejecute una sola vez

    const inputStyle = 'bg-neutral-200 outline-none px-1';

    return (
        <div className="space-y-4 bg-white border border-gray-300 rounded-lg p-5 shadow-sm">
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-sm font-semibold text-gray-800">Dirección</p>
                    {edit === 'address' ? (
                        <input
                            onChange={(e) => setInputData(e.target.value)}
                            value={inputData}
                            className={inputStyle}
                            type="text"
                            name="address"
                            id="address"
                        />
                    ) : (
                        <p className="text-sm text-gray-600">{address}</p>
                    )}
                </div>
                {edit === 'address' ? (
                    <button
                        onClick={() => updateProfile('address')}
                        className="text-xs font-medium border border-gray-800 px-3 py-1 rounded hover:bg-gray-100 transition"
                    >
                        Guardar
                    </button>
                ) : (
                    <button
                        onClick={() => {
                            setEdit('address');
                            setInputData(address); // Cargar el valor actual al input cuando se edite
                        }}
                        className="text-xs font-medium border border-gray-800 px-3 py-1 rounded hover:bg-gray-100 transition"
                    >
                        Editar
                    </button>
                )}
            </div>

            {/* Fecha de nacimiento */}
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-sm font-semibold text-gray-800">Fecha de nacimiento</p>
                    {edit === 'bdate' ? (
                        <input
                            onChange={(e) => setInputData(e.target.value)}
                            value={inputData}
                            className={inputStyle}
                            type="text"
                            name="bdate"
                            id="bdate"
                        />
                    ) : (
                        <p className="text-sm text-gray-600">{birthday}</p>
                    )}
                </div>
                {edit === 'bdate' ? (
                    <button
                        onClick={() => updateProfile('birthdate')}
                        className="text-xs font-medium border border-gray-800 px-3 py-1 rounded hover:bg-gray-100 transition"
                    >
                        Guardar
                    </button>
                ) : (
                    <button
                        onClick={() => {
                            setEdit('bdate');
                            setInputData(birthday); // Cargar el valor actual al input cuando se edite
                        }}
                        className="text-xs font-medium border border-gray-800 px-3 py-1 rounded hover:bg-gray-100 transition"
                    >
                        Editar
                    </button>
                )}
            </div>

            {/* DNI */}
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-sm font-semibold text-gray-800">DNI</p>
                    {edit === 'dni' ? (
                        <input
                            onChange={(e) => setInputData(e.target.value)}
                            value={inputData}
                            className={inputStyle}
                            type="text"
                            name="dni"
                            id="dni"
                        />
                    ) : (
                        <p className="text-sm text-gray-600">{dni}</p>
                    )}
                </div>
                {edit === 'dni' ? (
                    <button
                        onClick={() => updateProfile('dni')}
                        className="text-xs font-medium border border-gray-800 px-3 py-1 rounded hover:bg-gray-100 transition"
                    >
                        Guardar
                    </button>
                ) : (
                    <button
                        onClick={() => {
                            setEdit('dni');
                            setInputData(dni); // Cargar el valor actual al input cuando se edite
                        }}
                        className="text-xs font-medium border border-gray-800 px-3 py-1 rounded hover:bg-gray-100 transition"
                    >
                        Editar
                    </button>
                )}
            </div>

            {/* Teléfono */}
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-sm font-semibold text-gray-800">Teléfono</p>
                    {edit === 'phone' ? (
                        <input
                            onChange={(e) => setInputData(e.target.value)}
                            value={inputData}
                            className={inputStyle}
                            type="text"
                            name="phone"
                            id="phone"
                        />
                    ) : (
                        <p className="text-sm text-gray-600">{phone}</p>
                    )}
                </div>
                {edit === 'phone' ? (
                    <button
                        onClick={() => updateProfile('phone')}
                        className="text-xs font-medium border border-gray-800 px-3 py-1 rounded hover:bg-gray-100 transition"
                    >
                        Guardar
                    </button>
                ) : (
                    <button
                        onClick={() => {
                            setEdit('phone');
                            setInputData(phone); // Cargar el valor actual al input cuando se edite
                        }}
                        className="text-xs font-medium border border-gray-800 px-3 py-1 rounded hover:bg-gray-100 transition"
                    >
                        Editar
                    </button>
                )}
            </div>
        </div>
    );
};

export default Info;
