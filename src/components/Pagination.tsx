import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";

const Pagination = ({ pagination }: { pagination: any }) => {
    return (
        <div className="flex items-center justify-center gap-2 py-4">
            <button
                className="border text-gray-800 px-2 py-1 rounded-lg"
                disabled={!pagination.hasPreviousPage}
            >
                <FaArrowLeft />
            </button>
            <button
                className="border text-gray-800 px-2 py-1 rounded-lg"
                disabled={!pagination.hasNextPage}
            >
                <FaArrowRight />
            </button>
        </div>
    );
};

export default Pagination;
