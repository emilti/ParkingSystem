import React, { useState, useEffect } from 'react'
import { UserContext } from './Hooks/UserContext.js'
import useFindUser from './Hooks/UseFindUser'
import getCookie from './Utils/cookie'
import { BrowserRouter } from 'react-router-dom'
import Navigation from './Components/Navigation'
const App = (props) => {
    const { user, setUser, isLoading } = useFindUser();
    return (
        <UserContext.Provider value={{
            user, setUser, isLoading
          }}>
            <BrowserRouter>
            <Navigation />
        </BrowserRouter>
    </UserContext.Provider>
  )  
}

export default App;
