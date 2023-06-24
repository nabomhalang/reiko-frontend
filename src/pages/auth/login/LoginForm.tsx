"use client";

import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import axios from "@/lib/axios";
import { useRecoilState } from 'recoil';
import { accessTokenState, useSsrComplectedState } from '@/lib/recoil';
import { useNotice } from '@/lib/store/notice.store';

const LoginForm = () => {
  const router = useRouter();
  const setSsrCompleted = useSsrComplectedState();
  const { successed, failed } = useNotice();

  const [values, setValues] = useState({ email: '', password: '' });
  const [accessToken, setAccessToken] = useRecoilState(accessTokenState);

  useEffect(setSsrCompleted, [setSsrCompleted]);
  useEffect(() => {
    if (accessToken) {
      console.log('accessToken', accessToken)
      router.push('/');
    }
  }, [accessToken]);

  const handleLogin = async (e: any) => {
    e.preventDefault();

    try {
      const response = await axios.post("/auth/login", {
        email: values.email,
        password: values.password,
      })

      if (response.status === 200 && response.data.accessToken) {
        setAccessToken(response.data.accessToken)
        successed({ header: 'Success', message: 'successfully login' })
        router.push('/');
      }
    } catch (err: any) {
      console.log(err)
      failed({ header: 'Error', message: err?.response?.data?.message || 'Login failed' });
    }
  };


  const handleChange = (e: any) => {
    e.preventDefault()
    const { name, value } = e.target
    setValues({ ...values, [name]: value })
  }

  return (
    <div className='h-full w-full'>
      <form className="flex flex-col h-full w-full px-[10%] justify-center gap-y-20" onSubmit={handleLogin}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className='focus:outline-none box-border border-b-4 border-[#EDEDED] focus:border-[#000000] duration-700 flex w-full h-auto'
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className='focus:outline-none box-border border-b-4 border-[#EDEDED] focus:border-[#000000] duration-700 flex w-full h-auto'
        />
        <div className="w-full flex flex-row-reverse px-[10%] h-[15%] mt-[3%]">
          <button className="px-[5%] my-[2%] bg-[#EE31FE] rounded-[50px] text-white" type='submit'>
            Submit -&gt;
          </button>
        </div>
      </form>
    </div>
  );
}



export default LoginForm;