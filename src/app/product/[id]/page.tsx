"use client"
import Image from 'next/image';
import { Sigmar as SigmarFont } from "next/font/google";
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { MdShoppingCart } from 'react-icons/md';
const sigmar = SigmarFont({ weight: "400", subsets: ["latin"] });
interface Product {
    id: number;
    name: string;
    category: string;
    image_url: string;
    varieties: {
      id: number;
      name: string;
      price: number;
    }[];
  }
function Page() {
    const [product, setProduct] = useState<Product[]>( []);
    const [quantity, setQuantity] = useState(1);
    const { id }= useParams();
    const router = useRouter()

    useEffect(() => {
        const fetchProduct = async (id: number) => {
            const response = await fetch(` https://67c33e561851890165ae9158.mockapi.io/products?id=${String(id)}`);
            const data = await response.json();
            
            setProduct(data);
            console.log(data);
          };
          if (id) {
            fetchProduct(Number(id));
          }
      
    }, [id]);
    console.log(product);
  return (
    <div className='bg-[#F9F9F9] min-h-screen p-4'>
        <nav className='grid  gap-4 grid-cols-2 p-4'>
            <div  onClick={()=>router.push("/")} className='flex cursor-pointer justify-center items-center gap-3 text-3xl font-bold tracking-wider'>
                <Image src='/icon.png' alt='logo' width={70} height={70} />
                <div className={sigmar.className}>
                    <h1 className=' text-[#CD1C18]'>Food</h1>
                    <h1>Lord</h1>
                </div>
            </div>
            <div className='flex justify-center items-center gap-3'>
               
                <MdShoppingCart className='text-3xl' />
            </div>
            </nav>
        <div className='grid grid-cols-1 mx-auto md:grid-cols-2 gap-4 p-4 max-w-screen-md'>
            <div className='rounded-lg overflow-hidden'>
               <Image src={product[0]?.image_url || '/default-image.png'} alt={'alt'} width={500} height={500} />
            </div>
            <div className=' flex flex-col gap-4'>
                <h1 className='text-2xl font-bold '>{product[0]?.name}</h1>
                <p>{product[0]?.category}</p>
                <div>
                    {product[0]?.varieties.map((variety) => (
                        <div key={variety.id} className='flex justify-between items-center p-2 border-b'>
                            <p>{variety.name}</p>
                            <p>{variety.price}</p>
                        </div>
                    ))}
                </div>
                {/* select variety */}
                <div className='flex gap-4 items-center'>
                    <label htmlFor='variety'>Variety</label>
                    <select name='variety' id='variety' className='p-2 border-2 border-gray-300 rounded-lg'>
                        {product[0]?.varieties.map((variety) => (
                            <option key={variety.id} value={variety.id}>{variety.name}</option>
                        ))}
                    </select>
                 {/* quantity */}
            
                    <div className='grid grid-cols-3 gap-3'>
                        <button type='button' onClick={()=>{if(quantity>1) { setQuantity(quantity-1)}}} className='bg-black cursor-pointer px-4 text-white p-2 rounded-lg'>-</button>
                        <div className='p-2 border-2 border-gray-300 rounded-lg' >{quantity}</div>
                        <button type='button' onClick={()=>{if(quantity<10){setQuantity(quantity+1)}}} className='bg-black cursor-pointer px-4 text-white p-2 rounded-lg'>+</button>
                    </div>
                 
                </div>
                <div>  <button type='button' className='bg-green-700 cursor-pointer px-4 text-white p-2 rounded-lg'>Add to cart</button></div>
                
            </div>
        </div>
    </div>
  )
}

export default Page