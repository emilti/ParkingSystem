import React, {Component} from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Jumbotron from 'react-bootstrap/Jumbotron'
import Input from '../../Components/Input'
import Button from 'react-bootstrap/Button'

class Login extends Component {
    constructor(props){
        super(props)
        this.state = {
            username: '',
            password: '',
            usernameError: '',
            passwordError: ''
       }
    }

    changeUsername = event => {
        this.setState({
            username: event.target.value
       })
    }

    changePassword = event => {
        this.setState({
            password: event.target.value
       })
   }

    handleSubmit = async(event) => {
        event.preventDefault()
        const {
            username,
            password
        } = this.state
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"username": username, "password": password})
        };
        const promise = await fetch('http://localhost:57740/authenticate/login', requestOptions)
        const result = await promise.json()
        const authToken = result['token']
        document.cookie = `x-auth-token=${authToken}`
        this.props.history.push("/");
    }


    render (){
         const {
            username,
            password,
            usernameError,
            passwordError
        } = this.state
        return (<Container>
            <Row>
                <Col></Col>
                <Col md={8}>
                    <Jumbotron>
                        <form onSubmit={this.handleSubmit}>
                            <Input field="Username" type="text" value={username} onChange={this.changeUsername} error={usernameError}></Input>
                            <Input  field="Password" type='password' value={password} onChange={this.changePassword} error={passwordError}></Input>
                            <Button variant="success" type="submit">Login</Button>
                        </form>
                    </Jumbotron>
                </Col>
                <Col></Col>
            </Row>
        </Container>)
    }
}

export default Login