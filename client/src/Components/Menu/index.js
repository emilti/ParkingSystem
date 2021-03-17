import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import Styles from './index.module.css'
import { UserContext } from '../../Hooks/UserContext';
const Header = () => {
    const {user, setUser, isLoading} = useContext(UserContext);
    const isAdmin = user && user.role === "Administrator"
    return(
        <header>
            <div>
                <Link to="/" title="Parking" className={Styles.link}>Home</Link> 
                {user ? <Link to="/EnterVehicle" title="Enter Vehicle" className={Styles.link}>Enter Vehicle</Link> : ""} 
                {user ? "" : <Link to="/Register" title="Register" className={Styles.link}>Register</Link>} 
                {user ? "" : <Link to="/Login" title="Login" className={Styles.link}>Login</Link>} 
                {user && isAdmin ? <Link to="/Report" title="Report" className={Styles.link}>Vehicles</Link> : ""} 
            </div>
            </header>
    )
}

export default Header