const validateUsername = (e,setUsername, setUsernameError) => {
    if(!e.target.value){
        setUsernameError("Username field is required.")
    } else {
        setUsernameError("")
        setUsername(e.target.value)
    }
}
export default validateUsername

const validatePassword = (e, setPassword, setPasswordError) => {
    if(!e.target.value){
        setPasswordError("Password field is required.")
    } else {
        setPasswordError("")
        setPassword(e.target.value)
    }
}
export {validateUsername, validatePassword}