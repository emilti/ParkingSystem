import React, { useState, useContext } from 'react'
import { useHistory } from "react-router-dom"
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Jumbotron from 'react-bootstrap/Jumbotron'
import Input from '../../Components/Input'
import Button from 'react-bootstrap/Button'
import Menu from '../../Components/Menu'
import Styles from './index.module.css'
import useAuth from '../../Hooks/useAuth';
import {validateUsername, validateEmail, validatePassword, validatePasswordRepeat} from '../../Utils/validator.js'

const Register = () => {
    const { registerUser, error } = useAuth();
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
        const values = {username, email, password, passwordRepeat, setUsernameError, setPasswordError}
        await registerUser(values);
    }

    return (
        <div>
            <Menu/>
            <Container>
                    <Row>
                        <Col></Col>
                        <Col md={8}>
                            <Jumbotron>
                                <form onSubmit={handleSubmit}>
                                    <Input field="Username" type="text" value={username}  onChange={e => setUsername(e.target.value)} onBlur={e => validateUsername(e, setUsername, setUsernameError)} error={usernameError}></Input>
                                    <Input field="Email" type="text" value={email} onChange={e => setEmail(e.target.value)} onBlur={e => validateEmail(e, setEmail, setEmailError)} error={emailError}></Input>
                                    <Input field="Password" type='password' value={password} onChange={e => setPassword(e.target.value)} onBlur={e => validatePassword(e, setPassword, setPasswordError)} error={passwordError}></Input>
                                    <Input field="Repeat Password" type='password' value={passwordRepeat} onChange={e => setPasswordRepeat(e.target.value)}  onBlur={e => validatePasswordRepeat(e, password, setPasswordRepeat, setPasswordRepeatError)} error={passwordRepeatError}></Input>
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
                </Container>
            </div>)
        
}

export default Register