"use client";

import "@/app/globals.css";
import Header from "./components/Header";
import NavBar from "./components/NavBar";
import { createContext, useEffect, useState } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useRouter } from "next/navigation.js";

export const adminContext = createContext();

export default function RootLayout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [adminData, setAdminData] = useState(null);
  const router = useRouter();
  useEffect(() => {
    const screenWidth = window.screen.width;
    if (screenWidth > 1025) {
      setIsMenuOpen(true);
    } else {
      setIsMenuOpen(false);
    }

    const authorization =
      sessionStorage.getItem("admin_authorization") ||
      localStorage.getItem("admin_authorization");
    if (!authorization) {
      router.replace("/admin/login");
      return;
    }
    async function fetchSession() {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_HOST}/admin/verifyAdmin`,
          {
            headers: {
              Authorization: authorization,
            },
          }
        );
        setAdminData(response.data.admin);
      } catch (error) {
        console.log(error);
        router.replace("/admin/login");
        sessionStorage.removeItem("admin_authorization");
        localStorage.removeItem("admin_authorization");
      }
    }
    fetchSession();
  }, []);

  return (
    <adminContext.Provider data={{ adminData, setAdminData }}>
      <div className="min-h-screen max-h-screen flex flex-col sm:flex-row h-screen">
        {/* ======= Left Side Container ======= */}
        <div
          className={`flex flex-col fixed top-0 sm:relative sm:translate-x-0 ${
            isMenuOpen ? "translate-x-0" : " -translate-x-full"
          } duration-500 w-fit  max-h-full overflow-y-auto no-scrollbar bg-blue-900 z-50 h-screen`}>
          {/* ======= College Logo ======= */}
          <div className="relative h-fit sm:bg-primary-regular p-1 pb-2 w-full">
            <div className="sm:hidden absolute  m-2 right-2 text-white text-3xl cursor-pointer">
              <FontAwesomeIcon
                icon={faXmark}
                onClick={() => setIsMenuOpen(false)}
              />
            </div>

            {/* When isMenuOpen==true then render full logo else render only icon */}
            {isMenuOpen ? (
              <Image
                className="filter invert"
                src={"/logo.webp"}
                height={45}
                width={150}
                alt="Markham College of commerce"
              />
            ) : (
              <Image
                className="hidden sm:inline-block filter invert mx-auto"
                src={"/mcc-icon.png"}
                height={45}
                width={45}
                alt={"Markham College Icon"}
              />
            )}
          </div>

          {/* ======= Navigation Bar ======= */}
          <NavBar isMenuOpen={isMenuOpen} />
        </div>
        {/* ======= Left Side Container END ======= */}

        {/* ======= Right Side Containers START  ======= */}
        <div className="flex-1 h-full flex flex-col">
          {/* ======= Header ======= */}
          <Header
            adminData={adminData}
            setIsMenuOpen={setIsMenuOpen}
            isMenuOpen={isMenuOpen}
          />

          {/* ======= Main Content Start ======= */}
          <div className="py-4 px-2 sm:px-4 w-full overflow-y-auto">
            <main>{children}</main>
          </div>
          {/* ======= Main Content END ======= */}
        </div>
        {/* ======= Right Side Containers END  ======= */}
      </div>
    </adminContext.Provider>
  );
}
