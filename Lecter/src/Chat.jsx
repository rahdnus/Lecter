import './App.css'
import { useState,useEffect} from 'react';
import ChatLog from './Components/ChatLog';
import { useGlobalContext } from './context';

function Chat() {

  const {serverAPI,firstMessage,mailID} = useGlobalContext()

  
  const [msgCounter,setmsgCounter]=useState(0)
  const [userChatDisabled,setUserChatDisabled]=useState(false)
  const [messages,setMessages]=useState([])

  const [inputText,setInputText]=useState("");
  const [initial,setInitial]=useState(true)

  function handleSubmit(event) {
    event.preventDefault()
    //evaluate and store data
    setUserChatDisabled(true);
    setInputText(event.currentTarget.elements.UserInput.value)
    console.log(messages)

    fetch(`${serverAPI}/store`,{
      method: 'POST',
      headers:{
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': '69420'},
        body:JSON.stringify({mailid:mailID,input:event.currentTarget.elements.UserInput.value}),
    }).then(response => response.json()).then(jsondata => console.log(jsondata))
    

    fetch(`${serverAPI}/eval`,{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        "ngrok-skip-browser-warning": "69420"
      },
      body:JSON.stringify({mailid:mailID})
    }).then(response => response.json()).then(jsondata => console.log(jsondata))
    
    event.currentTarget.reset();

  }

  function handleResponse(response){
    setUserChatDisabled(false);
    setMessages([...messages,{id:0,text:response}])
  }
  useEffect(()=>{
    if(msgCounter%2==1)
    {
      console.log("messages+1")
      fetch(`${serverAPI}/generate`,{
        method: 'POST',
        headers:{
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': '69420'},
          body:JSON.stringify({mailid:mailID,input:inputText}),
      }).then(response => response.json()).then(jsondata => {
        console.log(jsondata)
        handleResponse(jsondata["text"])
        setInputText("");
        setmsgCounter((msgCounter+1));
      })
    }
    
  },[messages])
  useEffect(()=>{
    if(msgCounter%2==1)
    {
      console.log("msgcounter+1")
      setMessages([...messages,{id:1,text:inputText}])
    }
  },[msgCounter])
  useEffect(()=>{
    console.log(msgCounter)
    console.log(initial)

    if(inputText!="" && msgCounter%2==0 && initial==false)
    {
      setmsgCounter((msgCounter+1));
      console.log("inputtext")
    }
  },[inputText])
  useEffect(() => {
    setMessages([{id:0,text:firstMessage}])
    setInitial(false)
  },[]);

  return (
    <>
        <div className='page'>
          <ChatLog messages={messages}/>
          <form onSubmit={handleSubmit}>
            <div className='input'> 
             <input id="UserInput" placeholder='  Enter Message' 
             type="text" className="inputArea" disabled={userChatDisabled}/>
            </div>
          </form>
        </div>
    </>
  )
}

export default Chat
