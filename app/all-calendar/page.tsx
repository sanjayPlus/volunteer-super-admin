"use client"
import Sidebar from '@/components/Sidebar'
import SERVER_URL from '@/utils/SERVER_URL'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from "react-toastify";

function page() {
  const[calender,setcalender]=useState([])
  const [searchDate,setSearchDate]=useState("")
  const router=useRouter()
  useEffect(()=>
  {
    const token =localStorage.getItem("token")
    if(!token)
      {
        router.push("/login")
      }
      else
      {
        axios.get(`${SERVER_URL}/admin/protected`,{
          headers:{
            "x-access-token":token
          }
        }).then((res)=>{
          console.log(res.data);
          
        }).catch((err)=>{
          router.push("/login")
          localStorage.removeItem("token")
          console.log(err);
        })
      }
  })

  const handleget=async()=>
  {
    // console.log(searchDate);
    const res=await axios.get(`${SERVER_URL}/admin/get-calendar?date=${searchDate}`,{
      headers:{
        "x-access-token":localStorage.getItem("token")}
    })
    if(res.status ===200 || res.status === 201){
      setcalender(res.data)
    }else{
      console.log("error");
    }
  }
  // delete
  const handleDelete = async(id: any) =>{
    const res = await axios.delete(`${SERVER_URL}/admin/delete-calendar/${id}`,{
      headers:{
        "x-access-token":localStorage.getItem("token")
      }
    })
    if(res.status === 200 || res.status === 201){
      toast.success("deleted successfully")
      handleget()
    }
    else
    {
      toast.error("failed to delete")
    }
  }
  return (
    <Sidebar>
      <div>
        <h1 className='text-3xl font-bold mx-auto'>All Calender</h1>
       <div className='flex items-center  gap-4 py-4'>
          <label
              htmlFor="date"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-blue-400"
            >
              Date
            </label>
            <input
            onChange={(e)=>{setSearchDate(e.target.value)}}
              type="date"
              id="date"
              className="bg-gray-50  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-white dark:text-blue-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
            
            />
            <button
            onClick={handleget}
            className='bg-blue-500 text-white px-4 h-[40px] py-2 rounded-lg'>Submit</button>
       </div>
      </div>

      <div className="table-list-group my-20">
        <div className="relative overflow-x-auto rounded-xl">
          <table className="w-full text-center text-sm rtl:text-right text-gray-500 dark:text-blue-400 rounded-xl">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-blue-400">
              <tr>
               <th className="pl-5">
                  Title
               </th>
               <th>
                  Description
               </th>
               <th>
                  Link
               </th>
                <th scope="col" className="px-6 py-3">
                  Delete
                </th>
              </tr>
            </thead>
            <tbody>
               {calender?.length>0 && calender.map((data:any,index:number)=>(
                 <tr className="bg-white border-b  dark:bg-gray-800 dark:border-gray-700" key={index}>
                 <td className="px-6 py-4">{data.title}</td>
                 <td className="px-6 py-4">{data?.description}</td>
                 <td className="px-6 py-4">{data?.link}</td>
                 <td className="px-6 py-4">
                   <button type='button'
                     className="text-red-700 "
                     onClick={() => handleDelete(data?._id)}
                   >
                     Delete
                   </button>
                 </td>
               </tr>
               ))}
            </tbody>
          </table>
        </div>
      </div>

    </Sidebar>
  )
}

export default page
