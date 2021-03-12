import React, { useState, useContext } from 'react'
import { useHistory } from "react-router-dom"
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Jumbotron from 'react-bootstrap/Jumbotron'
import Input from '../../Components/Input'
import Button from 'react-bootstrap/Button'
import Styles from './index.module.css'
const Register = () => {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordRepeat, setPasswordRepeat] = useState('')
    const [usernameError, setUsernameError] = useState('')
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [passwordRepeatError, setPasswordRepeatError] = useState('')
    const history = useHistory()

    const handleSubmit = async(event) => {
        event.preventDefault()
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"username": username, "email": email, "password": password})
        };
        fetch('http://localhost:57740/authenticate/register', requestOptions).then((response) => {
            if (response.ok) {
                    history.push('/login')
            } else if(response.status === 400) {
                response.json().then((result => {
                    setPasswordError(result.message)
                }))
            } else if(response.status === 401) {
                response.json().then((result => {
                    setPasswordError(result.message)
                }))
            } else if(response.status === 409) {
                response.json().then((result => {
                    setUsernameError(result.message)
                }))
            } else{
                throw new Error('Something went wrong!');
            }
          })
          .catch((error) => {
                setPasswordError("Invalid username or password.")
          });
    }

    const validateUsername = (e) => {
        if(!e.target.value){
            setUsernameError("Username field is required.")
        } else {
            setUsernameError("")
            setUsername(e.target.value)
        }
    }

    const validateEmail = (e) => {
        const emailRegex = /^\S+@\S+\.\S+$/;
        if(!e.target.value){
            setEmailError("Email field is required.")
        } else if(!emailRegex.test(e.target.value)) {
            setEmailError("Invalid email address.")
        } else {
            setEmailError("")
            setEmail(e.target.value)
        }
    }

    const validatePassword = (e) => {
        if(!e.target.value){
            setPasswordError("Password field is required.")
        } else {
            setPasswordError("")
            setPassword(e.target.value)
        }
    }

    const validatePasswordRepeat = (e) => {
        if(!e.target.value){
            setPasswordRepeatError("Password Repeat field is required.")
        } else if(e.target.value !== password){
            setPasswordRepeatError("Does not match password.")
        } else{
            setPasswordRepeatError("")
            setPasswordRepeat(e.target.value)

        }
    }

    return (
      <Container>
            <Row>
                <Col></Col>
                <Col md={8}>
                    <Jumbotron>
                        <form onSubmit={handleSubmit}>
                            <Input field="Username" type="text" value={username}  onChange={e => setUsername(e.target.value)} onBlur={validateUsername} error={usernameError}></Input>
                            <Input field="Email" type="text" value={email} onChange={e => setEmail(e.target.value)} onBlur={validateEmail} error={emailError}></Input>
                            <Input field="Password" type='password' value={password} onChange={e => setPassword(e.target.value)} onBlur={validatePassword} error={passwordError}></Input>
                            <Input field="Repeat Password" type='password' value={passwordRepeat} onChange={e => setPasswordRepeat(e.target.value)}  onBlur={validatePasswordRepeat} error={passwordRepeatError}></Input>
                            <Row>
                                <Col sm={{size: 8, order: 2, offset: 2}}>
                                    <p className={[Styles.passwordInfo]}>*Password must be at least 6 characters long, must contain at least one upper case letter and one digit.</p>
                                </Col>
                            </Row>
                            <Button variant="success" type="submit">Register</Button>
                        </form>
                    </Jumbotron>
                </Col>
                <Col></Col>
            </Row>
        </Container>)
}

export default Register