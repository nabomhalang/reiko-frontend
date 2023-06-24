"use client";

import useAxiosAuth from '@/lib/hooks/useAxiosAuth';
import { accessTokenState, useSsrComplectedState } from '@/lib/recoil';
import { useNotice } from '@/lib/store/notice.store';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';

const Home = () => {
  const router = useRouter();
  const axiosAuth = useAxiosAuth();
  const setSsrCompleted = useSsrComplectedState();
  const { successed, failed } = useNotice();

  const [accessToken, setAccessToken] = useRecoilState(accessTokenState);

  useEffect(setSsrCompleted, [setSsrCompleted]);

  useEffect(() => {
    if (accessToken) {
      console.log('accessToken', accessToken)
    }
  }, [accessToken]);

  const logoutHandler = async (e: any) => {
    e.preventDefault();

    try {
      const response = await axiosAuth.post("/auth/logout");
      if (response.status === 200) {
        successed({ header: 'Success', message: 'successfully logout' })
        router.reload();
      }
    } catch (e: any) {
      failed({ header: 'Error', message: e?.response?.data?.message || 'Logout failed' });
    }

    setAccessToken(null);
  }

  return (
    <main>
      <div className='flex flex-row-reverse w-screen absolute'>
        <img src="https://sjinnovation.com/sites/default/files/inline-images/pic%201_39.png" alt="reiko_icon"
          className='h-screen p-0 m-0' />
      </div>

      <div className='absolute bg-black h-screen w-screen opacity-70'></div>

      <nav className='absolute w-screen flex flex-row-reverse p-5 text-3xl font-semibold gap-y-10'>
        {!accessToken ?
          <Link href="/auth/login" className="text-red-500 mx-10">login</Link> :
          <button onClick={logoutHandler} className="text-red-500 mx-10">logout</button>
        }
        <Link href='/chat' className="ml-10">Chat</Link>
      </nav>

      <div className="absolute h-screen w-1/2 flex flex-col justify-center">
        <div className="text-center text-white font-extrabold text-8xl">Reiko</div>
      </div>
    </main>
  )
}

export default Home;
