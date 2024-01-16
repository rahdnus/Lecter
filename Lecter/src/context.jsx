

import React, { useState, useContext } from 'react'

const AppContext = React.createContext()

// eslint-disable-next-line react/prop-types
const AppProvider = ({ children }) => {
  
  const [mailID, setMailID] = useState("");

  const koboldAPI="https://luxury-expense-medal-regular.trycloudflare.com"
  const serverAPI= "http://df0e-34-122-82-75.ngrok-free.app/"
  return <AppContext.Provider value={{ serverAPI,koboldAPI,mailID, setMailID }}>
    {children}</AppContext.Provider>
}
// eslint-disable-next-line react-refresh/only-export-components
export const useGlobalContext = () => {
  return useContext(AppContext)
}

export { AppContext, AppProvider }



