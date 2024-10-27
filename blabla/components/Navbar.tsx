import React from "react";

const Navbar = () => {
  return (
    <div className="bg-red-500 w-full rounded-ee-[30px] rounded-es-[30px]">
      <nav className="navbar navbar-expand-lg  navbar-light bg-light">
        <ul className="flex text-white gap-5 py-3">
          <li>Message</li>
          <li>Profile</li>
          <li>Search</li>
          <li>Add</li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
