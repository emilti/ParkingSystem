import React, {Component} from 'react'
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const SingleSelectDropdown = ({field, options, onChange }) => {
    return (
        <Form.Group as={Row} controlId={field}>
            <Form.Label  column sm={2}>{field}</Form.Label>
            <Col sm={10}>
                <Form.Control as="select" onChange={onChange}>
                    {options.map(option =>
                        <option key={option.value} value={option.value}>{option.label}</option>)}
                </Form.Control>
            </Col>
        </Form.Group>
    )
}
export default SingleSelectDropdown