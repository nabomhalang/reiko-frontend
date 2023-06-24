import Link from 'next/link';
import LoginForm from './LoginForm';

const Login = () => {
    return (
        <main className="bg-[#DCE2F0] w-screen h-screen">
            <span className="text-8xl font-extrabold w-full flex justify-center pt-[4%]">
                <Link href="/">Reiko</Link>
            </span>

            <div className="w-full flex justify-center h-[65%] mt-[2%]">
                <div className="w-1/2 flex flex-col shadow-md bg-white">
                    <div className="flex w-full justify-center h-1/6 text-center text-2xl font-medium">
                        <Link className="h-full w-1/2 flex flex-col justify-center text-[#EE31FE] border-[#EE31FE] border-t-4 box-border" href='/auth/login'>
                            Login
                        </Link>

                        <Link className="h-full w-1/2 flex flex-col justify-center text-[#32CAC1] bg-[#EDEDED]" href='/auth/register'>
                            Register
                        </Link>
                    </div>

                    <LoginForm />
                </div>
            </div>
        </main>
    )
}

export default Login;