import { useRef } from "react";
import { useGlobalContext } from "./context";
import { useNavigate } from "react-router-dom";


function Login() {

    const {serverAPI,setMailID} = useGlobalContext()
    const navigate = useNavigate();
    const mailRef=useRef()
    const passRef=useRef()

    function handleSignUp() {
        // event.preventDefault()
        
        // const mailval=event.currentTarget.elements.mail.value
        // const passval=event.currentTarget.elements.pass.value
        const mailval=mailRef.current.value;
        const passval=passRef.current.value;
        console.log(mailRef.current.value)
        console.log(passRef.current.value)
        let data={
          mail:mailval,
          password:passval,
        }

        fetch(`${serverAPI}/signUp`,{
          method: 'POST',
          headers:{
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': '69420'},
            body:JSON.stringify(data),
        }).then(response => response.json()).then(jsondata => {
            if(jsondata.result===1){
                setMailID(mailval);
                navigate("/chat");

            }
            else
            {
                console.log("ERROR SIGNING UP:"+jsondata.result)
            }

        })
      }
    
      
      function handleSignIn() {
        // event.preventDefault()
        // const mailval=event.currentTarget.elements.mail.value
        // const passval=event.currentTarget.elements.pass.value
        console.log(mailRef.current.value)
        console.log(passRef.current.value)

        const mailval=mailRef.current.value;
        const passval=passRef.current.value;

        let data={
          mail:mailval,
          password:passval,
        }
        fetch(`${serverAPI}/signIn`,{
          method: 'POST',
          headers:{
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': '69420'},
            body:JSON.stringify(data),
        }).then(response => response.json()).then(jsondata => 
            {
                if(jsondata.result===1){
                    setMailID(mailval);
                    navigate("/chat");
                }
                else
                {
                    console.log("ERROR LOGING IN:"+jsondata.result)
                }
    
            })
      }

    return (
        <>
        <div className="accessBox">

        <form onSubmit={(event)=>{event.preventDefault()}} className="formBox">
          <div>
          <p className="accessInputLabel">Email</p>
          <input ref={mailRef} id="mail" placeholder='Enter Email' 
          type="text" className="accessInputArea"/>
          </div>

          <div> 
          <p className="accessInputLabel">Password</p>
          <input ref={passRef} id="pass" placeholder='Enter Password' 
          type="text" className="accessInputArea"/>
          </div>

          {/* <input type="submit" value="SignIn" className="accessButton"></input> */}
        </form>
        <div className="buttonBox">
        <button className="accessButton" onClick={handleSignIn}>Login</button>
        <button className="accessButton" onClick={handleSignUp}>Sign up</button>
        </div>


        {/* <form onSubmit={handleSignIn} className="formBox">
          <input id="mail" placeholder='mail ID' 
          type="text" className="inputArea"/>
          <input id="pass" placeholder='password' 
          type="text" className="inputArea"/>
          <input type="submit" value="LogIn" className="accessButton"></input>
        </form> */}

        </div>
        </>
        );
}

export default Login;