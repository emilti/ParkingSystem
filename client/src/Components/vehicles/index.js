import React, { Component } from 'react';
import Vehicle from '../vehicle';

class  Vehicles extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            vehicles: []
        }
    }
    
    getVehicles = async() => {
        const promise = await fetch('http://localhost:57740/parking/getvehicles')
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