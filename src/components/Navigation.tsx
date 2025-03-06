import { useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";

function Navigation() {
    const router = useRouter();
    return (
        <div>
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 border-b border-transparent transition-all hover:-translate-y-1 duration-200 hover:border-black"
            >
                <IoIosArrowBack />
                Volver
            </button>
        </div>
    );
}

export default Navigation;
