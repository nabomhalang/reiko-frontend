import ChatList from "./ChatList";
import Interact from "./Interact";

function Chat() {
    return (
        <main className="h-screen w-screen flex">
            <div className="h-full w-1/6 flex-none"><ChatList /></div>

            <div className="h-full w-5/6 flex-initial"><Interact /></div>
        </main>
    )
}

export default Chat;