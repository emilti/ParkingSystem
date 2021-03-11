import React, { useState, useContext } from 'react'
import { useHistory } from "react-router-dom"
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Jumbotron from 'react-bootstrap/Jumbotron'
import Input from '../../Components/Input'
import Button from 'react-bootstrap/Button'

const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [usernameError, setUsernameError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const history = useHistory()

    const handleSubmit = async(event) => {
        event.preventDefault()
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"username": username, "password": password})
        };
        fetch('http://localhost:57740/authenticate/login', requestOptions).then((response) => {
            if (response.ok) {
                response.json().then((responseJson) => {
                    console.log(responseJson)
                    const authToken = responseJson['token']
                    document.cookie = `x-auth-token=${authToken}`
                    history.push('/')
                  })
            } else if(response.status === 401) {
                throw new Error('Invalid username or password.');
            } else{
                throw new Error('Something went wrong!');
            }
          })
          .catch((error) => {
                setPasswordError("Invalid username or password.")
          });
       
    }

    return (
      <Container>
            <Row>
                <Col></Col>
                <Col md={8}>
                    <Jumbotron>
                        <form onSubmit={handleSubmit}>
                            <Input field="Username" type="text" value={username} onChange={e => setUsername(e.target.value)}></Input>
                            <Input  field="Password" type='password' value={password} onChange={e => setPassword(e.target.value)} error={passwordError}></Input>
                            <Button variant="success" type="submit">Login</Button>
                        </form>
                    </Jumbotron>
                </Col>
                <Col></Col>
            </Row>
        </Container>)
}

export default Login