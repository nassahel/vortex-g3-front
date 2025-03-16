import Link from "next/link";

interface Props {
    item: any;
}

const ProductCard = ({ item }: Props) => {
    const { name, price } = item;

    return (
        <Link
            href={`/${item.id}`}
            className=" rounded-xl w-[17rem] h-[26rem]  group cursor-pointer bg-white hover:border-black duration-200 border border-neutral-200 overflow-hidden"
        >
            <figure className="h-[60%] relative overflow-hidden rounded-t-xl duration-400">
                <img
                    src={item.images[0]?.url || "/img/default-product.webp"}
                    alt={name}
                    className="h-full w-full object-cover"
                />
            </figure>
            <div className="h-[40%] px-4 mt-2">
                <p className="font-semibold text-lg">{name}</p>
                <div>
                    {item.quantity > 10
                        ? "⭐⭐⭐⭐⭐"
                        : item.quantity > 5
                            ? "⭐⭐⭐⭐"
                            : item.quantity > 3
                                ? "⭐⭐⭐"
                                : "⭐"}
                </div>
                <p className="text-2xl font-semibold">${price}</p>
            </div>
        </Link>
    );
};

export default ProductCard;
