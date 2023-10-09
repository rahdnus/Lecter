import './App.css'
import { useState,useEffect} from 'react';
import ChatLog from './Components/ChatLog';

function App() {


  const serverAPI= "http://92b0-34-30-104-64.ngrok-free.app"
  const llmAPI=""

  
  let responseText=""
  let promptString="Dr. Evelyn Carter is a compassionate and experienced therapist specializing in depression and anxiety. With a warm smile and calm demeanor, she creates a safe space for her patients to open up. Dr. Carter's empathetic nature and exceptional emotional intelligence allow her to connect deeply with individuals, addressing their concerns with sensitivity. She tailors treatment plans using evidence-based approaches, empowering patients with practical coping skills. Known for her transformative impact, Dr. Carter is a lifeline during dark moments, instilling hope and guiding individuals towards personal growth. Outside of work, she values self-care, enjoys yoga, nature, and advocates for mental health destigmatization in her community.\n\nThen the roleplay chat between You and Dr. Evelyn Carter begins.\nDr. Evelyn Carter:";
  const firstmessage="Hello there.";
  const API="https://beverage-strikes-fix-portugal.trycloudflare.com"
  const trimStrings=["You:","you:","User:"]

  const evalThreshold=30;
  const [msgCounter,setmsgCounter]=useState(0)
  const [userChatDisabled,setUserChatDisabled]=useState(false)
  const [messages,setMessages]=useState([])
  const [inputText,setInputText]=useState(firstmessage)
  // let inputText;
  const [initial,setInitial]=useState(true)
  const [initial2,setInitial2]=useState(true)
  function handleSignUp(event) {
    event.preventDefault()

    let data={mail:event.currentTarget.elements.mail.value,
      password:event.currentTarget.elements.pass.value,
    }
    fetch(`${serverAPI}/signUp`,{
      method: 'POST',
      headers:{
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': '69420'},
        body:JSON.stringify(data),
    }).then(response => response.json()).then(jsondata => console.log(jsondata))
  }

  function handleSignIn(event) {
    event.preventDefault()

    let data={mail:event.currentTarget.elements.mail.value,
      password:event.currentTarget.elements.pass.value,
    }
    fetch(`${serverAPI}/signIn`,{
      method: 'POST',
      headers:{
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': '69420'},
        body:JSON.stringify(data),
    }).then(response => response.json()).then(jsondata => console.log(jsondata))
  }
  function handleSubmit(event) {
    event.preventDefault()
    //evaluate and store data

    fetch(`${serverAPI}/store`,{
      method: 'POST',
      headers:{
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': '69420'},
        body:JSON.stringify({input:event.currentTarget.elements.UserInput.value}),
    }).then(response => response.json()).then(jsondata => console.log(jsondata))
    
    
    if(msgCounter+1==evalThreshold)
    {
      let responseState=""
      fetch(`${serverAPI}/eval`,{
        method:'GET',
        headers:{
          'Content-Type':'application/json',
          "ngrok-skip-browser-warning": "69420"
       
        }
      }).then(response => response.json()).then(jsondata => responseState=jsondata.result)


    }
    setmsgCounter((msgCounter+1)%evalThreshold);
    // setInputText(event.currentTarget.elements.UserInput.value)

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
          promptString+=response
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
        console.log(promptString);
  }

  function generateResponse(input){
    console.log(messages)
    promptString+=input
    const data={
        "prompt": promptString,
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
    fetch(`${API}/api/v1/generate` ,
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
      setMessages([{id:0,text:inputText},
                   {id:1,text:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore, itaque amet eos eum error magnam dicta ut quam reprehenderit sint laudantium vero accusantium, eius, officiis aliquam nostrum assumenda. Harum, alias."},
                   {id:0,text:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore, itaque amet eos eum error magnam dicta ut quam reprehenderit sint laudantium vero accusantium, eius, officiis aliquam nostrum assumenda. Harum, alias."}
                   ,{id:0,text:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore, itaque amet eos eum error magnam dicta ut quam reprehenderit sint laudantium vero accusantium, eius, officiis aliquam nostrum assumenda. Harum, alias."}
                   ,{id:0,text:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore, itaque amet eos eum error magnam dicta ut quam reprehenderit sint laudantium vero accusantium, eius, officiis aliquam nostrum assumenda. Harum, alias."}
                   ,{id:0,text:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore, itaque amet eos eum error magnam dicta ut quam reprehenderit sint laudantium vero accusantium, eius, officiis aliquam nostrum assumenda. Harum, alias."}
                   ,{id:0,text:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore, itaque amet eos eum error magnam dicta ut quam reprehenderit sint laudantium vero accusantium, eius, officiis aliquam nostrum assumenda. Harum, alias."}
                   ,{id:0,text:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore, itaque amet eos eum error magnam dicta ut quam reprehenderit sint laudantium vero accusantium, eius, officiis aliquam nostrum assumenda. Harum, alias."}
                 
                  ])
      
    }
   
    else
      setMessages([...messages,{id:1,text:inputText}])
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
  },[messages])
  // useEffect(()=>{
  // //  console.log(aiChatText);
  // },[aiChatText])

  return (
    <>
        <form onSubmit={handleSignUp}>
          <input id="mail" placeholder='mail ID' type="text" className="inputArea"/>
          <input id="pass" placeholder='password' type="text" className="inputArea"/>
          <input type="submit" value="Submit"></input>

        </form>
        <form onSubmit={handleSignIn}>
          <input id="mail" placeholder='mail ID' type="text" className="inputArea"/>
          <input id="pass" placeholder='password' type="text" className="inputArea"/>
          <input type="submit" value="Submit"></input>

        </form>
        <div className='page'>
          <ChatLog messages={messages}/>
          <form onSubmit={handleSubmit}>
            <div className='input'> 
             <input id="UserInput" placeholder='  Enter Message' type="text" className="inputArea" disabled={userChatDisabled}/>
            </div>
          </form>
        </div>

    </>
  )
}

export default App
