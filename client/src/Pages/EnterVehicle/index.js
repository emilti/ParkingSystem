import React, {Component} from 'react'
import {Container, Row, Col, Jumbotron, Button} from 'react-bootstrap'
import {Redirect} from 'react-router-dom'
import Input from '../../Components/Input'
import SingleSelectDropdown from '../../Components/SingleSelectDropdown'
import Menu from '../../Components/Menu'
import getCookie from '../../Utils/cookie'
import Styles from './index.module.css'
import {buildCategoriesDropdown, buildDiscountsDropdown} from '../../Utils/dropdowns'
import {validateRegistrationNumber} from '../../Utils/validator.js'
class EnterVehicle extends Component {
    constructor(props){
        super(props)
        this.state = {
            categories: [],
            discounts: [],
            categoryId: '',
            discountId: null,
            registrationNumber: '',
            registrationNumberError: '',
            registrationNumberFilled: false,
            categorySelected: false,
            discountSelected: false,
            isDisabled: true,
            redirect: false
        }
    }

    componentDidMount(){
        buildCategoriesDropdown("Enter vehicle").then((value) => { 
            this.setState({categories: [...this.state.categories, ...value]
            })
        })
       
        buildDiscountsDropdown("Enter vehicle").then((value) => { 
            this.setState({discounts: [...this.state.discounts, ...value]})
        })
    }

    componentDidUpdate(){
        if(this.state.isDisabled && this.state.registrationNumberError === '' && this.state.registrationNumberFilled && this.state.categorySelected && this.state.discountSelected){
            this.setState({
                isDisabled: false
            })
        }
        if(!this.state.isDisabled && !this.state.registrationNumberError && !this.state.categorySelected && !this.state.discountSelected){
            this.setState({
                isDisabled: true
            })
        }
    }
    

    changeCategory = event => {
        this.setState({
            categoryId: event.target.value,
            categorySelected: true
        })
    }

    changeDiscount = event => {
        this.setState({
            discountId: event.target.value,
            discountSelected: true
        })
    }
    
    changeRegistrationNumber = event => {
        this.setState({
            registrationNumber: event.target.value,
            registrationNumberFilled: true
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
                    discountId: '',
                    redirect: true
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
            registrationNumber,
            registrationNumberError
        } = this.state

        if (this.state.redirect) {
            return <Redirect to='/report'/>;
        }
        return(
            <div>
                <Menu/>
                <Container>  
                    <Row>
                        <Col></Col>
                        <Col md={ 8 }>
                            <Jumbotron className={Styles.jumbotronStyle}>
                                <form onSubmit={this.handleSubmit}>
                                    <Input field="Registration Number" type="text" onBlur={e => validateRegistrationNumber(e, this.updateRegistrationNumberError)} value={registrationNumber} onChange={this.changeRegistrationNumber} error={registrationNumberError}></Input>
                                    <SingleSelectDropdown field="Category" options={this.state.categories} onChange={this.changeCategory}/>
                                    <SingleSelectDropdown field="Discount" options={this.state.discounts} onChange={this.changeDiscount}/>
                                    <Button disabled={this.state.isDisabled} variant="success" type="submit">Enter vehicle</Button>
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