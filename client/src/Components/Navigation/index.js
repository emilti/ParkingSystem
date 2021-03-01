import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Styles from './index.module.css'

const Navigation = () =>{
    return (
        <div>
            <Link to="/" title="Vehicles" className={Styles.link}>Vehicles</Link>
            <Link to="/EnterVehicle" title="Enter Vehicle" className={Styles.link}>Enter Vehicle</Link>
            {/* <Link href="#" title="Profile" className={Styles.link}>Profile</Link>
            <Link href="#" title="Login" className={Styles.link}>Login</Link>
            <Link href="#" title="Register" className={Styles.link}>Register</Link> */}
        </div>
        )
}

export default Navigation