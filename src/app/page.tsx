"use client"
import Image from "next/image";
import { Sigmar as SigmarFont } from "next/font/google";
import {  useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MdShoppingCart } from "react-icons/md";
import Link from "next/link";


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

export default function Home() {
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const router = useRouter();
  useEffect(() => {
    const fetchProducts = async () => { 
      try {
        const response = await fetch(`https://67c33e561851890165ae9158.mockapi.io/products`);
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchProducts();

  },[]);

  useEffect(() => {
    if (search) {
      const filtered = products.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  },[search,products]);
  return (
    <div className="bg-[#F9F9F9] min-h-screen p-4">
      <nav className="grid grid-cols-1 gap-4 md:grid-cols-3 p-4">
        <div  className="flex justify-center items-center gap-3 text-3xl font-bold tracking-wider">
          <Image src="/icon.png" alt="logo" width={70} height={70} />
          <div  className={sigmar.className}> <h1 className=" text-[#CD1C18]">Food</h1><h1>Lord</h1></div>
          
        </div>
        {/* search bar */}
       <div className="grid col-span-2 p-3 grid-cols-3 gap-6">
       <div className=" col-span-2  md:w-[60%] w-full flex items-start justify-center "> 
          <input  type="text" placeholder="Search" value={search} onChange={(event)=>setSearch(event.target.value)}  className="p-2 border-2 w-full border-gray-300 rounded-lg" />
        </div>
        <Link className="flex-" href={"/cart"}>
        <MdShoppingCart size={30}/>
        </Link>
       </div>
      </nav>
     
      <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
        {filteredProducts.map((product) => (
          <button type="button" onClick={()=>router.push(`product/${product.id}`)} key={product.id} className=" cursor-pointer flex flex-col h-full justify-evenly bg-white rounded-3xl items-center p-3 gap-4">   
             <div className="rounded-xl overflow-clip "> <Image src={product.image_url} width={250} height={250} alt={product.name} /></div>
              <h1 className="text-lg font-semibold tracking wider">{product.name}</h1>
          </button>
            ))}
      </div>
    </div>
  );
}
