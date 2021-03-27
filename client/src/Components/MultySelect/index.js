import React, {Component} from 'react'
import {Form, Col } from 'react-bootstrap'

const MultySelect = ({field, collection, onChangeMultyselect, selectedCategories}) => {
    return (

        <Col sm={2} className="my-1"> 
            <Form.Label>{field}</Form.Label>
            <Form.Control as="select" multiple value={selectedCategories} onChange={e => onChangeMultyselect(e)}>
            {collection.map((el, i) => {
                    return <option key={i} value={el.value}>{el.label}</option>
                })}
            </Form.Control>
        </Col>   
    )
}
export default MultySelect