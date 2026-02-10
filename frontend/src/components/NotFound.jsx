import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center  px-[5%]">
      <div className="bg-white/90 backdrop-blur-md rounded-[1.2rem] shadow-xl w-full max-w-[28rem] text-center p-[2rem]">
        <h1 className="text-[4rem] sm:text-[5rem] font-extrabold text-[#3fd1f2]">
          404
        </h1>
        <h2 className="text-[1.5rem] sm:text-[1.75rem] font-semibold text-gray-800 mt-[0.5rem]">
          Page Not Found
        </h2>
        <p className="text-[1rem] text-gray-600 mt-[0.75rem]">
          The page you are trying to access may have been moved,
          renamed, or is temporarily unavailable.
        </p>
        <Link
          to="/"
          className="inline-block mt-[1.5rem] px-[2rem] py-[0.75rem]
          text-[1rem] font-medium text-white rounded-full
          bg-gradient-to-r from-[#3fd1f2] to-[#22e1a1]
          hover:scale-[1.05] hover:shadow-lg
          transition-all duration-300"
        >
          Go Back Home
        </Link>
      </div>

    </div>
  );
}
