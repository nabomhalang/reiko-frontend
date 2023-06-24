
import Loading from '@/components/Loading';
import useAxiosAuth from '@/lib/hooks/useAxiosAuth';
import { accessTokenState, useSsrComplectedState } from '@/lib/recoil';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';

const ChatPage = () => {
  const router = useRouter();
  const setSsrCompleted = useSsrComplectedState();
  const authaxios = useAxiosAuth();

  const [room, setRoom] = useState<string[]>([]);
  const [accessToken, setAccessToken] = useRecoilState(accessTokenState);

  useEffect(setSsrCompleted, [setSsrCompleted]);
  useEffect(() => {
    if (accessToken !== undefined && accessToken !== null) {
      const fetchPost = async () => {
        try {
          const getUserInfo = await authaxios.post('/utils/userinfo')
          if (getUserInfo.status === 200) {
            getUserInfo?.data.rooms.map((item: any) => {
              setRoom((prevRoom) => [...prevRoom, item.id])
            })
          }
        } catch (e) {
          console.log(e)
        }
      }
      fetchPost()
    }
  }, [accessToken]);


  const handleCreateRoom = async (e: any) => {
    e.preventDefault()
    try {
      const res = await authaxios.post('/users/createroom')
      console.log(res);

      if (res.status === 201) {
        setRoom((prevRoom) => [...prevRoom, res.data.id])
      }
    } catch (e) {
      console.log(e)
    }
  }

  const handleOpenRoom = async (e: any) => {
    e.preventDefault()

    router.replace(`/chats/${e.target.id}`)
  }

  if (!accessToken && !room) return <Loading />;

  return (
    <div>
      <button onClick={handleCreateRoom}>Create room</button>
      <hr />
      <div>
        {room.map((item) =>
          <div onClick={handleOpenRoom} id={item} key={item}>{item}</div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;

