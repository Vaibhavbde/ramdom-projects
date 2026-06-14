import { useState } from "react";
import { close, logo, menu } from "../assets";
import { navLinks } from "../constants";

const Navbar = () => {
  const [active, setActive] = useState("Home");
  const [toggle, setToggle] = useState(false);

  return (
    <nav className="w-full flex py-6 justify-between items-center navbar fixed z-50 px-4 sm:px-8 bg-black-gradient">
      {/* Logo */}
      <img src={logo} alt="hoobank" className="w-[124px] h-[32px]" />

      {/* Desktop Menu */}
      <ul className="list-none sm:flex hidden justify-end items-center">
        {navLinks.map((nav, index) => (
          <li
            key={nav.id}
            className={`font-poppins font-normal cursor-pointer text-[16px] ${
              active === nav.title ? "text-blue-400 bg-white/10 rounded-md px-2 py-1" : "text-dimWhite"
            } hover:text-white hover:scale-105  transition-colors duration-200 ${
              index !== navLinks.length - 1 ? "mr-10" : ""
            }`}
            onClick={() => setActive(nav.title)}
          >
            <a href={`#${nav.id}`}>{nav.title}</a>
          </li>
        ))}
      </ul>

      {/* Mobile Menu */}
      <div className="sm:hidden flex justify-end items-center">
        <img
          src={toggle ? close : menu}
          alt="menu"
          className="w-[28px] h-[28px] object-contain cursor-pointer"
          onClick={() => setToggle(!toggle)}
        />

        {/* Sidebar */}
        <div
          className={`${
            toggle ? "flex" : "hidden"
          } p-6 bg-black-gradient absolute top-20 right-4 rounded-xl shadow-lg flex-col w-[200px] transition-all duration-300`}
        >
          <ul className="list-none flex flex-col">
            {navLinks.map((nav, index) => (
              <li
                key={nav.id}
                className={`font-poppins font-medium cursor-pointer text-[16px] ${
                  active === nav.title ? "text-blue-400 bg-white/10 rounded-md px-2 py-1" : "text-dimWhite"
                } hover:text-white transition-colors duration-200 ${
                  index !== navLinks.length - 1 ? "mb-4" : ""
                }`}
                onClick={() => {
                  setActive(nav.title);
                  setToggle(false); // Close menu on click
                }}
              >
                <a href={`#${nav.id}`}>{nav.title}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
