import React from "react"
import {Card, Col, ListGroup} from "react-bootstrap"
import Moment from 'moment'
import Styles from './index.module.css'

const ParkingVisitCard = ({indexKey, registrationNumber, dueAmount, enterParkingDate, exitParkingDate, isInParking, categoryName, parkingSpaces, discountPercentage}) =>{
return (
    <Col md={{span: 4, offset: 1}} key={indexKey}>
        <Card className={Styles.rowMargin}>
            <Card.Header>Registration number: {registrationNumber}</Card.Header>
                <ListGroup variant="flush">
                    <ListGroup.Item>Due amount: {dueAmount}</ListGroup.Item>
                    <ListGroup.Item>Entered parking: {Moment(String(enterParkingDate)).format('MM/DD/YYYY HH:mm:ss')}</ListGroup.Item>
                    <ListGroup.Item>Exit parking: {exitParkingDate ? Moment(String(exitParkingDate)).format('MM/DD/YYYY HH:mm:ss') : "-"}</ListGroup.Item>
                    <ListGroup.Item>In Parking: {isInParking ? "Yes" : "No"}</ListGroup.Item>
                    <ListGroup.Item>Category: {categoryName}({parkingSpaces})</ListGroup.Item>
                    <ListGroup.Item>Discount: {discountPercentage != null ? discountPercentage + "%" : "-" }</ListGroup.Item>
            </ListGroup>
        </Card>
    </Col>
    )
}

export default ParkingVisitCard