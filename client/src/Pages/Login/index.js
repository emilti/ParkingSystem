import React, {useState, useContext, useEffect} from 'react'
import {useHistory} from "react-router-dom"
import {Container, Row, Col, Jumbotron, Button} from 'react-bootstrap'
import Input from '../../Components/Input'
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
    const [usernameFilled, setUsernameFilled] = useState(false)
    const [passwordFilled, setPasswordFilled] = useState(false)
    const [isDisabled, setIsDisabled] = useState(true)
    const history = useHistory()
    
    const handleSubmit = async(event) => {
        event.preventDefault()
        const values = {username, password, setPasswordError}
        await loginUser(values);
    }

    useEffect( () => {
        function checkButtonDisabled() {
            if(usernameError === '' && passwordError === '' && usernameFilled && passwordFilled){
                setIsDisabled(false)
            }
            else{
                setIsDisabled(true)
            }
        }
        checkButtonDisabled();
    }, [usernameError, passwordError, usernameFilled, passwordFilled]);


    return (
        <div>
            <Menu/>
            <Container>
                <Row>
                    <Col></Col>
                    <Col md={8}>
                        <Jumbotron className={Styles.jumbotronStyle}>
                            <form onSubmit={handleSubmit}>
                                <Input field="Username" type="text" value={username} onBlur={e => validateUsername(e, setUsername, setUsernameError, setUsernameFilled)} onChange={e => setUsername(e.target.value)} error={usernameError}></Input>
                                <Input  field="Password" type='password' value={password} onBlur={e => validatePassword(e, setPassword, setPasswordError, setPasswordFilled)} onChange={e => setPassword(e.target.value)} error={passwordError}></Input>
                                <Button variant="success" type="submit" disabled={isDisabled}>Login</Button>
                            </form>
                        </Jumbotron>
                    </Col>
                    <Col></Col>
                </Row>
            </Container>
        </div>)
}

export default Login