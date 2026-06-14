// Navbar.js

import React from "react";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="container-app flex items-center justify-between py-3">
        <a href="/" className="text-xl font-semibold">
          BloodBank.com
        </a>

        <div className="hidden md:flex items-center gap-6">
          <a href="/" className="hover:underline">
            Home
          </a>
          <a href="/#camps" className="hover:underline">
            Camps
          </a>
          <a href="/donate" className="hover:underline">
            Donor
          </a>
          <a href="/aboutus" className="hover:underline">
            About us
          </a>
          <a href="/article" className="hover:underline">
            Articles
          </a>
        </div>

        <div className="md:hidden">
          <button className="btn btn-ghost" aria-label="Open menu">Menu</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
