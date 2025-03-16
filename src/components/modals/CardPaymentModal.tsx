import { checkoutService } from "@/services/checkout.service";
import { Dialog } from "@headlessui/react";
import { useState } from "react";
import { FaRegCreditCard } from "react-icons/fa6";
import { useRouter } from "next/navigation";

interface CardPaymentFormData {
    cardNumber: string;
    cardHolder: string;
    expiryDate: string;
    cvv: string;
    installments: number;
    amount: number;
}

const CardPaymentModal = ({
    isOpen,
    onClose,
    total,
    idUser,
}: {
    isOpen: boolean;
    onClose: () => void;
    total: number;
    idUser: string;
}) => {
    const router = useRouter();
    const [formData, setFormData] = useState<CardPaymentFormData>({
        cardNumber: "",
        cardHolder: "",
        expiryDate: "",
        cvv: "",
        installments: 1,
        amount: total,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!idUser) {
            console.error("Usuario no autenticado.");
            return;
        }
        try {
            const res = await checkoutService(idUser, "Card");
            console.log(res);
            alert("Pago realizado correctamente");
            router.push("/payments/success");
        } catch (error) {
            console.error("Error al realizar el pago:", error);
        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="mx-auto max-w-md rounded-lg bg-white p-4 w-full">
                    <Dialog.Title className="text-xl font-semibold mb-4">
                        Pago con Tarjeta
                    </Dialog.Title>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Número de Tarjeta
                            </label>
                            <input
                                type="text"
                                maxLength={16}
                                placeholder="1234 5678 9012 3456"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                                value={formData.cardNumber}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        cardNumber: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Titular de la Tarjeta
                            </label>
                            <input
                                type="text"
                                placeholder="Juan Perez"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                                value={formData.cardHolder}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        cardHolder: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Fecha de Vencimiento
                                </label>
                                <input
                                    type="text"
                                    placeholder="MM/YY"
                                    maxLength={5}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500  p-2"
                                    value={formData.expiryDate}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            expiryDate: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    CVV
                                </label>
                                <input
                                    type="text"
                                    maxLength={4}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                                    value={formData.cvv}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            cvv: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Monto
                            </label>
                            <input
                                type="number"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                                value={formData.amount}
                                disabled
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Cuotas
                            </label>
                            <select
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                                value={formData.installments}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        installments: Number(e.target.value),
                                    })
                                }
                            >
                                {[1, 3, 6, 12, 18, 24].map((number) => (
                                    <option key={number} value={number}>
                                        {number}{" "}
                                        {number === 1 ? "cuota" : "cuotas"}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-black/80 flex items-center gap-2"
                            >
                                <FaRegCreditCard />
                                Pagar
                            </button>
                        </div>
                    </form>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
};

export default CardPaymentModal;
