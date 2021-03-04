import React, {Component} from 'react'
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Input from '../Input'
class EnterVehicle extends Component {
    constructor(props){
        super(props)
        this.state = {
            categoryId: '',
            discountId: '',
            registrationNumber: ''
        }
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
console.log(data)
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
            registrationNumber
        } = this.state
        return(
            <Container>  
                <Row>
                    <Col></Col>
                    <Col md={8}>
                        <Jumbotron>
                            <form onSubmit={this.handleSubmit}>
                                <Input field="Category" value={categoryId} onChange={this.changeCategory}></Input>
                                <Input field="Dicount" value={discountId} onChange={this.changeDiscount}></Input>
                                <Input field="Registration Number" value={registrationNumber} onChange={this.changeRegistrationNumber}></Input>
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