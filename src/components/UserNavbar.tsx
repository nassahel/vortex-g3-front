import Link from 'next/link'
import React from 'react'

type Props = {}

const UserNavbar = (props: Props) => {
    return (
        <div className='bg-mercado'>
            <div className='flex flex-col justify-between max-w-[75rem] min-w-[60rem] h-[4rem] mx-auto pt-2 pb-3'>
                <div className='flex gap-20'>
                    <Link href="/">
                        <img src="/img/mercado_liebre_logo.png" alt="Logo" className='w-36' />
                    </Link>
                </div>
            </div>

        </div>
    )
}

export default UserNavbar