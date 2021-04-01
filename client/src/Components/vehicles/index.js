import React, { Component } from 'react'
import Vehicle from '../vehicle'
import MultySelect from '../MultySelect'
import SingleSelectDropdown from '../SingleSelectDropdown'
import Input from '../Input'
import getCookie from '../../Utils/cookie'
import {Form, Col, Button} from 'react-bootstrap'
import {buildCategoriesDropdown, buildDiscountsDropdown, getSorting, getSortingOrder, getPageOptions} from '../../Utils/dropdowns'
import DateRangePicker from '@wojtekmaj/react-daterange-picker'
import CustomPagination from '../../Components/CustomPagination'
class Vehicles extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            vehicles: [],
            registrationNumber: '',
            categories: [] ,
            discounts: [],
            sortings: [],
            sortingOrders: [],
            itemsPerPageOptions: [],
            dateRange: [new Date(Date.now() - 86400000), new Date()],
            selectedCategories: [],
            selectedDiscounts: [],
            selectedSorting: null,
            selectedSortingOrder: null,
            selectedItemsPerPage: 10,
            pages: 1,
            selectedPage: 1
        }

        this.onCategoriesChange = this.onCategoriesChange.bind(this);
    }
    
    componentDidMount(){
        buildCategoriesDropdown("Filter vehicles").then((value) => {this.setState({categories: value})})
        buildDiscountsDropdown("Filter vehicles").then((value) => {this.setState({discounts: value})})
        getSorting().then((value) => {this.setState({sortings: value})})
        getSortingOrder().then((value) => {this.setState({sortingOrders: value})})
        getPageOptions().then((value) => {this.setState({itemsPerPageOptions: value})})
        this.getVehicles()
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
            }, () => {
                this.setState({pages: Math.ceil(vehicles.length / this.state.selectedItemsPerPage)})
        })
    }

    renderVehicles(){
        const {
            vehicles, 
            pages
        } = this.state 
        return vehicles.map((v, index) => {
            return (<div key={index}>
                <Vehicle registrationNumber = {v.registrationNumber} enterParkingDate={v.enterParkingDate} categoryName={v.categoryName} discountPercentage={v.discountPercentage} dueAmount={v.dueAmount} index={index}/>
            </div>)
       })
    }

    changeRegistrationNumber = event => {
        this.setState({
            registrationNumber: event.target.value
        })
    }


    handleSubmit = (event, page) => {
        var token = getCookie('x-auth-token')
        this.setState({selectedPage: page})
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token},
            body: JSON.stringify({
                registrationNumber: this.state.registrationNumber,
                selectedCategories: this.state.selectedCategories,
                selectedDiscounts: this.state.selectedDiscounts,
                selectedSorting: this.state.selectedSorting,
                selectedSortingOrder: this.state.selectedSortingOrder,
                selectedItemsPerPage: this.state.selectedItemsPerPage,
                selectedPage: this.state.selectedPage,
                token: token})
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

    changeSorting = event => {
        this.setState({
            selectedSorting: event.target.value === '' ? null : event.target.value
        }, () => {
            if(this.state.selectedSorting === null){
                this.setState({
                selectedSortingOrder: null
                }) 
            } else {
                this.setState({
                    selectedSortingOrder: "1"
                })
            }
        })
        
    }

    changeSortingOrder = event => {
        this.setState({
            selectedSortingOrder: event.target.value === '' ? null : event.target.value
        })
    }

    changeItemsPerPage = event => {
        this.setState({
            selectedItemsPerPage: event.target.value
        },
        () => {
            this.setState({pages: Math.ceil(this.state.vehicles.length / this.state.selectedItemsPerPage)})
        },
        this.renderVehicles())
    }


    render() {
        return(
            <div>
                <Form>
                    <Form.Row className="align-items-center">
                        <Input field="" type="text"  value={this.registrationNumber} onChange={this.changeRegistrationNumber} />
                        <MultySelect field={"Categories"} collection={this.state.categories} value={this.selectedCategories} onChangeMultyselect={e => this.onCategoriesChange(e)}/>
                        <MultySelect field={"Discounts"} collection={this.state.discounts} value={this.selectedDiscounts} onChangeMultyselect={e => this.onDiscountsChange(e)}/>
                        <Col sm={4}>
                            <DateRangePicker onChange={this.onChangeEnterDateRange} value={this.state.dateRange}/>
                        </Col>
                    </Form.Row><br/>
                    <Form.Row className="align-items-center">
                        <Col  sm={2}>
                            <SingleSelectDropdown field="" options={this.state.sortings} selected={this.state.selectedSorting} onChange={this.changeSorting}/>
                        </Col>
                        <Col sm={2}>
                            <SingleSelectDropdown field="" options={this.state.sortingOrders} selected={this.state.selectedSortingOrder} onChange={this.changeSortingOrder}/>
                        </Col>
                        <Col sm={2}>
                            <SingleSelectDropdown field="" options={this.state.itemsPerPageOptions} selected={this.state.selectedPage} onChange={this.changeItemsPerPage}/>
                        </Col>
                    </Form.Row>
                </Form>  
                <Button variant="success" type="submit" onClick={this.handleSubmit}>Filter visits</Button>
                {
                   this.renderVehicles()
                }
                   <CustomPagination pages={this.state.pages} active={this.state.selectedPage} handleSubmit={this.handleSubmit}/>
               
            </div>
       )
    }
} 

export default Vehicles