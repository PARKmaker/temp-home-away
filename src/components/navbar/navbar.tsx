import React from "react";
import Logo from "@/components/navbar/logo";
import NavSearch from "@/components/navbar/nav-search";
import DarkMode from "@/components/navbar/dark-mode";
import LinksDropdown from "@/components/navbar/links-dropdown";

function Navbar() {
  return (
    <nav>
      <div className="container flex flex-col flex-wrap gap-4 py-8 sm:flex-row sm:items-center sm:justify-between">
        <Logo />
        <NavSearch />
        <div className="flex items-center gap-4">
          <DarkMode />
          <LinksDropdown />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
