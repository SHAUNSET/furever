import React from "react";
import Nav from "../component/Nav";
import Sidebar from "../component/Sidebar";

function Home() {
  return (
<>
    <Nav />

    {/* Mobile Sidebar */}
    <div className="md:hidden">
        <Sidebar />
    </div>

    <div className="flex min-h-[calc(100vh-80px)] bg-[#FAF7F1]">

        {/* Desktop Sidebar */}
        <div className="hidden md:block">
            <Sidebar />
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-10">
            <h1>Welcome Admin 👋</h1>
        </main>

    </div>
</>
  );
}

export default Home;