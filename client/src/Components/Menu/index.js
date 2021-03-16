import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import Styles from './index.module.css'
import { UserContext } from '../../Hooks/UserContext';
import useFindUser from '../../Hooks/UseFindUser'
const Header = () => {
    const {user, setUser, isLoading} = useContext(UserContext);
    return(
        <header>
            <div>
                {user ? <Link to="/" title="Vehicles" className={Styles.link}>Vehicles</Link> : ""} 
                {user ? <Link to="/EnterVehicle" title="Enter Vehicle" className={Styles.link}>Enter Vehicle</Link> : ""} 
                {user ? "" : <Link to="/Register" title="Register" className={Styles.link}>Register</Link>} 
                {user ? "" : <Link to="/Login" title="Login" className={Styles.link}>Login</Link>} 
            </div>
            </header>
    )
}

export default Header