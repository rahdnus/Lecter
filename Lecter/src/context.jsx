

import React, { useState, useContext } from 'react'

const AppContext = React.createContext()

// eslint-disable-next-line react/prop-types
const AppProvider = ({ children }) => {
  
  const [mailID, setMailID] = useState("");
  const [firstMessage,setFirstMessage]=useState("");
  const serverAPI= "http://127.0.0.1:5000"
  return <AppContext.Provider value={{ serverAPI,firstMessage,setFirstMessage, mailID,setMailID }}>
    {children}</AppContext.Provider>
}
// eslint-disable-next-line react-refresh/only-export-components
export const useGlobalContext = () => {
  return useContext(AppContext)
}

export { AppContext, AppProvider }



