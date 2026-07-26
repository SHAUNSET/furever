import React from "react";
import Nav from "../components/Nav";

function About() {
  return (
    <>
      <Nav />

      <div className="min-h-screen bg-[#FAF7F1] flex items-center justify-center">
        <h1
          className="text-5xl font-bold text-[#14172E]"
          style={{ fontFamily: "'Baloo 2', sans-serif" }}
        >
          About FurEver
        </h1>
      </div>
    </>
  );
}

export default About;