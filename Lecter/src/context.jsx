

import React, { useState, useContext } from 'react'

const AppContext = React.createContext()

// eslint-disable-next-line react/prop-types
const AppProvider = ({ children }) => {
  
  const [mailID, setMailID] = useState("");

  const koboldAPI="https://bingo-bound-seeks-preserve.trycloudflare.com"
  const serverAPI= "http://1c3e-34-30-104-64.ngrok-free.app"
  return <AppContext.Provider value={{ serverAPI,koboldAPI,mailID, setMailID }}>
    {children}</AppContext.Provider>
}
// eslint-disable-next-line react-refresh/only-export-components
export const useGlobalContext = () => {
  return useContext(AppContext)
}

export { AppContext, AppProvider }



