import React, { useState, useContext, useEffect } from 'react'
import {UserContext} from '../../Hooks/UserContext.js'
import Menu from '../../Components/Menu'
import useAuth from '../../Hooks/useAuth';
import getCookie from '../../Utils/cookie'
import {Row, Container} from "react-bootstrap"
import ParkingVisitCard from '../../Components/ParkingVisitCard'
import Styles from './index.module.css'

const Profile = () =>{
    const {user} = useContext(UserContext);
    const [dataItems, setDataItems] = useState([]);
    const [username, setUsername] = useState(null)
    const [email, setEmail] = useState(null)
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
                    responseJson.vehicles.map((r) => {  
                        items.push({Id: r.id, registrationNumber: r.registrationNumber, dueAmount: r.dueAmount, enterParkingDate: r.enterParkingDate, exitParkingDate: r.exitParkingDate, isInParking: r.isInParking, categoryName: r.category.name, parkingSpaces: r.category.parkingSpaces, discountPercentage: r.discount == null ? '-': r.discount.discountPercentage + "%"})
                    })

                    setUsername(responseJson.username)
                    setEmail(responseJson.email) 
                    items.forEach(element => {
                        setDataItems(dataItems => [...dataItems, element])
                    })
                });
            }}).catch(err => {
            console.log(err)
            });
        }   findProfile();
    }, []);

    const onExitParking = (registrationNumber) =>{
        var token = getCookie('x-auth-token')
        const requestOptions = {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    RegistrationNumber: registrationNumber
                })
            };
        fetch('http://localhost:57740/Parking/Exit?token='+ token, requestOptions)
        .then(async res => {
            if (res.ok) {
                res.json().then((result => {
                    var objIndex = dataItems.findIndex((obj => obj.Id == result.id));
                    var obj = dataItems[objIndex]
                    var updatedDataItems = [...dataItems]
                    obj.isInParking = false;
                    obj.exitParkingDate = result.exitParkingDate;
                    updatedDataItems[objIndex] = obj
                    setDataItems(updatedDataItems)
                }))

            }
        }).catch(err => {
            console.log(err)
        });
    }
    return (
        <div>
            <Menu/>
            <div className={Styles.containerMarginPersonalInformation}>
                <h5 className={Styles.fontMargin}>Personal information</h5>
                <div className={Styles.fontMarginPersonalInformation}>Username: {username}</div>
                <div className={Styles.fontMarginPersonalInformation}>Email: {email}</div>
            </div>
            <h5 className={Styles.fontMargin}>Parking visits:</h5>
            <Container className={Styles.containerStyle}>
                <Row>
                    {dataItems.map((el, i) => 
                        <ParkingVisitCard indexKey={i} registrationNumber={el.registrationNumber} dueAmount={el.dueAmount} enterParkingDate={el.enterParkingDate} exitParkingDate={el.exitParkingDate} isInParking={el.isInParking} categoryName={el.categoryName} parkingSpaces={el.parkingSpaces} discountPercentage={el.discountPercentage} handleExitParking={onExitParking}/>
                    )}
                </Row>
            </Container>
        </div>
    )
}

export default Profile
