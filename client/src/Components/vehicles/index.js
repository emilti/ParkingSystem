import React, { Component } from 'react'
import Vehicle from '../vehicle'
import MultySelect from '../MultySelect'
import Input from '../Input'
import getCookie from '../../Utils/cookie'
import Button from 'react-bootstrap/Button'
import {getCategories, getDiscounts} from '../../Utils/dropdowns'
class Vehicles extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            vehicles: [],
            registrationNumberFilter: '',
            categories: [] ,
            discounts: []
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

    changeRegistrationNumberFilter = event => {
        this.setState({
            registrationNumberFilter: event.target.value
        })
    }

    componentDidMount(){
        getCategories().then((value) => {this.setState({categories: value})})
        getDiscounts().then((value) => {this.setState({discounts: value})})
        this.getVehicles()
    }

    handleSubmit = event => {
        var token = getCookie('x-auth-token')
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
            body: JSON.stringify({ registrationNumberFilter: this.state.registrationNumberFilter, token: token })
        };    
    
        event.preventDefault();
        fetch('http://localhost:57740/parking/FilterVehicles', requestOptions)
        .then(async response => {
            if (!response.ok) {
                // get error message from body or default to response status
                const error = response.status;
                return Promise.reject(error);
            }
            if(response.ok){
                response.json().then((result => {
                    console.log(result)
                }))
            }
        })
        .catch(error => {
            this.setState({ errorMessage: error.toString() });
            console.error('There was an error!', error);
        });
    }

    render() {
        return(
           <div>
                <Input type={"text"} field="Registration number" onChange={this.changeRegistrationNumberFilter}/>
                <MultySelect field={"Categories"} collection={this.state.categories}/>
                <MultySelect field={"Discounts"} collection={this.state.discounts}/>
                <Button variant="success" type="submit" onClick={this.handleSubmit}>Enter vehicle</Button>
                {
                   this.renderVehicles()
                }
           </div>
       )
    }
} 

export default Vehicles