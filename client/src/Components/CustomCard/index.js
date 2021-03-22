import React, {useEffect, useState} from "react"
import {Card, Row, Col, Container} from "react-bootstrap"
import useParkingData from '../../Hooks/useParkingData'
import "./styles.css"

const CustomCard = ({title, value, bodyStyles}) =>{
    const {availableSpaces, totalParkingSpaces, categories, discounts} = useParkingData()
    
return (
    <Card className={["text-center"].join(" ")}>
        <div className="card-header fontTitle">
            {title}
        </div>
        <div className={["card-body", bodyStyles].join(" ")}>{value}</div>
    </Card>
    )
}

export default CustomCard