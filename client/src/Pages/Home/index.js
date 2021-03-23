import React, {useEffect, useState} from "react"
import Menu from '../../Components/Menu'
import {HubConnection, HubConnectionBuilder} from "@microsoft/signalr"
import {Card, Row, Col, Container} from "react-bootstrap"
import useParkingData from '../../Hooks/useParkingData'
import Styles from './index.module.css'
import StatisticsCard from '../../Components/StatisticsCard'

const Home = () => {
  const [connection, setConnection] = useState("");
  const {availableSpaces, setAvailableSpaces, totalParkingSpaces, categories, discounts} = useParkingData()
  const categoriesBody = categories != null ? categories.map((c) => (<div>{c.name}  &nbsp;&nbsp; Parking spaces: {c.parkingSpaces}</div>)) : ""
  const discountsBody =  discounts != null ? discounts.map((d) => (<div>{d.name}  &nbsp;&nbsp; {d.discountPercentage}%</div>)) : ""
  
  useEffect(() => {
    setAvailableSpaces(availableSpaces)
    const connect = new HubConnectionBuilder()
      .withUrl("http://localhost:57740/hub/Dashboard")
      .withAutomaticReconnect()
      .build();
    setConnection(connect);
  }, []);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          connection.on("RefreshStatistics", (message) => {
            setAvailableSpaces(message["freeParkingSpaces"])
            console.log(message)
          });
        })
        .catch((error) => console.log(error));
    }
  }, [connection]);
  
  return (
      <div>
        <Menu/>
        <Container className={Styles.containerStyle}>
          <Row>
            <Col md={{span: 3, offset: 2}}>
              <StatisticsCard title="Total parking spaces:" value={totalParkingSpaces} bodyStyles="fontTotalSpaceValue"/>
            </Col>
            <Col md={1}></Col>
            <Col md={3}>
              <StatisticsCard title="Free parking spaces:" value={availableSpaces} bodyStyles="fontFreeSpacesValue"/>
            </Col>
          </Row>
          <Row className={Styles.rowMargin}>
            <Col md={{span: 3, offset: 2}}>
              <StatisticsCard title="Categories:" value={categoriesBody} />
            </Col>
            <Col md={1}></Col>
            <Col md={{span: 3}}>
              <StatisticsCard title="Discounts:" value={discountsBody} />
            </Col>
          </Row>
        </Container>
      </div>
      
  )
}

export default Home