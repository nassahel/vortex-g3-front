import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";

const Pagination = ({
    pagination,
    handleChangePage,
}: {
    pagination: any;
    handleChangePage: (page: number) => void;
}) => {
    return (
        <div className="flex items-center justify-between">
            <div>
                <p>
                    Página {pagination?.currentPage} de {pagination?.totalPages}
                </p>
            </div>
            <div className="flex items-center justify-center gap-2 py-4">
                <button
                    className="border text-gray-800 p-2 rounded-lg transition-colors hover:bg-gray-100 disabled:opacity-50"
                    disabled={!pagination?.hasPreviousPage}
                    onClick={() =>
                        handleChangePage(pagination?.currentPage - 1)
                    }
                >
                    <FaArrowLeft />
                </button>
                <button
                    className="border text-gray-800 p-2 rounded-lg transition-colors hover:bg-gray-100 disabled:opacity-50"
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
