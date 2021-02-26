import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Styles from './index.module.css'

const Header = () =>{
    return (
        <header>
            <Link href="#" title="Vehicles" className={Styles.link}>Vehicles</Link>
            <Link href="#" title="Enter Vehicle" className={Styles.link}>Enter Vehicle</Link>
            <Link href="#" title="Profile" className={Styles.link}>Profile</Link>
            <Link href="#" title="Login" className={Styles.link}>Login</Link>
            <Link href="#" title="Register" className={Styles.link}>Register</Link>
        </header>
        )
}

export default Header