

import Message from "./Message"
/* eslint-disable react/prop-types */
function ChatLog({messages})
{
    return(
        <>
        <div className="chatLog">
            {
                messages?.map((message,i) => {
                return <Message key ={i} id={message.id} 
                text={message.text} />
                })
            }
        </div>

        </>
    )
}

export default ChatLog