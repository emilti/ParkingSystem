import React, { Component } from 'react'
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Input = ({ field, type, value, onChange, onBlur, error }) => {
    return (
        <Form.Group as={ Row } controlId={ field }>
                <Form.Label column sm={ 2 }>
                { field }
                </Form.Label>
                <Col sm={ 10 }>
                <Form.Control type={type} value={ value } onChange={ onChange } onBlur={ onBlur } isInvalid={ !!error }/>
                </Col>
                <div class="text-danger">
                    <small>{error}</small>
                </div>
            </Form.Group>
    )
}
export default Input