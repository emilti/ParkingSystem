import React, {useEffect, useState} from "react"
import Menu from '../../Components/Menu'
import {HubConnection, HubConnectionBuilder} from "@microsoft/signalr"
import {Jumbotron} from "react-bootstrap"
import useParkingData from '../../Hooks/useParkingData'

const Home = () => {
  const [connection, setConnection] = useState("");
  const {availableSpaces, setAvailableSpaces} = useParkingData()
  //const [inputText, setInputText] = useState(availableSpaces);

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
        Home
        <Jumbotron>
        <div>Free parking spaces: {availableSpaces}</div>
        </Jumbotron>
      </div>
      
  )
}

export default Home