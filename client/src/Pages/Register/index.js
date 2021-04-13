import React, {useState, useEffect} from 'react'
import { useHistory } from "react-router-dom"
import {Container, Row, Col, Jumbotron, Button} from 'react-bootstrap'
import Input from '../../Components/Input'
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
    const [usernameFilled, setUsernameFilled] = useState(false)
    const [emailFilled, setEmailFilled] = useState(false)
    const [passwordFilled, setPasswordFilled] = useState(false)
    const [passwordRepeatFilled, setPasswordRepeatFilled] = useState(false)
    const history = useHistory()
    const [isDisabled, setIsDisabled] = useState(true)

    const handleSubmit = async(event) => {
        event.preventDefault()
        const values = {username, email, password, passwordRepeat, setUsernameError, setPasswordError}
        await registerUser(values);
    }

    useEffect( () => {
        function checkButtonDisabled() {
            console.log(usernameError === '' &&  emailError === '' && passwordError === '' && passwordRepeatError === '')
            if(usernameError === '' &&  emailError === '' && passwordError === '' && passwordRepeatError === '' &&
                usernameFilled && emailFilled && passwordFilled && passwordRepeatFilled ){
                setIsDisabled(false)
                console.log('here')
            }
            else{
                setIsDisabled(true)
            }
        }
        checkButtonDisabled();
    }, [usernameError, emailError, passwordError, passwordRepeatError, usernameFilled, emailFilled, passwordFilled, passwordRepeatFilled]);


    return (
        <div>
            <Menu/>
            <Container>
                    <Row>
                        <Col></Col>
                        <Col md={8}>
                            <Jumbotron className={Styles.jumbotronStyle}>
                                <form onSubmit={handleSubmit}>
                                    <Input field="Username" type="text" value={username}  onChange={e => setUsername(e.target.value)} onBlur={e => validateUsername(e, setUsername, setUsernameError, setUsernameFilled)} error={usernameError}></Input>
                                    <Input field="Email" type="text" value={email} onChange={e => setEmail(e.target.value)} onBlur={e => validateEmail(e, setEmail, setEmailError, setEmailFilled)} error={emailError}></Input>
                                    <Input field="Password" type='password' value={password} onChange={e => setPassword(e.target.value)} onBlur={e => validatePassword(e, setPassword, setPasswordError, setPasswordFilled)} error={passwordError}></Input>
                                    <Input field="Repeat Password" type='password' value={passwordRepeat} onChange={e => setPasswordRepeat(e.target.value)}  onBlur={e => validatePasswordRepeat(e, password, setPasswordRepeat, setPasswordRepeatError, setPasswordRepeatFilled)} error={passwordRepeatError}></Input>
                                    <Row>
                                        <Col sm={{size: 8, order: 2, offset: 2}}>
                                            <p className={[Styles.passwordInfo]}>*Password must be at least 6 characters long, must contain at least one upper case letter and one digit.</p>
                                        </Col>
                                    </Row>
                                    <Button variant="success" type="submit" disabled={isDisabled}>Register</Button>
                                </form>
                            </Jumbotron>
                        </Col>
                        <Col></Col>
                    </Row>
                </Container>
            </div>)
        
}

export default Register