import React from "react";

const Navbar = () => {
  return (
    <nav class="navbar navbar-dark bg-primary">
      <a class="navbar-brand" href="#">TuCITA.ES</a>
      <div className="collapse navbar-collapse" id="navbarNavDropdown">
        <ul className="navbar-nav">
          <li className="nav-item active">
            <a className="nav-link" href="#">
              Home
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;