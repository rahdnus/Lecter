

/* eslint-disable react/prop-types */
function Message({id,text})
{
    return(
        <>
        <div className={"msg_"+(id==0?"left":"right")+" msg"}>
            {
                id==1? 
                    <div className="msg-id msg-id_right">
                        <b>You</b>
                        <img src="user.jpg"/>
                    </div>
                    :
                    <div className="msg-id">
                        <img src="lecter.jpg"/>
                        <b>Bot</b>
                    </div>
            }
            <div className="msg-bubble">
                  {text}
            </div>
        </div>
           
        </>
    )
}

export default Message