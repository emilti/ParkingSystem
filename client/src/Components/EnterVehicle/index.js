import React, {Component} from 'react'
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Input from '../Input';
import SingleSelectDropdown from '../SingleSelectDropdown';

class EnterVehicle extends Component {
    constructor(props){
        super(props)
        this.state = {
            categories: [],
            discounts: [],
            categoryId: '',
            discountId: '',
            registrationNumber: '',
            registrationNumberError: ''
        }
    }

    validateRegistrationNumber = event => {
        if(event.target.value === ''){
            this.setState({ registrationNumberError: "Invalid registration number." })
        } else {
            this.setState({ registrationNumberError: "" })
        }
    }

    getCategories = async() => {
        const promise = await fetch('http://localhost:57740/parking/getcategories')
        const categories = await promise.json()
        const options = categories.map(c => ({
          "value" : c.categoryId,
          "label" : c.name + " (Occupied spaces: " + c.parkingSpaces + ")"
        }))
        this.setState({ categories: options })
        console.log(this.state.categories)
    }

    getDiscounts = async() => {
        const promise = await fetch('http://localhost:57740/parking/getdiscounts')
        const discounts = await promise.json()
        console.log(discounts)
        const options = discounts.map(d => ({
          "value" : d.discountId,
          "label" : d.name + " " + d.discountPercentage + "%"
        }))
        this.setState({ discounts: options })
        console.log(this.state.discounts)
    }

    componentDidMount(){
        this.getCategories()
        this.getDiscounts()
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
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ categoryId: this.state.categoryId, discountId: this.state.discountId, registrationNumber: this.state.registrationNumber })
        };
    
    
        event.preventDefault();
        fetch('http://localhost:57740/parking/enter', requestOptions)
        .then(async response => {
            const data = await response.json();
            // check for error response
            if (!response.ok) {
                // get error message from body or default to response status
                const error = (data && data.message) || response.status;
                return Promise.reject(error);
            }
        })
        .catch(error => {
            this.setState({ errorMessage: error.toString() });
            console.error('There was an error!', error);
        });
    }

    render(){
        const{
            categoryId,
            discountId,
            registrationNumber,
            registrationNumberError
        } = this.state
        return(
            <Container>  
                <Row>
                    <Col></Col>
                    <Col md={ 8 }>
                        <Jumbotron>
                            <form onSubmit={ this.handleSubmit }>
                                <Input field="Registration Number" onBlur={ this.validateRegistrationNumber } value={ registrationNumber } onChange={ this.changeRegistrationNumber } error={ registrationNumberError }></Input>
                                {/* {registrationNumberError !== "" ? registrationNumberError : ""} */}
                                <SingleSelectDropdown field="Category" options={ this.state.categories } onChange={ this.changeCategory }/>
                                <SingleSelectDropdown field="Discount" options={ this.state.discounts } onChange={ this.changeDiscount }/>
                                <Button variant="success" type="submit">Enter vehicle</Button>
                            </form>
                        </Jumbotron>
                    </Col>
                    <Col></Col>
                </Row>
            </Container>
      )
    }

    
}

export default EnterVehicle