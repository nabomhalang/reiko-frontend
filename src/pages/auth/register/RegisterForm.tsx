import { accessTokenState, useSsrComplectedState } from '@/lib/recoil';
import { useNotice } from '@/lib/store/notice.store';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import axios from "@/lib/axios";

function RegisterForm() {
  const router = useRouter();
  const setSsrCompleted = useSsrComplectedState();
  const { successed, failed } = useNotice();

  const [values, setValues] = useState({ email: '', password: '', userId: '', checkPassword: '' });

  const [accessToken, setAccessToken] = useRecoilState(accessTokenState);

  useEffect(setSsrCompleted, [setSsrCompleted]);
  useEffect(() => {
    if (accessToken) {
      console.log('accessToken', accessToken)
      router.push('/');
    }
  }, [accessToken]);

  const handleRegister = async (e: any) => {
    e.preventDefault();

    try {
      if (values.password !== values.checkPassword) return failed({ header: 'Error', message: 'password is not same' });
      const response = await axios.post("/auth/register", {
        email: values.email,
        username: values.userId,
        password: values.password,
      })

      if (response.status === 201) {
        setAccessToken(response.data.accessToken)
        successed({ header: 'Success', message: 'successfully register' })
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
    setValues({ ...values, [name]: value });
  }

  return (
    <div className='h-full w-full'>
      <form className="flex flex-col h-full w-full px-[10%] justify-center gap-y-20" onSubmit={handleRegister}>
        <div className='flex justify-between gap-x-14'>
          <input
            type="text"
            placeholder="User ID"
            name='userId'
            onChange={handleChange}
            className='focus:outline-none box-border border-b-4 border-[#EDEDED] focus:border-[#000000] duration-700 flex w-3/4 h-auto'
          />
          <input
            type="password"
            placeholder="Password"
            name='password'
            onChange={handleChange}
            className='focus:outline-none box-border border-b-4 border-[#EDEDED] focus:border-[#000000] duration-700 flex w-3/4 h-auto'
          />
        </div>

        <div className='flex justify-between gap-x-14'>
          <input
            type="email"
            placeholder="email"
            name='email'
            onChange={handleChange}
            className='focus:outline-none box-border border-b-4 border-[#EDEDED] focus:border-[#000000] duration-700 flex w-3/4 h-auto'
          />
          <input
            type="password"
            placeholder="Check Password"
            name='checkPassword'
            onChange={handleChange}
            className='focus:outline-none box-border border-b-4 border-[#EDEDED] focus:border-[#000000] duration-700 flex w-3/4 h-auto'
          />
        </div>

        <div className="w-full flex flex-row-reverse px-[10%] h-[15%] mt-[3%]">
          <button className="px-[5%] my-[2%] bg-[#32CAC1] rounded-[50px] text-white" type='submit'>
            Submit -&gt;
          </button>
        </div>
      </form>

      {/* <div>
                accessToken: {accessToken}
            </div> */}
    </div>
  );
}



export default RegisterForm;