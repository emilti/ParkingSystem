import React, {Component} from 'react'
import {Container, Row, Col, Jumbotron, Button} from 'react-bootstrap'
import Input from '../../Components/Input'
import SingleSelectDropdown from '../../Components/SingleSelectDropdown'
import Menu from '../../Components/Menu'
import getCookie from '../../Utils/cookie'
import {getCategories, getDiscounts} from '../../Utils/dropdowns'
import {validateRegistrationNumber} from '../../Utils/validator.js'
class EnterVehicle extends Component {
    constructor(props){
        super(props)
        this.state = {
            categories: [{
                "value": "",
                "label": "Select category"
            }],
            discounts: [{
                "value": "",
                "label": "Select discount"
            }],
            categoryId: '',
            discountId: '',
            registrationNumber: '',
            registrationNumberError: ''
        }
    }

    // validateRegistrationNumber = event => {
    //     if(event.target.value === ''){
    //         this.setState({ registrationNumberError: "Invalid registration number." })
    //     } else {
    //         this.setState({ registrationNumberError: "" })
    //     }
    // }
    
    componentDidMount(){
        getCategories().then((value) => { 
            this.setState({categories: [...this.state.categories, ...value]
            })
        })
       
        getDiscounts().then((value) => { 
            this.setState({discounts: [...this.state.discounts, ...value]})
        })
    }

    changeCategory = event => {
        this.setState({
            categoryId: event.target.value
        })
    }

    changeDiscount = event => {
        this.setState({
            discountId: event.target.value
        })
    }
    
    changeRegistrationNumber = event => {
        this.setState({
            registrationNumber: event.target.value
        })
    }

    handleSubmit = event => {
        var token = getCookie('x-auth-token')
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
            body: JSON.stringify({ categoryId: this.state.categoryId, discountId: this.state.discountId, registrationNumber: this.state.registrationNumber, token: token })
        };
    
    
        event.preventDefault();
        fetch('http://localhost:57740/parking/enter', requestOptions)
        .then(async response => {
            if (!response.ok) {
                // get error message from body or default to response status
                const error = response.status;
                return Promise.reject(error);
            }
            if(response.ok){
                this.setState({
                    registrationNumberError: '',
                    categoryId: '',
                    discountId: ''
                })
            }
        })
        .catch(error => {
            this.setState({ errorMessage: error.toString() });
            console.error('There was an error!', error);
        });
    }

    updateRegistrationNumberError = (registrationNumberError) => {
        this.setState({registrationNumberError})
    }

    render(){
        const{
            categoryId,
            discountId,
            registrationNumber,
            registrationNumberError
        } = this.state
        return(
            <div>
                <Menu/>
                <Container>  
                    <Row>
                        <Col></Col>
                        <Col md={ 8 }>
                            <Jumbotron>
                                <form onSubmit={this.handleSubmit}>
                                    <Input field="Registration Number" type="text" onBlur={e => validateRegistrationNumber(e, this.updateRegistrationNumberError)} value={registrationNumber} onChange={this.changeRegistrationNumber} error={registrationNumberError}></Input>
                                    <SingleSelectDropdown field="Category" options={this.state.categories} onChange={this.changeCategory}/>
                                    <SingleSelectDropdown field="Discount" options={this.state.discounts} onChange={this.changeDiscount}/>
                                    <Button variant="success" type="submit">Enter vehicle</Button>
                                </form>
                            </Jumbotron>
                        </Col>
                        <Col></Col>
                    </Row>
                </Container>
            </div>
      )
    }
}

export default EnterVehicle