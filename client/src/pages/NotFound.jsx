import React from "react";
import { Link } from "react-router-dom";
import { Home, ArrowLeft, PawPrint } from "lucide-react";

import Nav from "../components/Nav";

const NotFound = () => {
  return (
    <div
      className="min-h-screen w-full bg-[#FAF7F1]"
      style={{
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* NAVBAR */}
      <Nav />

      {/* CONTENT */}
      <main className="flex min-h-[calc(100vh-80px)] items-center justify-center px-5 py-16">
        <div className="mx-auto w-full max-w-2xl text-center">

          {/* ICON */}
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#FF6A3D]/10">
            <PawPrint
              size={42}
              strokeWidth={1.8}
              className="text-[#FF6A3D]"
            />
          </div>

          {/* 404 */}
          <p className="mt-8 text-7xl font-black tracking-tight text-[#FF6A3D] sm:text-8xl">
            404
          </p>

          {/* TITLE */}
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#14172E] sm:text-4xl">
            Oops! This page wandered off.
          </h1>

          {/* DESCRIPTION */}
          <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-[#8A8578] sm:text-base">
            Looks like the page you're looking for doesn't exist or may have
            been moved. Let's get you back to FurEver.
          </p>

          {/* BUTTONS */}
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">

            <Link
              to="/"
              className="
                inline-flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-2xl
                bg-[#FF6A3D]
                px-6
                py-3.5
                text-sm
                font-bold
                text-white
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:bg-[#e9572c]
                hover:shadow-lg
                sm:w-auto
              "
            >
              <Home size={17} />
              Back to Home
            </Link>

            <button
              type="button"
              onClick={() => window.history.back()}
              className="
                inline-flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-2xl
                border
                border-[#E5DDD1]
                bg-white
                px-6
                py-3.5
                text-sm
                font-bold
                text-[#50546B]
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:border-[#FF6A3D]
                hover:bg-[#FFF4EE]
                hover:text-[#FF6A3D]
                sm:w-auto
              "
            >
              <ArrowLeft size={17} />
              Go Back
            </button>

          </div>

          {/* BRAND MESSAGE */}
          <p className="mt-10 text-xs font-medium text-[#B4AFA1]">
            FurEver · Made with love for every paw
          </p>

        </div>
      </main>
    </div>
  );
};

export default NotFound;