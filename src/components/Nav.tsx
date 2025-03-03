"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { MdShoppingCart } from "react-icons/md";
import { Sigmar as SigmarFont } from "next/font/google";

const sigmar = SigmarFont({ weight: "400", subsets: ["latin"] });

function Nav() {
  const router = useRouter();
  const [cartSize, setCartSize] = useState<number | null>(null);
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    const updateCartSize = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartSize(cart.length);
    };

    updateCartSize();

    window.addEventListener("cart-updated", updateCartSize);

    return () => window.removeEventListener("cart-updated", updateCartSize);
  }, []);

  return (
    <nav className="grid gap-4 grid-cols-2 p-4">
      <div
        onClick={() => router.push("/")}
        className="flex cursor-pointer justify-center items-center gap-3 text-3xl font-bold tracking-wider"
      >
        <Image src="/icon.png" alt="logo" width={70} height={70} />
        <div className={sigmar.className}>
          <h1 className=" text-[#CD1C18]">Food</h1>
          <h1>Lord</h1>
        </div>
      </div>
      <button
        onClick={() => router.push("/cart")}
        className="flex cursor-pointer relative justify-center items-center gap-3"
      >
        <MdShoppingCart className="text-3xl" />

        {cartSize !== null ? (
          <div className="absolute left-[50%] top-0 p-1 px-3 bg-red-600 text-white rounded-full">
            {cartSize}
          </div>
        ) : null}
      </button>
    </nav>
  );
}

export default Nav;
