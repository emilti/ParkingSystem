const validateUsername = (e, setUsername, setUsernameError, setUsernameFilled) => {
    if(!e.target.value){
        setUsernameError("Username field is required.")
    } else {
        setUsernameError("")
        setUsername(e.target.value)
        setUsernameFilled(true)
    }
}

const validateEmail = (e, setEmail, setEmailError, setEmailFilled) => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    if(!e.target.value){
        setEmailError("Email field is required.")
    } else if(!emailRegex.test(e.target.value)) {
        setEmailError("Invalid email address.")
    } else {
        setEmailError("")
        setEmailFilled(true)
        setEmail(e.target.value)
    }
}


const validatePassword = (e, setPassword, setPasswordError, setPasswordFilled) => {
    if(!e.target.value){
        setPasswordError("Password field is required.")
    } else {
        setPasswordError("")
        setPassword(e.target.value)
        setPasswordFilled(true)
    }
}

const validatePasswordRepeat = (e, password, setPasswordRepeat, setPasswordRepeatError, setPasswordRepeatFilled) => {
    if(!e.target.value){
        setPasswordRepeatError("Password Repeat field is required.")
    } else if(e.target.value !== password){
        setPasswordRepeatError("Does not match password.")
    } else{
        setPasswordRepeatError("")
        setPasswordRepeat(e.target.value)
        setPasswordRepeatFilled(true)
    }
}

const validateRegistrationNumber = (event, updateRegistrationNumberError) => {
    if(event.target.value === ''){
        updateRegistrationNumberError("Invalid registration number.")
    } else {
        updateRegistrationNumberError("")
    }
}

export {validateUsername,validateEmail, validatePassword, validatePasswordRepeat, validateRegistrationNumber}