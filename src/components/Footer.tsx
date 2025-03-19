import Link from 'next/link'
import React from 'react'



const paymentsImage = [
    '/img/medios_de_pago/visa.png',
    '/img/medios_de_pago/master.png',
    '/img/medios_de_pago/paypal.webp',
    '/img/medios_de_pago/apple.png',
    '/img/medios_de_pago/gpay.png',
]


const foterSections = [
    {
        title: 'COMPAÑIA',
        links: ['Acerca', 'Funciones', 'Trabajos', 'Carreras']
    },
    {
        title: 'AYUDA',
        links: ['Ayuda al cliente', 'Detalles de envio', 'Terminos y condiciones', 'Politica de privacidad']
    },
    {
        title: 'Preguntas frecuentes',
        links: ['Cuenta', 'Envios', 'Ordenes', 'Pagos']
    },
    {
        title: 'Recursos',
        links: ['Libros gratis', 'Como hacer', 'Blog', 'Playlist de Youtube']
    },   

]



const Footer = () => {
    return (
    <div className="px-6 sm:px-8 md:px-10 py-10 bg-neutral-100 text-sm text-neutral-800">
        <div className="max-w-[95rem] mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {foterSections.map((item, i) => (
                    <div key={i} className="flex flex-col text-sm">
                        <h4 className="uppercase text-xs font-semibold">{item.title}</h4>
                        {item.links.map((link, j) => (
                            <Link key={j} className="text-neutral-500 hover:text-neutral-700 duration-300" href="#">
                                {link}
                            </Link>
                        ))}
                    </div>
                ))}
            </div>

            {/* Footer Bottom */}
            <div className="border-t-2 py-6 mt-6 flex flex-col sm:flex-row items-center justify-between text-center sm:text-left">
                <p className="text-neutral-500">LuxShop 2025. Todos los derechos reservados.</p>
                <div className="flex gap-2 mt-4 sm:mt-0">
                    {paymentsImage.map((item, i) => (
                        <img key={i} src={item} alt="" className="h-6 sm:h-8" />
                    ))}
                </div>
            </div>
        </div>
    </div>
);

}

export default Footer