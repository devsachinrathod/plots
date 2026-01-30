import React from "react";
import { Link } from 'react-router-dom'
//Here the photo

import logo from '../../assets/logo.png'
import search from '../../assets/search-solid.svg'
import Avatar from "../Avatar/Avatar";

import './Navbar.css'
const Navbar = () => {

    const User = null
return(
    

    <nav>
    <div className="navbar">
        <Link to='/' className="nav-item nav-btn">
            <img src={logo} alt='logo'></img>
        </Link>
        <Link to='/' className="nav-item nav-btn">About</Link>
        <Link to='/' className="nav-item nav-btn">Products</Link>
        <Link to='/' className="nav-item nav-btn">For Teams</Link>
        <form>
            <input type="text" placeholder="Search..." />
            <img src={search} alt="Search" width="18" className="search-icon"></img>
        </form> 
        
          { User === null ?
            <Link to='/Auth' className='nav-item nav-link'>Log in</Link> :
            <>
           <Avatar backgroundColor="#009dff" px="10px" py="6px" borderRadius="50%" color='white'> <Link to='/User' style={{color:"white", textDecoration:"none"}}>M</Link></Avatar>
            <button className="nav-item nav-link">Log out</button>
            </>
         }
    </div>
</nav>

)
}
export  default Navbar