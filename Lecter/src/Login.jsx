import { useGlobalContext } from "./context";
import { useNavigate } from "react-router-dom";

function Login() {

    const {serverAPI,setMailID} = useGlobalContext()
    const navigate = useNavigate();

    function handleSignUp(event) {
        event.preventDefault()
        
        const mailval=event.currentTarget.elements.mail.value
        const passval=event.currentTarget.elements.pass.value

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
    
      function handleSignIn(event) {
        event.preventDefault()
        const mailval=event.currentTarget.elements.mail.value
        const passval=event.currentTarget.elements.pass.value
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
        </>
        );
}

export default Login;