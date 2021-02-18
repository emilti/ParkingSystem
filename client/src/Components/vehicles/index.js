import React, { Component } from 'react';

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
       return vehicles.map(v => {
            return (<div key={v.id}>
                <span>{v.registrationNumber} </span>
                <span>{v.enterParkingDate} </span>
                <span>{v.categoryName} </span>
                <span>{v.discountPercentage} </span>
                <span>{v.dueAmount}</span>
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