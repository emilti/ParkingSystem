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
import {validateUsername, validatePassword} from '../../Utils/validator.js'
import useAuth from '../../Hooks/useAuth';
import Styles from './index.module.css'
const Login = () => {
    const { loginUser, error } = useAuth();
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [usernameError, setUsernameError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const history = useHistory()
    
    const handleSubmit = async(event) => {
        event.preventDefault()
        const values = {username, password, setPasswordError}
        await loginUser(values);
    }

    return (
        <div>
            <Menu/>
            <Container>
                <Row>
                    <Col></Col>
                    <Col md={8}>
                        <Jumbotron className={Styles.jumbotronStyle}>
                            <form onSubmit={handleSubmit}>
                                <Input field="Username" type="text" value={username} onBlur={e => validateUsername(e, setUsername, setUsernameError)} onChange={e => setUsername(e.target.value)} error={usernameError}></Input>
                                <Input  field="Password" type='password' value={password} onBlur={e => validatePassword(e, setPassword, setPasswordError)} onChange={e => setPassword(e.target.value)} error={passwordError}></Input>
                                <Button variant="success" type="submit">Login</Button>
                            </form>
                        </Jumbotron>
                    </Col>
                    <Col></Col>
                </Row>
            </Container>
        </div>)
}

export default Login