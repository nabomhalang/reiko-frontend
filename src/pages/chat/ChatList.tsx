import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import Link from "next/link";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { accessTokenState, useSsrComplectedState } from "@/lib/recoil";
import styled from '../../styles/scroll.module.css';

function ChatList() {
    const router = useRouter();
    const [accessToken, setAccessToken] = useRecoilState(accessTokenState);
    const setSsrCompleted = useSsrComplectedState();
    const authaxios = useAxiosAuth();

    const [room, setRoom] = useState<string[]>([]);
    const [targetRoom, setTargetRoom] = useState("");

    useEffect(setSsrCompleted, [setSsrCompleted]);
    useEffect(() => {
        if (accessToken !== undefined && accessToken !== null) {
            const fetchPost = async () => {
                try {
                    const getUserInfo = await authaxios.post('/utils/userinfo')
                    if (getUserInfo.status === 200) {
                        getUserInfo?.data.rooms.map((item: any) => {
                            setRoom((prevRoom) => [item.id, ...prevRoom])
                        })
                        console.log(getUserInfo);
                        console.log(getUserInfo.data.rooms.reverse()[0].id);

                        setTargetRoom(getUserInfo.data.rooms[0].id);
                        router.push({
                            pathname: "/chat",
                            query: {
                                id: getUserInfo.data.rooms[0].id,
                            }
                        });
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
                setRoom((prevRoom) => [res.data.id, ...prevRoom]);
                setTargetRoom(res.data.id);
                router.push({
                    pathname: "/chat",
                    query: {
                        id: res.data.id,
                    }
                })
            }
        } catch (e) {
            console.log(e)
        }
    }
    
    const handleOpenRoom = async (e: any) => {
        e.preventDefault()

        setTargetRoom(e.target.id);
        router.push({
            pathname: "/chat",
            query: {
                id: e.target.id,
            }
        })
    }

    return (
        <main className={`h-full w-full flex flex-col gap-y-10 bg-[#DCE2F0] overflow-y-auto ${styled.scroll}`}>
            <Link href={'/'} className="w-full text-center mt-[5%] text-2xl font-semibold text-[#50586C]">
                Reiko
            </Link>

            <div className="w-full h-[7%] flex border-r-4 border-[#50586C] duration-500 hover:bg-[#50586C] text-[#50586C] hover:text-white py-[5%]">
                <button
                    className="h-full ml-[1%] pl-[3%] flex flex-col justify-center text-lg font-medium text-right w-full"
                    onClick={handleCreateRoom}
                >
                    New Chat
                </button>
            </div>

            {room.map((value, index) =>
                targetRoom === value ? (
                    <div className="w-full h-[7%] bg-[#50586C] flex text-white py-[5%]">
                        <button
                            className="h-full ml-[1%] pl-[3%] flex flex-col justify-center text-lg font-medium text-right w-full"
                            id={value}
                            onClick={handleOpenRoom}
                            key={index}
                        >
                            room{room.length - index}
                        </button>
                    </div>
                ) : (
                    <div className="w-full h-[7%] flex border-r-4 border-[#50586C] duration-500 hover:bg-[#50586C] text-[#50586C] hover:text-white py-[5%]">
                        <button
                            className="h-full ml-[1%] pl-[3%] flex flex-col justify-center text-lg font-medium text-right w-full"
                            id={value}
                            onClick={handleOpenRoom}
                            key={index}
                        >
                            room{room.length - index}
                        </button>
                    </div>
                )
            )}
        </main >
    )
}

export default ChatList;