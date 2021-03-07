import React, { Component } from 'react'
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Input = ({ field, value, onChange, onBlur, error }) => {
    console.log("reg number: " +value + "   " + "error: " + error )
    return (
        <Form>
            <Form.Group as={ Row } controlId={ field }>
                <Form.Label column sm={ 2 }>
                { field }
                </Form.Label>
                <Col sm={ 10 }>
                <Form.Control  value={ value } onChange={ onChange } onBlur={ onBlur } isInvalid={ !!error }/>
                </Col>
                <div class="text-danger">
                    <small>{error}</small>
                </div>
            </Form.Group>
        </Form>
    )
}
export default Input