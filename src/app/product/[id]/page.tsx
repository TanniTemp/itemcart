"use client";
import Image from "next/image";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

interface Variety {
  id: number;
  name: string;
  price: number;
}

interface Product {
  id: number;
  name: string;
  category: string;
  image_url: string;
  varieties: Variety[];
}

function Page() {
  const [product, setProduct] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariety, setSelectedVariety] = useState<Variety | null>(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchProduct = async (id: number) => {
      const response = await fetch(
        `https://67c33e561851890165ae9158.mockapi.io/products?id=${id}`
      );
      const data = await response.json();

      setProduct(data);
      if (data.length > 0 && data[0].varieties.length > 0) {
        setSelectedVariety(data[0].varieties[0]);
      }
    };

    if (id) {
      fetchProduct(Number(id));
    }
  }, [id]);

  // Prevent auto-scrolling on reload
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  const addToCart = () => {
    if (!product[0] || !selectedVariety) return;

    const cartItem = {
      id: product[0].id,
      name: product[0].name,
      category: product[0].category,
      image_url: product[0].image_url,
      variety: selectedVariety,
      quantity: quantity,
      totalCost: selectedVariety.price * quantity,
    };

    const existingCart = localStorage.getItem("cart");
    const cart = existingCart ? JSON.parse(existingCart) : [];
    console.log(cart);

    const existingItemIndex = cart.findIndex(
      (item: typeof cartItem) =>
        item.id === cartItem.id && item.variety.id === cartItem.variety.id
    );

    if (existingItemIndex !== -1) {
      cart[existingItemIndex].quantity += quantity;
      cart[existingItemIndex].totalCost =
        cart[existingItemIndex].variety.price *
        cart[existingItemIndex].quantity;
    } else {
      cart.push(cartItem);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    toast.success("Added to cart!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });
    window.dispatchEvent(new Event("cart-updated"));

    console.log(cart);
  };

  return (
    <div className="bg-[#F9F9F9] h-[100vh] p-4">
      <div className="grid grid-cols-1 mx-auto md:grid-cols-2 gap-4 p-4 max-w-screen-md">
        <div className="rounded-lg overflow-hidden">
          <Image
            priority
            src={product[0]?.image_url || "/default-image.png"}
            alt={product[0]?.name || "Product"}
            width={500}
            height={500}
          />
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold">{product[0]?.name}</h1>
          <p>{product[0]?.category}</p>
          <div>
            {(product[0]?.varieties ?? []).map((variety) => (
              <div
                key={variety.id}
                className="flex justify-between items-center p-2 border-b"
              >
                <p>{variety.name}</p>
                <p>${variety.price.toFixed(2)}</p>
              </div>
            ))}
          </div>

          {/* Select Variety */}
          <div className="grid grid-cols-2 gap-4 items-center">
            <label htmlFor="variety">Variety</label>
            <select
              name="variety"
              id="variety"
              className="p-2 border-2 border-gray-300 rounded-lg"
              onChange={(e) => {
                const selected = product[0]?.varieties.find(
                  (v) => v.id === Number(e.target.value)
                );
                setSelectedVariety(selected || null);
              }}
            >
              {(product[0]?.varieties ?? []).map((variety) => (
                <option key={variety.id} value={variety.id}>
                  {variety.name}
                </option>
              ))}
            </select>

            {/* Quantity */}
            <div>Quantity</div>

            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className="bg-black cursor-pointer px-4 text-white p-2 rounded-lg"
              >
                -
              </button>
              <div className="p-2 border-2 border-gray-300 rounded-lg">
                {quantity}
              </div>
              <button
                type="button"
                onClick={() => setQuantity((prev) => Math.min(10, prev + 1))}
                className="bg-black cursor-pointer px-4 text-white p-2 rounded-lg"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            type="button"
            onClick={addToCart}
            className="bg-green-700 cursor-pointer px-4 text-white p-2 rounded-lg"
          >
            Add to Cart
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Page;
