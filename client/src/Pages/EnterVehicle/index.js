import React, {Component} from 'react'
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Input from '../../Components/Input';
import SingleSelectDropdown from '../../Components/SingleSelectDropdown';
import Menu from '../../Components/Menu'
import getCookie from '../../Utils/cookie'
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
        console.log(categories)
        let options = categories.map(c => ({
          "value" : c.categoryId,
          "label" : c.name + " (Occupied spaces: " + c.parkingSpaces + ")"
        }))
        options.splice(0, 0, {"value": "", "label": "Select category" })
        this.setState({ categories: options })
    }

    getDiscounts = async() => {
        const promise = await fetch('http://localhost:57740/parking/getdiscounts')
        const discounts = await promise.json()
        let options = [];
        options = discounts.map(d => ({
          "value" : d.discountId,
          "label" : d.name + " " + d.discountPercentage + "%"
        }))
        options.splice(0, 0, {"value": "", "label": "Select discount" })
        this.setState({ discounts: options })
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
        var token = getCookie('x-auth-token')
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
            body: JSON.stringify({ categoryId: this.state.categoryId, discountId: this.state.discountId, registrationNumber: this.state.registrationNumber })
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
                                <form onSubmit={ this.handleSubmit }>
                                    <Input field="Registration Number" type="text" onBlur={ this.validateRegistrationNumber } value={ registrationNumber } onChange={ this.changeRegistrationNumber } error={ registrationNumberError }></Input>
                                    <SingleSelectDropdown field="Category" options={ this.state.categories } onChange={ this.changeCategory }/>
                                    <SingleSelectDropdown field="Discount" options={ this.state.discounts } onChange={ this.changeDiscount }/>
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