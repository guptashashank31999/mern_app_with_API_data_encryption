import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import logo2 from "../img/logo2.jpg";
import secureLocalStorage from "react-secure-storage";

const Nav = () => {
  const auth = localStorage.getItem("User");
  const userName = JSON.parse(secureLocalStorage.getItem("userName"))?.name;
 
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/signup");
  };
  return (
    <>
      {auth ? (
        <ul className="nav-ul">
          <li>
            {" "}
            <img src={logo2} alt="logo" className="logo" />{" "}
          </li>
          <li>
            <Link to="/">Products</Link>
          </li>
          <li>
            <Link to="/add">Add Product</Link>
          </li>
          <li>
            <Link to="/profile">Profile </Link>
          </li>
          <li>
            <Link to="/signup" onClick={logout}>
              Logout( {userName} )
            </Link>
          </li>
        </ul>
      ) : (
        <ul className="right-align">
          <li>
            {" "}
            <img src={logo2} alt="logo" className="logo" />{" "}
          </li>
          <li>
            <Link to="/signup">Sign Up</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
        </ul>
      )}
    </>
  );
};

export default Nav;
