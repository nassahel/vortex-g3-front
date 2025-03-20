import { PaginationType } from "@/types/types";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";

const Pagination = ({
    pagination,
    handleChangePage,
}: {
    pagination: PaginationType;
    handleChangePage: (page: number) => void;
}) => {
    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Indicador de página */}
            <div className="text-center sm:text-left">
                <p>
                    Página {pagination?.currentPage} de {pagination?.totalPages}
                </p>
            </div>
    
            {/* Botones de paginación */}
            <div className="flex items-center justify-center gap-2 py-4">
                <button
                    className="border text-gray-800 p-2 rounded-lg transition-colors hover:bg-gray-100 disabled:opacity-50 w-full sm:w-auto"
                    disabled={!pagination?.hasPreviousPage}
                    onClick={() =>
                        handleChangePage(pagination?.currentPage - 1)
                    }
                >
                    <FaArrowLeft />
                </button>
                <button
                    className="border text-gray-800 p-2 rounded-lg transition-colors hover:bg-gray-100 disabled:opacity-50 w-full sm:w-auto"
                    disabled={!pagination?.hasNextPage}
                    onClick={() =>
                        handleChangePage(pagination?.currentPage + 1)
                    }
                >
                    <FaArrowRight />
                </button>
            </div>
        </div>
    );
    
};

export default Pagination;
