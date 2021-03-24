const validateUsername = (e, setUsername, setUsernameError) => {
    if(!e.target.value){
        setUsernameError("Username field is required.")
    } else {
        setUsernameError("")
        setUsername(e.target.value)
    }
}

const validateEmail = (e, setEmail, setEmailError) => {
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


const validatePassword = (e, setPassword, setPasswordError) => {
    if(!e.target.value){
        setPasswordError("Password field is required.")
    } else {
        setPasswordError("")
        setPassword(e.target.value)
    }
}

const validatePasswordRepeat = (e, password, setPasswordRepeat, setPasswordRepeatError) => {
    if(!e.target.value){
        setPasswordRepeatError("Password Repeat field is required.")
    } else if(e.target.value !== password){
        setPasswordRepeatError("Does not match password.")
    } else{
        setPasswordRepeatError("")
        setPasswordRepeat(e.target.value)
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