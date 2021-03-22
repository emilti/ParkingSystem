import React, { useState, useContext } from 'react'
import { useHistory } from "react-router-dom"
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Jumbotron from 'react-bootstrap/Jumbotron'
import Input from '../../Components/Input'
import Button from 'react-bootstrap/Button'
import {UserContext} from '../../Hooks/UserContext.js'
import Menu from '../../Components/Menu'
import useAuth from '../../Hooks/useAuth';

const Profile = () =>{
    const {user} = useContext(UserContext);
    console.log(user)
    return (
        <div>
        <Menu/>
        <div>Profile</div>
        </div>
    )
}

export default Profile
