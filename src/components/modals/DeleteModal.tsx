import toast from "react-hot-toast";

interface Props {
    setDeleteModal: (value: boolean) => void;
    modalText: string;
    itemId: string;
}

export const DeleteModal: React.FC<Props> = ({ setDeleteModal, modalText, itemId }) => {
    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}product/delete/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                toast.success('Producto eliminado');
                setDeleteModal(false);
            } else {
                toast.error('No se pudo eliminar el producto');
            }
        } catch (error) {
            toast.error('Error al eliminar el producto');
        }
    };

    return (
        <div className="fixed z-50 top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black/50">
            <div className="bg-white p-6 rounded-md w-[25rem]">
                <h3>{modalText}</h3>
                <div className="mt-4 flex justify-between">
                    <button onClick={() => setDeleteModal(false)} className="p-2 bg-gray-500 text-white rounded">Cancelar</button>
                    <button onClick={handleDelete} className="p-2 bg-red-500 text-white rounded">Eliminar</button>
                </div>
            </div>
        </div>
    );
};
