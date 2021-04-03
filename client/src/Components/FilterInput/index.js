import React, {Component} from 'react'
import {Form, Row, Col, Alert} from 'react-bootstrap'
import Styles from './index.module.css'

const Input = ({field, type, value, onChange, onBlur, error}) => {
    return (
            <Col sm={2} className={Styles.align}>
                <Form.Label  className={Styles.align}>
                    {field}
                </Form.Label>
                <Form.Control type={type} value={value} onChange={onChange} onBlur={onBlur} isInvalid={!!error}/>
                <Form.Control.Feedback type='invalid' className={Styles.errorMessage}>
                {error}
                </Form.Control.Feedback>
            </Col>
    )
}
export default Input