
import React, {Component} from 'react'
import {Pagination, Container, Row, Col} from 'react-bootstrap'
import Styles from './index.module.css'
const CustomPagination = ({pages, active, handleSubmit}) => {
    const pageItems = []
    
    const buildPageMenu = () =>{
        for (let page = 1; page <= pages; page++) {
            pageItems.push(
            <Pagination.Item key={page} active={page === active} onClick={(e) => handleSubmit(e, page)}>
                {page}
            </Pagination.Item>)
        }

        return pageItems
    }
    
    return(
        <Container>
            <Row className='mt-5 pt-5 my-auto'>
                <Col className="d-flex ">
                <Pagination size="sm" className={Styles.center}>
                        {
                            buildPageMenu()
                        }
                </Pagination>
                </Col>
            </Row>
        </Container>
        )
}
export default CustomPagination