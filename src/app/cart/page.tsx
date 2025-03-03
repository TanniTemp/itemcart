"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";

import { IoMdClose } from "react-icons/io";

interface cartItem {
  id: number;
  name: string;
  category: string;
  image_url: string;
  variety: string;
  quantity: number;
  totalCost: number;
}

function Page() {
  const [cartItems, setCartItems] = useState<cartItem[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const existingCart = localStorage.getItem("cart");
    const cart = existingCart ? JSON.parse(existingCart) : [];
    setCartItems(cart);
  }, []);

  useEffect(() => {
    const getTotalCost = (): number => {
      return cartItems.reduce((tot, item) => tot + item.totalCost, 0);
    };
    setTotal(getTotalCost());
  }, [cartItems]);

  const removeHandler = (id: number) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cart-updated"));
  };

  return (
    <div className="mx-auto max-w-screen-md flex flex-col h-[100vh] gap-4 p-4">
      {cartItems.map((items) => (
        <div
          key={items.id}
          className="bg-white rounded-2xl p-3 text-xl gap-4 grid grid-cols-5"
        >
          <Image
            src={items.image_url}
            alt={""}
            height={60}
            width={60}
            className="row-span-2"
          />
          <div className="col-span-2 font-semibold">{items.name}</div>
          <div className="flex justify-end items-center row-span-2 font-semibold">
            {items.totalCost}
          </div>
          <div className="flex items-center justify-center row-span-2">
            <button
              className="cursor-pointer bg-red-500 rounded-3xl"
              onClick={() => removeHandler(items.id)}
            >
              <IoMdClose />
            </button>
          </div>
          <div className="text-sm">{items.quantity} item</div>
        </div>
      ))}
      {cartItems.length == 0 && (
        <div className="h-30 flex items-center justify-center">
          No items Available
        </div>
      )}
      <div className="flex items-end justify-end pr-5 text-2xl">
        Total: {total}
      </div>
      <div onClick={() => alert("coming soon")} className="">
        <button className="bg-green-600 px-3 py-2 rounded-xl text-white cursor-pointer">
          Checkout
        </button>
      </div>
    </div>
  );
}

export default Page;
