import React, { useState, useContext, useEffect } from 'react'
import {UserContext} from '../../Hooks/UserContext.js'
import Menu from '../../Components/Menu'
import useAuth from '../../Hooks/useAuth';
import getCookie from '../../Utils/cookie'

const Profile = () =>{
    const {user} = useContext(UserContext);
    const [dataItems, setDataItems] = useState([]);
    console.log(user)
    useEffect( () => {
        function findProfile() {
        var token = getCookie('x-auth-token')
        const requestOptions = {
                method: 'POST',
                headers: {'Content-Type': 'application/json'}
            };

        fetch('http://localhost:57740/Authenticate/Profile?token='+ token, requestOptions)
        .then(res => {
            if (res.ok) {
                res.json().then((responseJson) => {
                    var items = new Array();
                    responseJson.map((r) => {     
                        items.push({ registrationNumber: r.registrationNumber, dueAmount: r.dueAmount, enterParkingDate: r.enterParkingDate})
                    })
                    items.forEach(element => {
                        setDataItems(dataItems => [...dataItems, element])
                    })
                });
            }}).catch(err => {
            console.log(err)
            });
        }   findProfile();
    }, []);

    return (
        <div>
        <Menu/>
        <div>Profile</div>
        <div>
            {dataItems.map((el, i,) => 
                <div><div key={i}>{el.registrationNumber}</div><div>{el.dueAmount}</div><div>{el.enterParkingDate}</div></div>
            )}
        </div>
        </div>
    )
}

export default Profile
