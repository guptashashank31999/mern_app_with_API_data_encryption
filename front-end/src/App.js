import "./App.css";
import Footer from "../src/Components/Footer";
import Nav from "../src/Components/Nav";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./Components/Signup";
import PrivateComponent from "./Components/PrivateComponent";
import Login from "./Components/Login";
import AddProduct from "./Components/AddProduct";
import ProductList from "./Components/ProductList";
import UpdateProduct from "./Components/UpdateProduct";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Nav />
        <Routes>

        <Route element={<PrivateComponent/>}>

          <Route path="/" element={<ProductList />}/>

          <Route path="/add" element={<AddProduct/>} />
          
          <Route path="/update/:id" element={<UpdateProduct /> }/>
          
          <Route path="/logout" element={<h2>Logout Component</h2>}/>
          
          <Route path="/profile" element={<h2>Profile Component</h2>}/>
          
          </Route>

          
          <Route path="/signup" element={<Signup/>} />
          <Route path="/login" element={<Login />} />
        </Routes>

      </BrowserRouter>
      <Footer/>
    </div>
  );
}

export default App;
