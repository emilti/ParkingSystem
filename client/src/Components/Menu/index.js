import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import Styles from './index.module.css'
import { UserContext } from '../../Hooks/UserContext';
const Header = () => {
    const {user, setUser, isLoading} = useContext(UserContext);
    const isAdmin = user && user.role === "Administrator"
    
    const logOut = () => {
        document.cookie = "x-auth-token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"
        setUser(null)
    }
    return(
        <header>
            <div>
                <Link to="/" title="Parking" className={Styles.link}>Home</Link> 
                {user ? <Link to="/EnterVehicle" title="Enter Vehicle" className={Styles.link}>Enter Vehicle</Link> : ""} 
                {user ? "" : <Link to="/Register" title="Register" className={Styles.link}>Register</Link>} 
                {user ? "" : <Link to="/Login" title="Login" className={Styles.link}>Login</Link>} 
                {user && isAdmin ? <Link to="/Report" title="Report" className={Styles.link}>Vehicles</Link> : ""} 
                {user ? <Link to="/" title="Log Out" onClick={logOut} className={Styles.link}>Log Out</Link> : ""}
            </div>
            </header>
    )
}

export default Header