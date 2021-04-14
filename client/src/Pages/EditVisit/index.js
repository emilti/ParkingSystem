import React, {useState, useEffect} from 'react'
import {useLocation, useHistory} from "react-router-dom"
import {Container, Row, Col, Jumbotron, Button} from 'react-bootstrap'
import Menu from '../../Components/Menu'
import Input from '../../Components/Input'
import SingleSelectDropdown from '../../Components/SingleSelectDropdown'
import {getIsInParkingEditOptions, buildCategoriesDropdown, buildDiscountsDropdown, getEditCategories} from '../../Utils/dropdowns'
import DateTimePicker from 'react-datetime-picker'
import Styles from './index.module.css'
import '../../main.9ccb599a.css'
import {EditVisitService} from '../../Services/VisitService'


const EditVisit = (props) => {
    const location = useLocation();
    const history = useHistory();
    const [isInParkingOptions, setInIsParkingOptions] = useState(getIsInParkingEditOptions)
    const [registrationNumber, setRegistrationNumber] = useState(location.state.registrationNumber)
    const [isInParkingSelected, setIsInParkingSelected] = useState(location.state.isInParking)
    const [categorySelected, setCategorySelected] = useState(location.state.categoryId)
    const [discountSelected, setDiscountSelected] = useState(location.state.discountId)
    const [categoriesOptions, setCategoriesOptions] = useState([])
    const [discountsOptions, setDiscountsOptions] = useState([])
    const [selectedEnterparkingDate, setSelectedEnterparkingDate] = useState(location.state.enterParkingDate)
    
    useEffect(() => {
        buildCategoriesDropdown("Edit visit").then((value) => {setCategoriesOptions(value)})
        buildDiscountsDropdown("Edit visit").then((value) => {setDiscountsOptions( value)})
     }, []);

    const changeRegistrationNumber = (event) => {
        console.log(event.target.value)
        setRegistrationNumber(event.target.value)
    }
   

    const changeCategory = (event) => {
        setCategorySelected(event.target.value)
    }

    const changeDiscount = (event) => {
        setDiscountSelected(event.target.value)
    }

    const changeEnterDateRange = (date) =>{
        setSelectedEnterparkingDate(date)
    }

    const changeIsInParking = (event) =>{
        console.log(event.target.value)
        setIsInParkingSelected(event.target.value)
    }

    const handleSubmit = event => {
        var result = EditVisitService(event, location.state.id, registrationNumber, isInParkingSelected, categorySelected, discountSelected)
        if(result){
            history.push('/report')
        }
    }

    return(
       
        <div>
            <Menu/>
            <Container>
              <Row>
                    <Col></Col>
                    <Col md={ 8 }>
                        <Jumbotron className={Styles.jumbotronStyle}>
                            <form onSubmit={handleSubmit}>
                                <Input field={"Registration number:"} value={registrationNumber} onChange={e => changeRegistrationNumber(e)}/>
                                <SingleSelectDropdown field={"In parking:"} options={isInParkingOptions} selected={location.state.isInParking} onChange={changeIsInParking}/>
                                <SingleSelectDropdown field={"Category:"} options={categoriesOptions} selected={location.state.categoryId} onChange={changeCategory}/>
                                <SingleSelectDropdown field={"Discount:"} options={discountsOptions} selected={location.state.discountId} onChange={changeDiscount}/>
                                {/* <DateTimePicker onChange={changeEnterDateRange} value={location.state.enterParkingDate}/> */}
                                <Button variant="success" type="submit">Edit visit</Button>
                            </form>
                        </Jumbotron>
                    </Col>
                    <Col></Col>
                </Row>
            </Container>
        </div>
    )
} 

export default EditVisit