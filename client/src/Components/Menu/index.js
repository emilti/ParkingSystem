import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import Styles from './index.module.css'
import { UserContext } from '../../Hooks/UserContext';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

const Header = () => {
    const {user, setUser, isLoading} = useContext(UserContext);
    const isAdmin = user && user.role === "Administrator"
    
    const logOut = () => {
        document.cookie = "x-auth-token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"
        setUser(null)
    }
    return(
        <header>
                <Navbar bg="light" variant="light">
                    <Navbar.Brand to="/">Parking</Navbar.Brand>
                        <Nav className="mr-auto">
                        <Link className="nav-link" to="/" >Home</Link>
                        {user ? <Link className="nav-link" to="/EnterVehicle">Enter Vehicle</Link> : ""} 
                        {user && isAdmin ? <Link className="nav-link" to="/Report">Vehicles</Link> : ""} 
                        </Nav>
                        <Nav className="ml-auto">
                           {user ? "" : <Link className="nav-link" to="/Register">Register</Link>} 
                           {user ? "" : <Link className="nav-link" to="/Login">Login</Link>} 
                           {user ? <Link  className="nav-link"  to="/" onClick={logOut}>Log Out</Link> : ""}
                        </Nav>
                </Navbar>
            </header>
    )
}

export default Header