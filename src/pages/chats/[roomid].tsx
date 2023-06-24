
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import useAxiosAuth from '@/lib/hooks/useAxiosAuth';
import { accessTokenState, useSsrComplectedState } from '@/lib/recoil';
import { useRecoilState } from 'recoil';
import { } from "@/lib/recoil"
import ChatPage from '.';
import { Socket, io } from 'socket.io-client';
import Loading from '@/components/Loading';
import { messages } from './interface/users.interface';

function ChatRoom() {
  const router = useRouter();
  const setSsrCompleted = useSsrComplectedState();
  const authaxios = useAxiosAuth();

  const { roomid: id } = router.query;
  const [roomInfo, setRoomInfo] = useState(null);


  const [messages, setMessages] = useState<string[]>([]);
  const [chatMessage, setChatMessage] = useState<string>();
  const [chat, setChat] = useState<messages[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [accessToken, setAccessToken] = useRecoilState(accessTokenState);

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
          console.log(response.data.messages);
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
    socket?.emit('message', { data: chatMessage });
  };


  if (!roomInfo && !accessToken) {
    return <Loading />;
  }

  return (
    <div>
      <ChatPage />
      <hr />
      <h2>Chat Room</h2>
      <hr />
      <div>
        {chat.map((item: any) => {
          return (
            <div>
              <div>{item.user.username}-{item.content}</div>
            </div>
          )
        })}
      </div>
      <form>
        <input
          type="text"
          value={chatMessage}
          onChange={(e) => setChatMessage(e.target.value)}
        />
        <button onClick={handleSubmitNewMessage}>전송</button><br />
      </form>
    </div>
  );
}

export default ChatRoom;
