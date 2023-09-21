import './App.css'
import { useState,useEffect } from 'react';

function App() {
  let responseText=""
  const [aiChatText,setAIChatText]=useState("")
  const [userChatDisabled,setUserChatDisabled]=useState(false)
  
  const API="https://volkswagen-portuguese-kept-promote.trycloudflare.com"
  const trimStrings=["You:","you:","User:"]
  let promptString="Dr. Evelyn Carter is a compassionate and experienced therapist specializing in depression and anxiety. With a warm smile and calm demeanor, she creates a safe space for her patients to open up. Dr. Carter's empathetic nature and exceptional emotional intelligence allow her to connect deeply with individuals, addressing their concerns with sensitivity. She tailors treatment plans using evidence-based approaches, empowering patients with practical coping skills. Known for her transformative impact, Dr. Carter is a lifeline during dark moments, instilling hope and guiding individuals towards personal growth. Outside of work, she values self-care, enjoys yoga, nature, and advocates for mental health destigmatization in her community.\n\nThen the roleplay chat between You and Dr. Evelyn Carter begins.\nDr. Evelyn Carter:";
  const firstmessage="Hello there";
  function handleSubmit(event) {
    event.preventDefault()
    // setAIChatText(""); 
    generateResponse("You:"+event.currentTarget.elements.UserInput.value+".\nDr.Evelyn Carter:")
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
          setUserChatDisabled(false);
          setAIChatText(responseText+response);
          responseText=""
        }
      else
        {
          responseText+=response
          setAIChatText(responseText)
          generateResponse(response)
        }
        console.log(promptString);
  }
  function generateResponse(input){
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
    fetch(`${API}/api/v1/generate`,{
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

  useEffect(() => {
    generateResponse(firstmessage)
  },[]);

  useEffect(()=>{
   console.log(aiChatText);
  },[aiChatText])

  return (
    <>

        <form onSubmit={handleSubmit}>
        <div>
           <label htmlFor="UserInput">User:</label>
           <input id="UserInput" type="text" disabled={userChatDisabled}/>
        </div>
        </form>
        <div>
          <p>{aiChatText}</p>
        </div>
    </>
  )
}

export default App
