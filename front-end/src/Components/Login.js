import React, { useEffect, useState } from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleClick = async () => {
    console.log("email , passowrd", email, password);
    let result = await fetch("http://localhost:8000/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    result = await result.json();
    console.log("result", result);

    if (result.auth) {
      localStorage.setItem("User", JSON.stringify(result.user));
      localStorage.setItem("token", JSON.stringify(result.auth));
      navigate("/");

      secureLocalStorage.setItem("userName", JSON.stringify(result.user));
      secureLocalStorage.setItem("num", 12);
      secureLocalStorage.setItem("str", "happy  ");
    } else {
      alert("User Not Found");
    }
  };

  useEffect(() => {
    const auth = localStorage.getItem("User");
    if (auth) {
      navigate("/");
    }
  }, []);
  return (
    <div className="Signup-mainDiv">
      <h1 className="inputBox-heading">Login</h1>
      <p>{}</p>
      <input
        className="inputBox"
        onChange={(e) => setEmail(e.target.value)}
        type="text"
        placeholder="Enter Email"
        value={email}
      />
      <input
        className="inputBox"
        onChange={(e) => setPassword(e.target.value)}
        type="Password"
        placeholder="Enter Passowrd"
        value={password}
      />
      <button
        type="button"
        className="inputbox-button space"
        onClick={handleClick}
      >
        Login
      </button>
    </div>
  );
};

export default Login;
