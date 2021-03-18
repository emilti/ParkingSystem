import React, { Component } from 'react';
import Vehicle from '../vehicle';
import getCookie from '../../Utils/cookie'
class  Vehicles extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            vehicles: []
        }
    }
    
    getVehicles = async() => {
        var token = getCookie('x-auth-token')
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }
        };
        const promise = await fetch('http://localhost:57740/parking/getvehicles', requestOptions)
        const vehicles = await promise.json()
        this.setState({
            vehicles
        })
    }

    renderVehicles(){
        const {
            vehicles
        } = this.state        
       return vehicles.map((v, index) => {
            return (<div>
                <Vehicle key={v.id} registrationNumber = {v.registrationNumber} enterParkingDate={v.enterParkingDate} categoryName={v.categoryName} discountPercentage={v.discountPercentage} dueAmount={v.dueAmount} index={index}/>
            </div>)
       })
    }

    componentDidMount(){
        this.getVehicles()
    }
    render() {
       
       return(
           <div>
               {
                   this.renderVehicles()
               }
           </div>
       )
    }
} 

export default Vehicles