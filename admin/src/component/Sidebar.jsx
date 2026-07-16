import React from "react";
import { NavLink } from "react-router-dom";
import {
  PlusSquare,
  PackageSearch,
  ShoppingBag,
} from "lucide-react";

function Sidebar() {
  const menuItems = [
    {
      name: "Add Items",
      path: "/add",
      icon: <PlusSquare size={22} />,
    },
    {
      name: "List Items",
      path: "/lists",
      icon: <PackageSearch size={22} />,
    },
    {
      name: "View Orders",
      path: "/orders",
      icon: <ShoppingBag size={22} />,
    },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-72 min-h-[calc(100vh-80px)] bg-white border-r border-[#EFE7DD] shadow-sm">

        <div className="py-8 px-5">

          <h2
            className="text-2xl mb-8 text-[#14172E]"
            style={{
              fontFamily: "'Baloo 2', sans-serif",
              fontWeight: 700,
            }}
          >
            Dashboard
          </h2>

          <div className="flex flex-col gap-3">

            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-5 py-4 rounded-xl font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-[#FF6A3D] text-white shadow-md"
                      : "text-[#50546B] hover:bg-[#FFF3ED] hover:text-[#FF6A3D]"
                  }`
                }
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            ))}

          </div>

        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden sticky top-20 z-40 bg-white border-b border-[#EFE7DD] shadow-sm">

        <div className="grid grid-cols-3">

          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-3 transition-all ${
                  isActive
                    ? "text-[#FF6A3D]"
                    : "text-gray-500"
                }`
              }
            >
              {item.icon}

              <span className="text-[11px] mt-1 font-medium text-center">
                {item.name}
              </span>
            </NavLink>
          ))}

        </div>

      </div>
    </>
  );
}

export default Sidebar;