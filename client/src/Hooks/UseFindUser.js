import { useState, useEffect } from 'react';
import getCookie from '../Utils/cookie'
export default function useFindUser() {
   const [user, setUser] = useState(null);
   const [isLoading, setLoading] = useState(true);
   
    useEffect( () => {
        function findUser() {
        var token = getCookie('x-auth-token')
        const requestOptions = {
                method: 'POST',
                headers: {'Content-Type': 'application/json'}
            };

        fetch('http://localhost:57740/Authenticate/Verify?token='+ token, requestOptions)
        .then(res => {
            if (res.ok) {
                res.json().then((responseJson) => {
                    setUser(responseJson);
                    setLoading(false);
                })
            }
    }).catch(err => {
        setLoading(false);
    });
  }   findUser();
}, []);

return {
   user,
   setUser,
   isLoading
   }
}