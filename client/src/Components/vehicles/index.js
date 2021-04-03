import React, { Component } from 'react'
import TopRow from '../TopRow'
import Vehicle from '../vehicle'
import MultySelect from '../MultySelect'
import SingleSelectDropdown from '../SingleSelectDropdown'
import getCookie from '../../Utils/cookie'
import {Form, Col, Button} from 'react-bootstrap'
import {buildCategoriesDropdown, buildDiscountsDropdown, getIsInParkingOptions, getSorting, getSortingOrder, getPageOptions} from '../../Utils/dropdowns'
import DateRangePicker from '@wojtekmaj/react-daterange-picker'
import CustomPagination from '../../Components/CustomPagination'
import FilterInput from '../../Components/FilterInput'
import FilterSingleSelectDropdown from '../FilterSingleSelectDropdown'
import Styles from './index.module.css'
import '../../main.9ccb599a.css'
class Vehicles extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            vehicles: [],
            totalVehiclesCount: 0,
            registrationNumber: '',
            categories: [] ,
            discounts: [],
            isInParkingOptions: [],
            sortings: [],
            sortingOrders: [],
            itemsPerPageOptions: [],
            selectedDateRange: [new Date(new Date().getFullYear(),new Date().getMonth() - 1, new Date().getDate()), new Date()],
            selectedCategories: [],
            selectedDiscounts: [],
            selectedIsInParkingOption: 'all',
            selectedSorting: null,
            selectedSortingOrder: null,
            selectedItemsPerPage: 50,
            pages: 1,
            selectedPage: 1
        }

        this.onCategoriesChange = this.onCategoriesChange.bind(this);
        this.onDiscountsChange = this.onDiscountsChange.bind(this);
        this.onRegistrationNumberChange = this.onRegistrationNumberChange.bind(this);
        this.onSortingChange = this.onSortingChange.bind(this)
        this.onSortingOrderChange = this.onSortingOrderChange.bind(this)
        this.onItemsPerPageChange = this.onItemsPerPageChange.bind(this)
    }
    
    componentDidMount(){
        buildCategoriesDropdown("Filter vehicles").then((value) => {this.setState({categories: value})})
        buildDiscountsDropdown("Filter vehicles").then((value) => {this.setState({discounts: value})})
        getIsInParkingOptions().then((value) => {this.setState({isInParkingOptions: value})})
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
            vehicles: vehicles,
            totalVehiclesCount: vehicles.length,            
            }, () => {
                this.setState({pages: Math.ceil(vehicles.length / this.state.selectedItemsPerPage)})
        })
    }

    renderVehicles = () =>{
        const {
            vehicles, 
            pages
        } = this.state 

        return [this.renderTopRow()].concat(vehicles.map((v, index) => {
                return (
                        <div key={index}>
                            <Vehicle registrationNumber={v.registrationNumber} isInParking={v.isInParking} enterParkingDate={v.enterParkingDate} exitParkingDate={v.exitParkingDate} categoryName={v.categoryName} discountPercentage={v.discountPercentage} dueAmount={v.dueAmount} index={index}/>
                        </div>
                    )
            })).concat(this.renderPagination())
    }

    renderPagination = () => {
        return <CustomPagination pages={this.state.pages} active={this.state.selectedPage} handleSubmit={this.handleSubmit}/>
    }

    renderTopRow = () =>{
        return <TopRow/>
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
                selectedIsInParkingOption: (this.state.selectedIsInParkingOption != 'all' ? JSON.parse(this.state.selectedIsInParkingOption) : null),
                selectedDateRange: this.state.selectedDateRange,
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

    onRegistrationNumberChange = event => {
        this.setState({
            registrationNumber: event.target.value
        })
    }


    onChangeEnterDateRange = (date) =>{
        if(date != null){
          this.setState({selectedDateRange: ([this.convertToUtc(date[0]), this.convertToUtc(date[1])])});
        }
        else{
            this.setState({selectedDateRange: [new Date(new Date().getFullYear(),new Date().getMonth() - 1, new Date().getDate()), new Date()]})
        }
    }

    convertToUtc(date){
        var now_utc =  Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
         date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
         return new Date(now_utc);
    }

 
    onCategoriesChange = (e) => {
        const selected=[];
        let selectedOption=(e.target.selectedOptions);
        for (let i = 0; i < selectedOption.length; i++){
            selected.push(selectedOption.item(i).value)
        }
        this.setState({selectedCategories: selected}) 
    }

    onDiscountsChange = (e) => {
        const selected=[];
        let selectedOption=(e.target.selectedOptions);
        for (let i = 0; i < selectedOption.length; i++){
            selected.push(selectedOption.item(i).value)
        }
        this.setState({selectedDiscounts: selected})  
    }

    onIsInParkingChange = (event) => {
        this.setState({
            selectedIsInParkingOption: event.target.value
        })
    }

    onSortingChange = event => {
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

    onSortingOrderChange = event => {
        this.setState({
            selectedSortingOrder: event.target.value === '' ? null : event.target.value
        })
    }

    onItemsPerPageChange = event => {
        this.setState({
            selectedItemsPerPage: event.target.value
        },
        () => {
            this.setState({pages: Math.ceil(this.state.totalVehiclesCount / this.state.selectedItemsPerPage)}, 
            () => this.renderVehicles())
            }
        )
    }

    render() {
        return(
            <div>
                <Form>
                    <Form.Row className="align-items-top">
                        <MultySelect field={"Categories:"} collection={this.state.categories} value={this.selectedCategories} onChangeMultyselect={e => this.onCategoriesChange(e)}/>
                        <MultySelect field={"Discounts:"} collection={this.state.discounts} value={this.selectedDiscounts} onChangeMultyselect={e => this.onDiscountsChange(e)}/>
                        <Col sm={2}>
                            <FilterInput type="text" field="Registration Number:"  value={this.registrationNumber} onChange={this.onRegistrationNumberChange} />
                            <FilterSingleSelectDropdown field="In Parking:" options={this.state.isInParkingOptions} selected={this.state.selectedIsInParkingOption} onChange={this.onIsInParkingChange}/>
                        </Col>
                        <Col sm={4}>
                            <div>Enter parking date:</div>
                            <DateRangePicker onChange={this.onChangeEnterDateRange} value={this.state.selectedDateRange}/>
                        </Col>
                    </Form.Row><br/>
                    <Form.Row className="align-items-center">
                        <Col  sm={2} className={"pl-4"}>
                            <FilterSingleSelectDropdown field="Filter by:" options={this.state.sortings} selected={this.state.selectedSorting} onChange={this.onSortingChange}/>
                        </Col>
                        <Col sm={2} className={"pl-4"}>
                            <FilterSingleSelectDropdown field="Order:" options={this.state.sortingOrders} selected={this.state.selectedSortingOrder} onChange={this.onSortingOrderChange}/>
                        </Col>
                        <Col sm={2} className={"pl-4"}>
                            <FilterSingleSelectDropdown field="Show:" options={this.state.itemsPerPageOptions} selected={this.state.selectedItemsPerPage} onChange={this.onItemsPerPageChange}/>
                        </Col>
                    </Form.Row>
                </Form>  
                <Button variant="success" type="submit" onClick={this.handleSubmit}>Filter visits</Button>
                <div className={Styles.containerPosition}>
                {
                   this.renderVehicles()
                }
                </div>
                
               
            </div>
       )
    }
} 

export default Vehicles