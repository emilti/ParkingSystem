import React, {Component} from 'react'
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const FilterSingleSelectDropdown = ({field, options, onChange, selected}) => {
    return (
        <div>
            <Form.Label>{field}</Form.Label>
            <Form.Control as="select" onChange={onChange}>
                {options.map(option =>
                    <option key={option.value} selected={option.value == selected} value={option.value}>{option.label}</option>)}
            </Form.Control> 
        </div>
            
    )
}
export default FilterSingleSelectDropdown