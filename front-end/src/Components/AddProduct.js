import React, { useState } from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const AddProduct = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [company, setCompany] = useState("");
  const [error, setError] = useState(false);
  const [file, setFile] = useState();

  const [imageName, setImageName] = useState();

  const navigate = useNavigate();


  // const addProduct = async () => {
  //   if (!name || !price || !category || !company | !file) {
  //     setError(true);
  //     return false;
  //   }
  //   const formdata = new FormData();
  //   formdata.append("file", file);
  //   const userId = JSON.parse(localStorage.getItem("User"))._id;

  //   let result = await fetch("http://localhost:8000/add-product", {
  //     method: "post",
  //     body: JSON.stringify({
  //       name: name,
  //       price: price,
  //       category: category,
  //       userId: userId,
  //       company: company,
  //       file: file
  //     }),
  //     headers: {
  //       "Content-Type": "application/json",
  //       // authorization: `bearer ${JSON.stringify(
  //       //   localStorage.getItem("token")
  //       // )}`,
  //     },
  //   });

  //   if (result) {

  //     alert(`Added Product Successfully`);
  //     navigate("/");
  //   }

  //   console.log("Result", result);
  //   console.log("first-50", await result.json());
  // };

  const handleUpload = () => {
    let formdata = new FormData();
    formdata.append("file", file);


    axios.post("http://localhost:8000/uploadImage", formdata)
    .then((res) => {
      console.log("RES",res);
      if(res.data.image){
        setImageName(res.data.image);
        alert("Image Uploaded Successfully")
      }
    });
  }


  const addProduct = () => {
    if (!name || !price || !category || !company | !file || !imageName ) {
      setError(true);
      return false;
    }
    const userId = JSON.parse(localStorage.getItem("User"))._id;


    axios.post('http://localhost:8000/add-product',{
      name: name,
      price: price,
      category: category,
      userId: userId,
      company: company,
      image: imageName,
      userId : userId
    }, 
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
    ).then(result => console.log("Result-axios",result)).catch(err => console.log("ERROR",err));
   
   

          alert(`Added Product Successfully`);
          navigate("/");
};

  return (
    <>
      <div className="add-product">
        <h2>Add Product</h2>
        <input
          className="add-prodInput"
          onChange={(e) => setName(e.target.value)}
          value={name}
          type="text"
          placeholder="Enter product name"
        />
        {error && !name && <span className="span">Enter Valid Name</span>}
        <input
          className="add-prodInput"
          onChange={(e) => setPrice(e.target.value)}
          value={price}
          type="number"
          placeholder="Enter product price"
        />
        {error && !price && <span className="span">Enter Price</span>}

        <input
          className="add-prodInput"
          onChange={(e) => setCategory(e.target.value)}
          value={category}
          type="text"
          placeholder="Enter product category"
        />
        {error && !category && <span className="span">Enter Category</span>}

        <input
          className="add-prodInput"
          onChange={(e) => setCompany(e.target.value)}
          value={company}
          type="text"
          placeholder="Enter product company"
        />
        {error && !company && (
          <span className="span">Enter Company Details</span>
        )}
           <input type="file" className="add-prodInput" onChange={(e) => setFile(e.target.files[0])} />
            <button onClick={handleUpload}>Upload</button>
            {error && !imageName && (
          <span className="span">Upload Image</span>
        )}
        
        <button className="add-prodInput more-space" onClick={addProduct}>
          Add Product
        </button>
      </div>
    </>
  );
};

export default AddProduct;
