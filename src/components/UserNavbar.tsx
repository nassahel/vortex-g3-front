import Link from "next/link";
import React from "react";


const UserNavbar = () => {
    return (
        <div className="bg-neutral-800">
            <div className="flex flex-col justify-between max-w-[75rem] h-[4rem] mx-auto pt-2 pb-3 px-2 sm:px-4">
                <div className="flex gap-20">
                    <Link
                        className="text-4xl font-extrabold text-neutral-50"
                        href="/"
                    >
                        LuxShop
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default UserNavbar;
