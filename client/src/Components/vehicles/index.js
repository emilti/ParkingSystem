import React, { Component } from 'react'
import Vehicle from '../vehicle'
import MultySelect from '../MultySelect'
import getCookie from '../../Utils/cookie'
import {Form, Col, Button} from 'react-bootstrap'
import {getCategories, getDiscounts} from '../../Utils/dropdowns'
import DateRangePicker from '@wojtekmaj/react-daterange-picker'
class Vehicles extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            vehicles: [],
            registrationNumber: '',
            categories: [] ,
            discounts: [],
            dateRange: [new Date(Date.now() - 86400000), new Date()],
            selectedCategories: [],
            selectedDiscounts: []
        }

        this.onCategoriesChange = this.onCategoriesChange.bind(this);
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
            vehicles: vehicles
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

    changeRegistrationNumber = event => {
        this.setState({
            registrationNumber: event.target.value
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
            headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token},
            body: JSON.stringify({
                registrationNumber: this.state.registrationNumber,
                selectedCategories: this.state.selectedCategories,
                selectedDiscounts: this.state.selectedDiscounts,
                token: token})
            };    
            console.log(requestOptions)
    
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
                    this.setState({
                        vehicles: result
                    })
                }))
            }
        })
        .catch(error => {
            this.setState({ errorMessage: error.toString() });
            console.error('There was an error!', error);
        });
    }

    onChangeEnterDateRange = (date) =>{
        if(date != null){
          this.setState(dateRange => ({dateRange: [ date[0], date[1]]}));
        }
        else{
            this.setState({dateRange: [new Date(Date.now() - 86400000), new Date()]})
        }
    }

    onCategoriesChange = (e) =>{
        const selected=[];
        let selectedOption=(e.target.selectedOptions);
        for (let i = 0; i < selectedOption.length; i++){
            selected.push(selectedOption.item(i).value)
        }
        this.setState({selectedCategories: selected}) 
    }

    onDiscountsChange = (e) =>{
        const selected=[];
        let selectedOption=(e.target.selectedOptions);
        for (let i = 0; i < selectedOption.length; i++){
            selected.push(selectedOption.item(i).value)
        }
        this.setState({selectedDiscounts: selected})  
    }


    render() {
        return(
           <div>
         <Form>
            <Form.Row className="align-items-center">
                <Col sm={3} className="my-1">
                    <Form.Label htmlFor="inlineFormInputRegistrationumber" srOnly>
                    Registration number
                    </Form.Label>
                    <Form.Control id="inlineFormInputRegistrationumber" placeholder="Registration number" value={this.registrationNumber} onChange={this.changeRegistrationNumber} />
                </Col>
                <MultySelect field={"Categories"} collection={this.state.categories} value={this.selectedCategories} onChangeMultyselect={e => this.onCategoriesChange(e)}/>
                <MultySelect field={"Discounts"} collection={this.state.discounts} value={this.selectedDiscounts} onChangeMultyselect={e => this.onDiscountsChange(e)}/>
                <Col sm={4}>
                    <DateRangePicker onChange={this.onChangeEnterDateRange} value={this.state.dateRange}/>
                </Col>
            </Form.Row>
        </Form>  
        <Button variant="success" type="submit" onClick={this.handleSubmit}>Filter visits</Button>
                {
                   this.renderVehicles()
                }
           </div>
       )
    }
} 

export default Vehicles