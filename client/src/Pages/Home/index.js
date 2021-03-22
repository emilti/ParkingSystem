import React, {useEffect, useState} from "react"
import Menu from '../../Components/Menu'
import {HubConnection, HubConnectionBuilder} from "@microsoft/signalr"
import {Card, Row, Col, Container} from "react-bootstrap"
import useParkingData from '../../Hooks/useParkingData'
import Styles from './index.module.css'

const Home = () => {
  const [connection, setConnection] = useState("");
  const {availableSpaces, setAvailableSpaces, totalParkingSpaces, categories, discounts} = useParkingData()
  const className = null;
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
          <Row width="100%">
            <Col md={{span: 3, offset: 2}}>
              <Card className={["text-center", Styles.font ].join(" ")}>
              <div className={["card-header", Styles.fontTitle].join(" ")}>
                Total parking spaces:
              </div>
              <div className={["card-body", Styles.fontTotalSpaceValue].join(" ")}>{totalParkingSpaces}</div>
              </Card>
            </Col> 
            <Col md={1}></Col>
            <Col md={3}>
              <Card className={[Styles.fontFreeSpacesText, "text-center"].join(" ")}>
                <div className="card-header">
                  Free parking spaces:
                </div>
                <div className="card-body">
                  <span className={Styles.fontFreeSpacesValue}>{availableSpaces}</span>
                </div>
              </Card>
            </Col>
            </Row>
            <Row className={Styles.rowMargin}>
              <Col md={{span: 3, offset: 2}}>
                <Card className="text-center">
                  <div className={["card-header", Styles.fontTitle].join(" ")}>Categories:</div>
                  <div className="card-body">
                    {
                    categories != null ? categories.map((c) =>
                      (<div>{c.name}  &nbsp;&nbsp; Parking spaces: {c.parkingSpaces}</div>)) : ""
                    }
                  </div>
                </Card>
              </Col>
              <Col md={1}></Col>
              <Col md={3}>
                <Card className={[Styles.font, "text-center"].join(" ")}>
                  <div className={["card-header", Styles.fontTitle].join(" ")}>
                    Discounts:
                  </div>
                  <div className="card-body">
                    { 
                    discounts != null ? discounts.map((d) =>
                      
                      (<div>{d.name}  &nbsp;&nbsp; {d.discountPercentage}%</div>)) : ""
                    }
                  </div>
                  
                </Card>
              </Col>
          </Row>
        </Container>
      </div>
      
  )
}

export default Home