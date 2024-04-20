"use client"
import Sidebar from '@/components/Sidebar'
import SERVER_URL from '@/utils/SERVER_URL';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { toast } from "react-toastify";

function page() {
    const [calender, setCalender] = useState({
        date: "",
        time: "",
        title: "",
        description:"",
        link:""
    });
    const router = useRouter()
    useEffect(() => {
       const token = localStorage.getItem("token");
       if(!token){
        router.push("/login")
       }else{
        axios.get(`${SERVER_URL}/admin/protected`,{
            headers:{
                "x-access-token":token
            }
        }).then((res)=>{}).catch((err)=>{
            router.push("/login")
            localStorage.removeItem("token")
            console.log(err);
        })
       }
    },[])

    console.log(calender);
    const handleSubmit = async()=>{
    //   const{ date, time, title, description, link } = calender
       const res = await axios.post(`${SERVER_URL}/admin/add-calendar`,calender,{
        headers:{
            "x-access-token":localStorage.getItem("token")}
       }
       )
       if(res.status === 200 || res.status === 201){
        // console.log(res.data);
        
        setCalender({
            title: "",
            date: "",
            description: "",
            link:"",
            time:""
        })
        toast.success("Calender added successfully")
       }
       else
       {
        toast.error("failed to add Calender")
       }
    }
  return (
    <Sidebar>
       <div>
        <h1 className="text-3xl font-bold mx-auto">Add Calender</h1>

        <div className="max-w-sm mx-auto mt-14 ">
          <label
            htmlFor="title"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
          >
            Title
          </label>
          <input
        onChange={(e) => setCalender({ ...calender, title: e.target.value })}
            value={calender.title}
            type="text"
            id="title"
            className="bg-gray-50 border mb-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-white dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder=" Title"
          />

          {/* Link field */}
          <label
            htmlFor="date"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
          >
            Date
          </label>
          <input
            onChange={(e) => setCalender({ ...calender, date: e.target.value })}
            value={calender.date}
            type="date"
            id="date"
            className="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-white dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
          
          />

          {/* Type field */}
          <label
            htmlFor="description"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
          >
            Description
          </label>
          <textarea
            onChange={(e) => setCalender({ ...calender, description: e.target.value })}
            value={calender.description}
           rows={5}
           cols={5}
           id="description"
            className="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-white dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Description"
          /> 

        <label
            htmlFor="title"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
          >
            Link
          </label>
          <input
        onChange={(e) => setCalender({ ...calender, link: e.target.value })}
            value={calender.link}
            type="text"
            id="title"
            className="bg-gray-50 border mb-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-white dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder=" Link"
          />
        </div>
          
        <div className="max-w-sm mx-auto my-5">
          <button
            className="bg-primary text-white w-full py-3 rounded-lg bg-blue-500"
          onClick={handleSubmit}
          >
           Submit
          </button>
        </div>
      </div>
    </Sidebar>
  )
}

export default page

