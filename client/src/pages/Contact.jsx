import React from "react";
import Nav from "../components/Nav";

function Contact() {
  return (
    <>
      <Nav />

      <div className="min-h-screen bg-[#FAF7F1] flex items-center justify-center">
        <h1
          className="text-5xl font-bold text-[#14172E]"
          style={{ fontFamily: "'Baloo 2', sans-serif" }}
        >
          Contact Us
        </h1>
      </div>
    </>
  );
}

export default Contact;