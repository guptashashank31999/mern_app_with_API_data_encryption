import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import CryptoJS from 'crypto-js';
import ProductEncrypt from "../ProductEncrypt";


const ProductList = () => {

  const [products, setProducts] = useState([]);
  const [productsEncript, setProductsEncript] = useState([])
  const [visible , setVisible] = useState(true);

  const userId = JSON.parse(localStorage.getItem("User"))._id;
  const email =  JSON.parse(secureLocalStorage.getItem("userName"))?.email
  
  const decrypt = 'YourEncryptionKe'; 


  // const message = {Hwllo : "Hello World", hello2 : "Hello World 2"}
  // const secret = "xyz--123";
  // const cipherText = AES.encrypt(message.toString(), secret);
  // console.log("CipherText",cipherText);
  // let bytes = AES.decrypt(cipherText, secret);
  // console.log("bytes",bytes)
  // const decrypted = bytes.toString(enc.Utf8);
  // console.log("decrypt--25",decrypted)










  const getProduct = async () => {
    let result = await fetch("http://localhost:8000/products", {
      // method: "POST",
      // body: JSON.stringify({ userId }),
      // headers: {
      //   "Content-Type": "application/json",
      //   authorization: `bearer ${JSON.stringify(
      //     localStorage.getItem("token")
      //   )}`,
      // },
    });

    result = await result.json();
    let decryptedData = CryptoJS.AES.decrypt(result.encryptData, decrypt ).toString(CryptoJS.enc.Utf8);

    // console.log("decryptData",decryptedData);
    let data = JSON.parse(decryptedData);
    setProducts(data);

    console.log("PRoducts",products);
    // data.map(item => {
    //   console.log('Item ID:', item._id);
    //   console.log('Name:', item.name);
    //   console.log('Price:', item.price);
    //   console.log('Category:', item.category);
    //   // ... log other properties you want to display
    // });
    //console.log("result",result);


    
    //setProducts(decryptedData);
    // let decryptedData =  CryptoJS.AES.decrypt(result, encryptionKey)
    // decryptedData = decryptedData.toString();

    // console.log("decryptedData",decryptedData)
    // result = await result.json();
    // console.log("result",result);
    // setProducts(result);
  };
  
  const getProductEncript = async () => {
   
    let result = await fetch("http://localhost:8000/productsEncrypt", {
      method: "POST",
      body: JSON.stringify({ visible : visible, userId : userId}),
      headers :{
        'Content-Type': 'application/json' ,
      }
    });

    result = await result.json();
    if(visible === true){
      setProducts(result);
      setProductsEncript(result);

    }else{
      let actualResult = result.encryptData;
      let decryptedData = ProductEncrypt(actualResult);
      let data = JSON.parse(decryptedData);
      console.log("getProductEncript", data)
      //setProducts(data);
      setProductsEncript(data);
    }
    


  };

  // const getProduct = async () => {
  //   let result = await fetch("https://localhost:8000/products", {
  //     //credentials: "same-origin",
  //     // method: "POST",
  //     // body: JSON.stringify({ userId }),
  //     // headers: {
  //     //   "Content-Type": "application/json",
  //     //   authorization: `bearer ${JSON.stringify(
  //     //     localStorage.getItem("token")
  //     //   )}`,
  //     // },
  //   });

  //   result = await result.json();
  //   console.log("RESULT",result);

  //   // console.log("decryptData",decryptedData);
  //  if(result){

  //    setProducts(result);
  //  }
    
  // };

  const handleDelete = async (id) => {
    console.log("ID", id);
    let result = await fetch(`http://localhost:8000/product/${id}`, {
      method: "Delete",
      headers: {
        authorization: `bearer ${JSON.stringify(
          localStorage.getItem("token")
        )}`,
      },
    });

    result = await result.json();
    if (result) {
      getProduct();
    }
  };

  useEffect(() => {
  //  getProduct();
    getProductEncript();
  }, []);

  const searchHandle = async (event) => {
    console.log("event", event);
    let key = event;
    if (key) {
      let result = await fetch(`http://localhost:8000/search/${key}`, {
        headers: {
          authorization: `bearer ${JSON.stringify(
            localStorage.getItem("token")
          )}`,
        },
      });
      result = await result.json();
      if (result) {
        setProducts(result);
        setProductsEncript(result);

      }
    } else {
      getProduct();
    }
  };

  
  const setVisibleFun = (e) => {
    setVisible(false);
    if(visible === false) {

      getProductEncript();
    }
  }

  return (
    <div className="product-list">
      <h3>Product List</h3>
      <p>
        {secureLocalStorage.getItem("str")}
        {secureLocalStorage.getItem("num")}
        
        {<h2>User Email ( {email} )</h2>}
      </p>
      <input
        type="text"
        className="search"
        placeholder="Search Product Box"
        onChange={(event) => searchHandle(event.target.value)}
      />
      <button onClick={setVisibleFun} className="button-edit">Encritption Button</button>
      <ul>
        <li>S. No.</li>
        <li>Name</li>
        <li>Price</li>
        <li>Category</li>
        <li>Comapny</li>
        <li>Image</li>
        <li>Operation</li>
      </ul>

      {productsEncript.length > 0 ? (
        productsEncript &&
        productsEncript.map((item, index) => {
          return (
            <>
              <ul key={item._id}>
                <li>{index + 1}</li>
                <li>{item.name}</li>
                <li>${item.price}</li>
                <li>{item.category}</li>
                <li>{item.company}</li>
                <li><img src={`http://localhost:8000/Images/`+item?.image} style={{width: "10%", height: "10%"}}/></li>
                <li>
                  <button onClick={() => handleDelete(item._id)}>
                    Delete{" "}
                  </button>
                  <Link to={"/update/" + item._id}>&nbsp; Update</Link>
                </li>
              </ul>
            </>
          );
        })
      ) : (
        <>
          <h2 style={{ color: "red" }}>No Product Found</h2>
        </>
      )}
    </div>
  );
};

export default ProductList;
