import { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { UserContext } from './UserContext';

export default function useAuth() {
    let history = useHistory();
    const {user, setUser} = useContext(UserContext);
    const [error, setError] = useState(null);
   
    const registerUser = async(data) => {
        const { username, password, email , setUsernameError, setPasswordError } = data;
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"username": username, "email": email, "password": password})
        };
        fetch('http://localhost:57740/authenticate/register', requestOptions).then((response) => {
            if (response.ok) {
                    history.push('/login')
            } else if(response.status === 400) {
                response.json().then((result => {
                    setPasswordError(result.message)
                }))
            } else if(response.status === 401) {
                response.json().then((result => {
                    setPasswordError(result.message)
                }))
            } else if(response.status === 409) {
                response.json().then((result => {
                    setUsernameError(result.message)
                }))
            } else{
                throw new Error('Something went wrong!');
            }
          })
          .catch((error) => {
                setPasswordError("Invalid username or password.")
          });
    }

    const loginUser = async(data) => {
        const { username, password, setPasswordError } = data;
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': 'true',
                'Access-Control-Allow-Origin': '*' 
            },
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
            } else if(response.status == 401) {
                setPasswordError("Invalid username or password.")
            } else {
                throw new Error('Something went wrong!');
            }
        })
        .catch((error) => {
                setError("Invalid username or password.")
        });
    }

    return { 
        registerUser,
        loginUser,   
        error
    }
}
