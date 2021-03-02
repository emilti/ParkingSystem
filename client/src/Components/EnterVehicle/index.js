import React, {Component} from 'react'

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
        <div>
            <div>Enter vehicle</div>
            <form onSubmit={this.handleSubmit}>
                <div>
                    <label htmlFor="category">
                        Category:
                        <input value={categoryId} id="category" onChange={this.changeCategory}></input>
                    </label>
                </div>
                <div>
                    <label htmlFor="dicount">
                        Discount:
                        <input value={discountId} id="dicount" onChange={this.changeDiscount}></input>
                    </label>
                </div>
                <div>
                    <label htmlFor="registrationNumber">
                        Registration number:
                        <input value={registrationNumber} id="registrationNumber"  onChange={this.changeRegistrationNumber}></input>
                    </label>
                </div>
                <button type="submit">Enter vehicle</button>
            </form>
        
        </div>)
    }

    
}

export default EnterVehicle