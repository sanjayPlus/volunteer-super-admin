"use client"
import Sidebar from '@/components/Sidebar'
import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import SERVER_URL from '@/utils/SERVER_URL'
import { toast } from 'react-toastify'
function SingleVolunteer() {
    const {id} = useParams()
    const [user,setUser] = useState<any>({})
    const router = useRouter()
    useEffect(()=>{
        axios.get(`${SERVER_URL}/admin/volunteer/${id}`,{
                headers:{
                    "x-access-token":localStorage.getItem("token")
                }
        }).then((res)=>{
            setUser(res.data.user)
        }).catch((err)=>
        {
            console.log(err)
            toast.error("Something went wrong");
            router.push("/login")
        }
        )
    },[])
    const handleVerify = ()=>{
        axios.put(`${SERVER_URL}/admin/verify-volunteer/${id}`,{
            headers:{
                "x-access-token":localStorage.getItem("token")
            }
        }).then((res)=>{
            toast.success("Volunteer Verified");
            router.replace('/accept-volunteer')
        }).catch((err)=>console.log(err))
    }
  return (
   <>
   <Sidebar>
        <button className='p-3 bg-green-600 rounded-md text-white' onClick={()=>router.back()}>Back</button>
        <div>
            <p>Volunteer Name : {user?.name}</p>
            <p> Email : {user?.email}</p>
            <p> Phone : {user?.phone}</p>
            <p> Address : {user?.address}</p>
                <p>District : {user?.district}</p>
                <p>Constituency : {user?.constituency}</p>
                <p>Assembly : {user?.assembly}</p>
                <p>Booth : {user?.booth}</p>
                <p>Booth Rule</p>
                {
                    user?.boothRule?.map((item:any)=>{
                        return <p>{item}</p>
                    })
                }
                {
                    !user.verified && <button className='p-3 bg-green-600 rounded-md text-white' onClick={handleVerify}>Verify</button>
                }
               

        </div>
   </Sidebar>
   </>
  )
}

export default SingleVolunteer