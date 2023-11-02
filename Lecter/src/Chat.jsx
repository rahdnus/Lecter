import './App.css'
import { useState,useEffect} from 'react';
import ChatLog from './Components/ChatLog';
import { useGlobalContext } from './context';
import Prompts from './prompts'

function Chat() {

  const {serverAPI,koboldAPI,mailID} = useGlobalContext()


  // TODO
  let responseText=""

  //TODO 
  //check for returning user and get appropriate prompt from the login page 
  //create a state in context that will be updated with the user's current eval when they login. 
  let promptString=Prompts.generic+"\n\nThen the roleplay chat between You and Lecter begins.\nDr. Lecter:";
  let chatstack=""

  const firstmessage="Hello there.";
  const trimStrings=["You:","you:","User:"]

  const evalThreshold=30;
  
  const [msgCounter,setmsgCounter]=useState(0)
  const [userChatDisabled,setUserChatDisabled]=useState(false)
  const [messages,setMessages]=useState([])
  const [inputText,setInputText]=useState(firstmessage)


  // let inputText;
  const [initial,setInitial]=useState(true)
  const [initial2,setInitial2]=useState(true)
  
  function handleSubmit(event) {
    event.preventDefault()
    //evaluate and store data

    fetch(`${serverAPI}/store`,{
      method: 'POST',
      headers:{
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': '69420'},
        body:JSON.stringify({mailid:mailID,input:event.currentTarget.elements.UserInput.value}),
    }).then(response => response.json()).then(jsondata => console.log(jsondata))
    
    
    if(msgCounter+1==evalThreshold)
    {
      fetch(`${serverAPI}/eval`,{
        method:'GET',
        headers:{
          'Content-Type':'application/json',
          "ngrok-skip-browser-warning": "69420"
        },
        body:JSON.stringify({mailid:mailID})
      }).then(response => response.json()).then(jsondata => {
        
        let res=jsondata.result
        //TODO
        promptString=Prompts.generic+Prompts[res]+"\n\nThen the roleplay chat between You and Lecter begins.\nDr. Lecter:";
      })
    }
    setmsgCounter((msgCounter+1)%evalThreshold);
    setInputText(event.currentTarget.elements.UserInput.value)
    event.currentTarget.reset();

  }

  function handleResponse(response){
      console.log(response)
      let trimindex=Infinity;
      trimStrings.forEach((s)=>
      {
        let t=response.indexOf(s)
        if(t!=-1 && t<trimindex) trimindex=t;
      });
      if(trimindex!=Infinity)
        {
          response=response.slice(0,trimindex)      
          chatstack+=response
          responseText+=response;
          setUserChatDisabled(false);
          setMessages([...messages,{id:0,text:responseText}])
          responseText=""
        }
      else
        {
          responseText+=response
          // setAIChatText(responseText)
          generateResponse(response)
        }
        console.log(chatstack);
  }
  
  function generateResponse(input){
    console.log(messages)
    chatstack+=input
    const data={
        "prompt": promptString+chatstack,
        "use_story": false,
        "use_memory": false,
        "use_authors_note": false,
        "use_world_info": false,
        "max_context_length": 2048,
        "max_length": 50,
        "rep_pen": 1.17,
        "rep_pen_range": 1024,
        "rep_pen_slope": 0.2,
        "temperature": 0.43,
        "tfs": 0.68,
        "top_a": 0,
        "top_k": 0,
        "top_p": 0.96,
        "typical": 1,
        "sampler_order": [ 6, 0, 1, 2, 3, 4, 5 ]
      }
    setUserChatDisabled(true);
    fetch(`${koboldAPI}/api/v1/generate` ,
    {
      method: 'POST',
      headers:{
        'accept': 'application/json' ,
        'Content-Type': 'application/json'
      },
      body:JSON.stringify(data)
    }).then(response => response.json())
    .then(data => handleResponse(data.results[0].text))
    .catch(error => console.error(error));
  }

  // useEffect(() => {
  //   setMessages([{id:0,text:firstmessage}])
  // },[]);
  useEffect(()=>{
    if(initial2)
    {
      setInitial2(false)
      setMessages([{id:0,text:inputText}])
      
    }
   
    else
      setMessages([...messages,{id:1,text:inputText}])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[inputText])

  useEffect(()=>{
    if(messages.length!=0 && messages[messages.length-1].id===1)
    if(initial)
    {
      console.log(inputText)
      setInitial(false)
      generateResponse(firstmessage+"You:"+inputText+".\nDr.Evelyn Carter:")
    }
    else
    {
      generateResponse("You:"+inputText+".\nDr.Evelyn Carter:")
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[messages])
  // useEffect(()=>{
  // //  console.log(aiChatText);
  // },[aiChatText])

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
