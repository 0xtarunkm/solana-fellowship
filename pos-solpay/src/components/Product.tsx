import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Product({
  title,
  price,
  image,
}: {
  title: string;
  price: number;
  image: string;
}) {
  const router = useRouter();

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 max-w-xs">
      <Image
        src={image}
        height={200}
        width={200}
        alt={title}
        className="rounded-t-lg object-cover"
      />
      <div className="pt-4">
        <div className="font-bold text-lg truncate">{title}</div>
        <div className="text-gray-600 mt-2">{price} SOL</div>
      </div>
      <button
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={() => {
          router.push('/checkout');
          localStorage.setItem('productPrice', price.toString());
        }}
      >
        Buy Now
      </button>
    </div>
  );
}
