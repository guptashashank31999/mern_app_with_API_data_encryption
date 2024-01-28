import React,{useEffect} from 'react'
import { useState } from 'react'; 
import "../App.css"
import { useNavigate, useParams } from 'react-router-dom';



const UpdateProduct = () => {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [company, setCompany] = useState("");

    const params = useParams();
    const navigate = useNavigate();

    useEffect(() => {
      getProductDeatils()
    }, []);

const getProductDeatils = async () => {
      
        let result = await fetch(`http://localhost:8000/product/${params.id}`,{
          headers : {
            authorization : `bearer ${JSON.stringify(localStorage.getItem("token"))}`
          }
        });
        result = await result.json()
        setName(result.name);
        setPrice(result.price);
        setCategory(result.category);
        setCompany(result.company)
        console.log("result",result);
}
    

const updateProduct = async () => {
      let result = await fetch(`http://localhost:8000/product/${params.id}`,{
        method : 'put',
        body : JSON.stringify({ name ,price, category, company}),
        
        headers : {
          'Content-Type' : 'application/json',
            authorization : `bearer ${JSON.stringify(localStorage.getItem("token"))}`

        }

      });
      
      result = await result.json() 
      navigate("/")
      console.log("Result",result)
      //  console.log("UpdateProduct", name ,price, category, company)
    } 

  return (
    <div className="add-product" >
      <h2>Update Product</h2>

      <input className="add-prodInput" onChange={(e)=> setName(e.target.value)} value={name} type="text" placeholder="Enter product name" />
      <input className="add-prodInput" onChange={(e) => setPrice(e.target.value)} value={price} type="number" placeholder="Enter product price" />
      
      <input className="add-prodInput" onChange={(e)=> setCategory(e.target.value)} value={category} type="text" placeholder="Enter product category" />
      
      <input className="add-prodInput" onChange={(e)=> setCompany(e.target.value)} value={company} type="text" placeholder="Enter product company" />
      
      <button className="add-prodInput more-space" onClick={updateProduct}>Update Product</button>
    </div>
  )
}

export default UpdateProduct
