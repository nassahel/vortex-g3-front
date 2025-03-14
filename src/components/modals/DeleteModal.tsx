import toast from "react-hot-toast";

interface Props {
    setDeleteModal: (value: boolean) => void;
    itemId: string | null;
    elemento?: string;
    nombre?: string;
    ruta: string;
}

export const DeleteModal: React.FC<Props> = ({ setDeleteModal, itemId, nombre, elemento, ruta }) => {
    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${ruta}${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                toast.success(`${elemento} eliminado`);
                setDeleteModal(false);
            } else {
                toast.error(`No se pudo eliminar el ${elemento}`);
            }
        } catch (error) {
            toast.error(`Error al eliminar el ${elemento}`);
        }
    };

    return (
        <div className="fixed z-50 top-0 left-0 right-0 bottom-0 flex justify-center text-center items-center bg-black/50">
            <div className="bg-white py-6 px-4 shadow-md rounded-md w-[20rem]">
                <h3>¿Deseas borrar al {elemento} <span className="font-bold">"{nombre}"?</span></h3>
                <div className="mt-6 flex justify-between px-2">
                    <button onClick={() => setDeleteModal(false)} className="py-1 px-2 bg-gray-500 text-white rounded">Cancelar</button>
                    <button onClick={handleDelete} className="py-1 px-2 bg-red-500 text-white rounded">Eliminar</button>
                </div>
            </div>
        </div>
    );
};
