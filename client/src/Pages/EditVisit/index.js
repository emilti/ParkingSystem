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
    const [initialValues, setInitialValues] = useState({registrationNumber: location.state.registrationNumber, isInParking: location.state.isInParking, categorySelected: location.state.categoryId, discountSelected: location.state.discountId})
    const [isEditedMessageVisible, setIsEditedMessageVisible] = useState(false)
    useEffect(() => {
        buildCategoriesDropdown("Edit visit").then((value) => {setCategoriesOptions(value)})
        buildDiscountsDropdown("Edit visit").then((value) => {setDiscountsOptions( value)})
     }, []);

    const changeRegistrationNumber = (event) => {
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
        setIsInParkingSelected(event.target.value)
    }

    const handleSubmit = event => {
        EditVisitService(event, location.state.id, registrationNumber, isInParkingSelected, categorySelected, discountSelected)
        alertVisitEdited()
        setInitialValues({registrationNumber: registrationNumber, isInParking: isInParkingSelected, categorySelected: categorySelected, discountSelected: discountSelected})
    }

    const clearChanges = event => {
        setRegistrationNumber(initialValues.registrationNumber)
        setIsInParkingSelected(initialValues.isInParking)
        setCategorySelected(initialValues.categorySelected)
        setDiscountSelected(initialValues.discountSelected)
    }

    const backToVisitsPage = () => {
        history.push('/report')
    }

    const alertVisitEdited = () =>{
        setIsEditedMessageVisible(true)
        setTimeout(() => {
            setIsEditedMessageVisible(false)
        }, 3000);
    }

    return(
       
        <div>
            <Menu/>
            <Container>
              <Row>
                    <Col></Col>
                    <Col md={8}>
                        <Jumbotron className={Styles.jumbotronStyle}>
                            <form onSubmit={handleSubmit}>
                                <Input field={"Registration number:"} value={registrationNumber} onChange={e => changeRegistrationNumber(e)}/>
                                <SingleSelectDropdown field={"In parking:"} options={isInParkingOptions} selected={isInParkingSelected} onChange={changeIsInParking}/>
                                <SingleSelectDropdown field={"Category:"} options={categoriesOptions} selected={categorySelected} onChange={changeCategory}/>
                                <SingleSelectDropdown field={"Discount:"} options={discountsOptions} selected={discountSelected} onChange={changeDiscount}/>
                                {/* <DateTimePicker onChange={changeEnterDateRange} value={location.state.enterParkingDate}/> */}
                                <Row>
                                    <Col md={4}>
                                        <Button variant="success" type="submit">Edit visit</Button>
                                    </Col>
                                    <Col md={4}>
                                        <Button variant="warning" type="button" onClick={clearChanges}>Clear changes</Button>
                                    </Col>
                                    <Col md={4}>
                                        <Button variant="info" type="button" onClick={backToVisitsPage}>Back to Report page</Button>
                                    </Col>
                                </Row>
                                <div className={Styles.alertMessageContainer}>
                                    {isEditedMessageVisible?<Row><Col sm={{size: 8, order: 2, offset: 4}}><span className={Styles.allertMessage}>Visit information updated!</span></Col></Row>:<Row><Col>&nbsp;</Col></Row>}
                                </div>
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