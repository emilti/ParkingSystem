import React, { useContext } from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import {UserContext} from '../../Hooks/UserContext.js'
import EnterVehiclePage from '../../Pages/EnterVehicle'
import LoginPage from '../../Pages/Login'
import RegisterPage from '../../Pages/Register'
import HomePage from '../../Pages/Home'
import ReportPage from '../../Pages/Report'
import ProfilePage from '../../Pages/Profile'

const Navigation = () =>{
    const { user, setUser, isLoading } = useContext(UserContext);
    const isAdmin = user && user.role === "Administrator"
    return (
      
        <Switch>
            <Route path="/" exact component={HomePage}/>
            <Route path="/EnterVehicle">
                {user ? (<EnterVehiclePage />): (<Redirect to="/login" />)}
            </Route>
            <Route path="/Login">
                {user ? (<Redirect to="/" />): (<LoginPage />)}
            </Route>
            <Route path="/Register"> 
                {user ? (<Redirect to="/" />): (<RegisterPage />)}
            </Route>
            <Route path="/Report"> 
                {user && isAdmin ? (<ReportPage />) : (<Redirect to="/" />) }
            </Route>
            <Route path="/Profile"> 
                {user ? (<ProfilePage />) : (<Redirect to="/" />) }
            </Route>
        </Switch>
        )
}

export default Navigation