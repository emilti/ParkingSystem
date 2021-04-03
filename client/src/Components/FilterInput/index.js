import React, {Component} from 'react'
import {Form, Row, Col, Alert} from 'react-bootstrap'
import Styles from './index.module.css'

const FilterInput = ({field, type, value, onChange, onBlur, error}) => {
    return (
            <div>
                <Form.Label  className={Styles.align}>
                    {field}
                </Form.Label>
                <Form.Control type={type} value={value} onChange={onChange} onBlur={onBlur} isInvalid={!!error}/>
                <Form.Control.Feedback type='invalid' className={Styles.errorMessage}>
                {error}
                </Form.Control.Feedback>
            </div>
    )
}
export default FilterInput