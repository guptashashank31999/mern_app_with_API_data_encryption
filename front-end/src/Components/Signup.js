import React,{useState, useEffect} from "react";
import "../App.css"
import {useNavigate } from "react-router-dom";


const Signup = () => {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");


    const navigate = useNavigate();

    const collectData = async () => {
        console.log("first",name, password,email)

        let result = await fetch('http://localhost:8000/register', {
            method : 'post',
            body : JSON.stringify({name, email , password}),
            headers : {
              'Content-Type' : 'application/json'
            }
        });
        result = await result.json()
        console.log('Result', result)
        if(result){
          localStorage.setItem("User", JSON.stringify(result.result));
          localStorage.setItem("token", JSON.stringify(result.auth));

          navigate('/')
        }

    }

    useEffect(() => {
      const auth = localStorage.getItem("User");
      if(auth){
        navigate("/")
      }
    }, [])

  return (
    <div className="Signup-mainDiv">
      <h1 className="inputBox-heading">Register</h1>
      <input className="inputBox" type="text" value={name} onChange={(e)=> setName(e.target.value)} placeholder="Enter Name" />
      <input className="inputBox"  type="email" value={email} onChange={(e)=> setEmail(e.target.value)} placeholder="Enter Email" />
      <input className="inputBox"  type="password" value={password} onChange={(e)=> setPassword(e.target.value)} placeholder="Enter Password" />\
      <button className="inputbox-button" onClick={collectData}>Sign up</button>

    </div>
  );
};

export default Signup;
