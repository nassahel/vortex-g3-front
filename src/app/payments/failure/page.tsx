import Navbar from "@/components/Navbar";
import Link from "next/link";
import { BiArrowBack } from "react-icons/bi";
import { TbFaceIdError } from "react-icons/tb";

function PaymentRejected() {
    return (
        <div className="flex flex-col h-screen">
            <Navbar />
            <div className="grow flex flex-col items-center justify-center gap-4">
                <TbFaceIdError className="text-red-500 text-9xl" />
                <h1 className="text-4xl font-bold">Pago rechazado!</h1>
                <p className="text-lg text-gray-500">
                    Por favor, inténtalo de nuevo mas tarde
                </p>
                <Link
                    href="/"
                    className="bg-black text-white px-4 py-2 rounded-md flex items-center gap-2 group transition-colors hover:bg-neutral-800"
                >
                    <BiArrowBack className="group-hover:rotate-45 transition-transform duration-300" />
                    Volver al inicio
                </Link>
            </div>
        </div>
    );
}

export default PaymentRejected;
