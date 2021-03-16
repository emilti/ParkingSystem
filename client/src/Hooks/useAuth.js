import { useState, useContext } from 'react';
import context from 'react-bootstrap/esm/AccordionContext';
import { useHistory } from 'react-router-dom';
// import axios from 'axios';
import { UserContext } from './UserContext';

export default function useAuth() {
    let history = useHistory();
    const {user, setUser} = useContext(UserContext);
    const [error, setError] = useState(null);
    //set user in context and push them home
    // const setUserContext = async () => {
    // return await axios.get('/user').then(res => {
    //     setUser(res.data.currentUser);
    //     history.push('/home');
    //     }).catch((err) => {
    //     setError(err.response.data);
    //     })
    // }

    //register user
    // const registerUser = async (data) => {
    //     const { username, email, password, passwordConfirm } = data;
    //     return axios.post(`auth/register`, {
    //         username, email, password, passwordConfirm
    //     }).catch((err) => {
    //         setError(err.response.data);
    //     })
    // };
    //login user
    // const loginUser = async (data) => {
    // const { username, password } = data;
    //     return axios.post(`auth/login`, {
    //         username, password
    //     }).then(async () => {
    //         await setUserContext();
    //     }).catch((err) => {
    //         setError(err.response.data);
    //     })
    // };


    const loginUser = async(data) =>{
        const { username, password } = data;
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"username": username, "password": password})
        };
        fetch('http://localhost:57740/authenticate/login', requestOptions).then((response) => {
            if (response.ok) {
                response.json().then((responseJson) => {
                    const authToken = responseJson['token']
                    const user = responseJson['user']
                    document.cookie = `x-auth-token=${authToken}`
                    setUser(user)
                    history.push('/')
                })
            } else if(response.status === 401) {
                throw new Error('Invalid username or password.');
            } else{
                throw new Error('Something went wrong!');
            }
        })
        .catch((error) => {
                setError("Invalid username or password.")
        });
    }

    return { 
        loginUser,   
        error
    }
}
