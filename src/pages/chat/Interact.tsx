import { useState, useEffect, useRef, ChangeEvent } from 'react';
import { useRouter } from 'next/router';
import useAxiosAuth from '@/lib/hooks/useAxiosAuth';
import { accessTokenState, useSsrComplectedState } from '@/lib/recoil';
import { useRecoilState } from 'recoil';
import { Socket, io } from 'socket.io-client';
import Loading from '@/components/Loading';
import styled from '../../styles/scroll.module.css';
import { messages } from '../chats/interface/users.interface';

function Interact() {
    const router = useRouter();
    const setSsrCompleted = useSsrComplectedState();
    const authaxios = useAxiosAuth();

    const { id } = router.query;
    const [roomInfo, setRoomInfo] = useState(null);
    
    const [socket, setSocket] = useState<Socket | null>(null);
    const [accessToken, setAccessToken] = useRecoilState(accessTokenState);
    const [chat, setChat] = useState<messages[]>([]);

    const [textareaValue, setTextareaValue] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(setSsrCompleted, [setSsrCompleted]);
    useEffect(() => {
      if (accessToken !== null && id !== undefined) {
        const newSocket = io("https://api.nabomhalang.com/chat", {
          withCredentials: true,
          extraHeaders: {
            Authorization: `Bearer ${accessToken}`,
            "roomId": `${id}`
          }
        });
        setSocket(newSocket);
  
        const fetchRoomInfo = async () => {
          try {
            const response = await authaxios.post('/users/openroom', {
              roomid: id
            });
            console.log(response.data);
            setChat(response.data.messages);
            setRoomInfo(response.data);
          } catch (error) {
            console.log(error);
          }
        }
  
        fetchRoomInfo();
  
        return () => {
          newSocket.disconnect();
        };
      }
  
    }, [accessToken, id]);

    const handleSubmitNewMessage = () => {
        socket?.emit('message', { data: textareaValue });
        setTextareaValue('');
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSubmitNewMessage();
        }
    };
    
    if ((!roomInfo && !accessToken)) {
        return <Loading />;
    }

    const handleTextareaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const value = event.target.value;
        setTextareaValue(value);
        autoScroll();
    };

    const autoScroll = () => {
        if (containerRef.current && textareaRef.current) {
            containerRef.current.scrollTop = textareaRef.current.scrollHeight;
        }
    };

    return (
        <main className="w-full h-full flex flex-col bg-[#50586C]">
            <div className={`w-full h-[87%] flex flex-col-reverse overflow-y-auto px-[10%] pb-[1%] text-white ${styled.scroll} shrink`}>
                {chat ? chat.map((value: any, index) => {
                  return (
                    <div key={index} className="flex flex-col w-full h-auto text-xl font-medium">
                        {value.user.username === "test" ? 
                          <div className="text-[#DCE2F0] py-[2%] px-[1%]">{value.content}</div>
                          :
                          <div className="bg-[#DCE2F0] text-[#50586C] py-[2%] px-[1%] flex">{value.content}</div>
                        }
                        
                    </div>
                )}) : ""}
            </div>

            <div className="w-full h-[13%] border-t-4 border-[#DCE2F0] flex flex-col justify-center">
                <form onSubmit={handleSubmitNewMessage} className="w-full h-[100%] px-[5%] py-[1.5%] text-lg flex content-between">
                    <div className="break-words rounded-lg min-h-[100%] w-[85%] max-h-[250%]" ref={containerRef}>
                        <textarea
                            className={`h-full w-full px-[2%] pt-[1.5%] focus:border-none focus:outline-none ${styled.scroll} overflow-hidden bg-[#DCE2F0] rounded-lg resize-none`}
                            value={textareaValue}
                            ref={textareaRef}
                            placeholder="Send Question"
                            onChange={handleTextareaChange}
                            onKeyDown={handleKeyDown}
                        ></textarea>
                    </div>

                    <button type="submit" className={`h-full w-[7%] ml-[5%] rounded-lg duration-700 ${textareaValue ? 'bg-[#DCE2F0] text-[#50586C]' : 'bg-[#50586C] text-[#DCE2F0]'}`} disabled={!textareaValue}>Send</button>
                </form>
            </div>
        </main>
    )
}

export default Interact;