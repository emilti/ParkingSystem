import React, {Component} from 'react'
import {Form, Row, Col, Alert} from 'react-bootstrap'
import Styles from './index.module.css'

const Input = ({field, type, value, onChange, onBlur, error}) => {
    return (
        
        <Form.Group as={Row} controlId={field}>
                <Form.Label column sm={2}>
                {field}
                </Form.Label>
                <Col sm={10}>
                    <Form.Control type={type} value={value} onChange={onChange} onBlur={onBlur} isInvalid={!!error}/>
                </Col>
               <Form.Control.Feedback type='invalid' className={Styles.errorMessage}>
                    {error}
                </Form.Control.Feedback>
            </Form.Group>
           
           
    )
}
export default Input