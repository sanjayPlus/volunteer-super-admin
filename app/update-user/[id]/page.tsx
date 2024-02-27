"use client";
import Sidebar from '@/components/Sidebar'
import SERVER_URL from '@/utils/SERVER_URL';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
//not completed

function UpdateUser() {
    const [name, setName] = useState("");
    const [href, setHref] = useState("");
    const [user, setUser] = useState({});
    const [state, setState] = useState(false);
    const router = useRouter()
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login")
        }
        axios.get(`${SERVER_URL}/admin/protected`,{
            headers:{
                'x-access-token':token
            }
        }).then((res) => {
            if (res.status === 200) {

                axios.get(`${SERVER_URL}/admin/carousel`).then((res) => {
                    if (res.status === 200) {

                      
                    }
                })
            } else {
                router.push("/login");
                localStorage.removeItem("token")
            }
        }).catch((err) => {
            router.push("/login");
            localStorage.removeItem("token")
        })
    }, [state]);
    const handleFileChange = (e: any) => {
        const file = e.target.files[0]
    }
    const handleSubmit = () => {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("href", href);

        axios.post(`${SERVER_URL}/admin/carousel`, formData,{
            headers:{
                'x-access-token':localStorage.getItem("token")
            }
        }).then((res) => {
            if (res.status === 200 || res.status === 201) {
                setState(!state)
                toast.success("UpdateUser added successfully")
                setName("")
                setHref("")
     
            
            }
        }).catch((err) => {
            console.log(err)
        })
    }
  
    return (
        <Sidebar>
            <div>
                <h1 className='text-3xl font-bold mx-auto'>UpdateUser</h1>
                <div className="max-w-sm mx-auto mt-14">
                    <label
                        htmlFor="name"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Name
                    </label>
                    <input
                        onChange={(e) => setName(e.target.value)}
                        type="name"
                        id="name"
                        value={name}
                        aria-describedby="helper-text-explanation"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="name@flowbite.com"
                    />

                </div>
                <div className="max-w-sm mx-auto">
                    <label
                        htmlFor="href"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Href
                    </label>
                    <input
                        onChange={(e) => setHref(e.target.value)}
                        type="url"
                        id="href"
                        value={href}
                        aria-describedby="helper-text-explanation"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="https://example.com"
                    />

                </div>
               
                <div className="max-w-sm mx-auto my-5">
                    <label className='mb-[10px] block text-base font-medium text-dark dark:text-white'>
                        Upload Image
                    </label>
                    <input
                        type='file'
                        onChange={handleFileChange}
                        
                        className='w-full cursor-pointer rounded-md border border-stroke dark:border-dark-3 text-dark-6 outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke dark:file:border-dark-3 file:bg-gray-2 dark:file:bg-dark-2 file:py-3 file:px-5 file:text-body-color dark:file:text-dark-6 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2'
                    />
                </div>
                <div className="max-w-sm mx-auto my-5">

                    <button onClick={handleSubmit} className='bg-primary text-white w-full py-3 rounded-lg bg-blue-500'>Add</button>
                </div>
            </div>
           
        </Sidebar>
    )
}

export default UpdateUser