import Image from "next/image";
import React from "react";

type Props = {
    fontSize?: string;
    maxWidth?: string;
};

const HeroSection = ({}: Props) => {
    return (
        <section className="min-h-screen bg-neutral-200 flex flex-col justify-end w-full">
            <div className="w-full max-w-[80rem] flex flex-col lg:flex-row items-center mx-auto px-6 sm:px-10">
                <div className="lg:w-1/2 flex flex-col justify-center text-center lg:text-left">
                    <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold">
                        ENCUENTRA LA ROPA QUE COMBINE CON TU ESTILO
                    </h1>
                    <h3 className="text-base sm:text-lg mt-4 sm:mt-6">
                        Explore nuestra variada gama de prendas meticulosamente
                        elaboradas, diseñadas para resaltar su individualidad y
                        satisfacer su sentido del estilo.
                    </h3>
                    <button className="bg-black rounded-full py-3 px-8 sm:py-4 sm:px-12 hover:bg-neutral-800 duration-200 mt-6 sm:mt-8 text-white w-fit mx-auto lg:mx-0">
                        Explorar categorías
                    </button>

                    <div className="flex flex-col sm:flex-row justify-center lg:justify-start mt-10 mb-10 sm:mb-20 text-center">
                        <div className="mb-6 sm:mb-0">
                            <p className="text-4xl sm:text-5xl font-semibold">
                                200+
                            </p>
                            <p>Marcas internacionales.</p>
                        </div>
                        <div className="border-t sm:border-t-0 sm:border-x border-neutral-300 px-6 sm:mx-6 py-4 sm:py-0">
                            <p className="text-4xl sm:text-5xl font-semibold">
                                2.000+
                            </p>
                            <p>Prendas de alta calidad.</p>
                        </div>
                        <div>
                            <p className="text-4xl sm:text-5xl font-semibold">
                                30.000+
                            </p>
                            <p>Clientes conformes.</p>
                        </div>
                    </div>
                </div>

                <div className="w-full lg:w-1/2 flex items-end justify-center lg:justify-end">
                    <Image
                        width={643}
                        height={643}
                        src="/img/moda.png"
                        alt="Moda"
                        className="w-full max-w-md lg:max-w-full"
                    />
                </div>
            </div>

            <div className="h-[8rem] bg-black py-5 px-6 sm:px-8">
                <div className="flex items-center justify-center lg:justify-between gap-6 max-w-[100rem] mx-auto flex-wrap">
                    <Image
                        width={1000}
                        height={563}
                        src="/img/timberland.png"
                        alt="Moda"
                        className="invert w-24 sm:w-32 md:w-40"
                    />
                    <Image
                        width={1024}
                        height={544}
                        src="/img/north_face.png"
                        alt="Moda"
                        className="invert w-24 sm:w-32 md:w-40"
                    />
                    <Image
                        width={1000}
                        height={307}
                        src="/img/element.png"
                        alt="Moda"
                        className="invert w-24 sm:w-32 md:w-40"
                    />
                    <Image
                        width={1000}
                        height={250}
                        src="/img/adidas.png"
                        alt="Moda"
                        className="invert w-24 sm:w-32 md:w-40"
                    />
                    <Image
                        width={1000}
                        height={356}
                        src="/img/nike.png"
                        alt="Moda"
                        className="invert w-24 sm:w-32 md:w-40"
                    />
                    <Image
                        width={1000}
                        height={424}
                        src="/img/cocoshao.png"
                        alt="Moda"
                        className="invert w-24 sm:w-32 md:w-40"
                    />
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
