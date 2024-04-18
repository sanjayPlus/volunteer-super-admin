"use client"
import Sidebar from '@/components/Sidebar'
import DCC_URL from '@/utils/DCC_URL'
import SERVER_URL from '@/utils/SERVER_URL'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

function page() {
    
    const router = useRouter()
    const {id}=useParams()
    const[pollingdetails,setpollingdetails]=useState({
        district:"",
        loksabha:"",
        assembly:"",
        mandalam:"",
        name:"",
        party:"",
        symbol:"",
        image:""
    })
    console.log(pollingdetails);
    
    const[districts,setdistricts]=useState([])
    const[loksabhas,setloksabhas]=useState([])
    const[assemblies,setassemblies]=useState([])
    const[mandalams,setmandalams]=useState([])

    const getdistrict = async () => {
        const res=await axios.get(DCC_URL + "/admin/districtV4")
        if(res.status === 200 || res.status === 201){
                setdistricts(res.data) 
        }
    }
    const getloksabha = async () => {
        const{district}=pollingdetails
        const res=await axios.get(`${DCC_URL}/admin/districtV4?district=${district}`)
        if(res.status === 200 || res.status === 201){
                setloksabhas(res.data) 
        }
    }
    const getassembly = async () => {
        const{district,loksabha}=pollingdetails
        const res=await axios.get(`${DCC_URL}/admin/districtV4?district=${district}&constituency=${loksabha}`)
        if(res.status === 200 || res.status === 201){
              setassemblies(res.data) 
        }
    }

    const getmandalam = async () => {
        const{district,assembly}=pollingdetails
        const res=await axios.get(`${SERVER_URL}/admin/state-districtV1?district=${district}&constituency=${assembly}`)
        if(res.status === 200 || res.status === 201){
              setmandalams(res.data) 
        }
    }
    // console.log(mandalams);
    
    const pollingData = async() =>{
        const result = await axios.get(`${SERVER_URL}/admin/poling-party`)
        if(result.status === 200 || result.status === 201){
            const poll = result.data.find((item:any)=>item._id === id)
            console.log(poll);
            setpollingdetails({
                district:poll.district,
                loksabha:poll.loksabha,
                assembly:poll.assembly,
                mandalam:poll.mandalam,
                name:poll.name,
                party:poll.party,
                symbol:poll.symbol,
                image:poll.image
            })
        }
    }

    const handleImage = (e:any)=>{
        const file = e.target.files[0]
        setpollingdetails({...pollingdetails,image:file})
    }

    // update polling party
    const handleUpdate = async()=>{
        const {district,loksabha,assembly,mandalam,name,party,symbol,image}=pollingdetails
        const data = new FormData()
        data.append("district",district)
        data.append("loksabha",loksabha)
        data.append("assembly",assembly)
        data.append("mandalam",mandalam)
        data.append("name",name)
        data.append("party",party)
        data.append("symbol",symbol)
        data.append("image",image)
        const result = await axios.put(`${SERVER_URL}/admin/update-polling/${id}`,data,{
            headers:{
                "x-access-token":localStorage.getItem("token")
            }
        })
        console.log(result);
        if(result.status === 200 || result.status === 201){
            toast.success("Polling party updated successfully")
            
        
    }else{
        toast.error("Failed to Update !!!")
    }
}

    useEffect(()=>{
        const token = localStorage.getItem("token")
        if(!token){
            router.push("/login")
        }else{
            axios.get(`${SERVER_URL}/admin/protected`,{headers:{
                "x-access-token":token
            }}).then(()=>{}).catch((err)=>{
                router.push("/login")
                localStorage.removeItem("token")
            })
        }

    },[])
    useEffect(()=>
    {
        getdistrict()
    },[])
    useEffect(()=>
    {
        getloksabha()
    },[pollingdetails.district])
    useEffect(()=>
        {
            getassembly()
        },[pollingdetails.loksabha])

        useEffect(()=>{
            getmandalam()
        },[pollingdetails.assembly])

        useEffect(()=>{
            pollingData()

        },[])
  return (
    <Sidebar>
            <div>
                <h1 className="text-3xl font-bold mx-auto">Update Polling Party</h1>

                <div className="max-w-sm mx-auto mt-14 ">

                    <div className="max-w-sm mx-auto">
                        <label
                            htmlFor="district"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Select District
                        </label>
                        <select
                            onChange={(e)=>setpollingdetails({...pollingdetails,district:e.target.value})}
                            id="district"
                            className="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-white dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        >
                            <option>Select an option</option>
                           {districts.map((district: any) => (
                               <option value={district}>{district}</option>
                           ))
                           }
                        </select>
                    </div>
                    <div className="max-w-sm mx-auto">
                        <label
                            htmlFor="loka"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                        >
                            Select Loksabha
                        </label>
                        <select
                        onChange={(e)=>setpollingdetails({...pollingdetails,loksabha:e.target.value})}
                            id="loka"
                            className="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-900 focus:border-blue-900 block w-full p-3 dark:bg-white dark:border-gray-600 dark:placeholder-black dark:text-black dark:focus:ring-blue-800 dark:focus:border-blue-900"
                        >
                            <option>Select an option</option>
                           {pollingdetails.district && loksabhas.map((loksabha: any) => (
                               <option value={loksabha}>{loksabha}</option>
                           ))
                           }
                        </select>
                    </div>
                    <div className="max-w-sm mx-auto">
                        <label
                            htmlFor="constituency"
                            className="block mb-2  text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Select Assembly
                        </label>
                        <select
                            onChange={(e)=>setpollingdetails({...pollingdetails,assembly:e.target.value})}
                            id="constituency"
                            className="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-white dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        >
                            <option>Select an option</option>
                            {pollingdetails.loksabha && assemblies.map((assembly: any) => (
                               <option value={assembly}>{assembly}</option>
                           ))
                           }
                        </select>
                    </div>
                    <div className="max-w-sm mx-auto">
                        <label
                            htmlFor="assembly"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Select Mandalam
                        </label>
                        <select
                        onChange={(e)=>setpollingdetails({...pollingdetails,mandalam:e.target.value})}
                            id="assembly"
                            className="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-white dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        >
                            <option>Select an option</option>
                            {pollingdetails.assembly && mandalams.map((mandalam: any) => (
                               <option value={mandalam}>{mandalam}</option>
                           ))
                           }
                        </select>
                    </div>
                    {/* <div className="max-w-sm mx-auto">
                        <label
                            htmlFor="booth"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Select Booth
                        </label>
                        <select
                            id="booth"
                            className="bg-gray-50 border mb-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-white dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        >
                            <option>Select an option</option>
                            {boothList.map((booth: any) => (
                                <option key={booth} value={booth.number}>
                                    {booth.number} {booth.name}
                                </option>
                            ))}
                        </select>
                    </div> */}
                    {/* Name field */}
                    <label
                        
                        htmlFor="name"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        onChange={(e) => setpollingdetails({...pollingdetails,name:e.target.value})}
                        value={pollingdetails.name}
                        className="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-white dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Name"
                    />
                    {/* Party field */}
                    <label
                        htmlFor="party"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Party
                    </label>
                    <select
                    onChange={(e)=>setpollingdetails({...pollingdetails,party:e.target.value})}
                     value={pollingdetails.party}
                        id="party"
                        className="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-white dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                        <option value="">Select a party</option>
                        <option value="UDF">UDF</option>
                        <option value="LDF">LDF</option>
                        <option value="BJP">BJP</option>
                        <option value="OTHERS">OTHERS</option>
                    </select>

                    {/* Optional field */}
                    <label
                        htmlFor="symbol"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Symbol Link
                    </label>
                    <input
                        type="text"
                        id="symbol"
                        onChange={(e) => setpollingdetails({...pollingdetails,symbol:e.target.value})}
                        value={pollingdetails.symbol}
                        className="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-white dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Symbol Link"
                    />

                </div>
                {/* image upload */}
                <div className="max-w-sm mx-auto my-5">
                    <label className='mb-[10px] block text-base font-medium text-dark dark:text-white'>
                        Upload Image
                    </label>
                    <input
                        type='file'
                        onChange={e=>handleImage(e)}
                        className='w-full cursor-pointer rounded-md border border-stroke file:dark:bg-slate-700 file:dark:text-white dark:border-dark-3 text-dark-6 outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke dark:file:border-dark-3 file:bg-gray-2 dark:file:bg-dark-2 file:py-3 file:px-5 file:text-body-color dark:file:text-dark-6 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2'
                    />
                </div>



                <div className="max-w-sm mx-auto my-5">
                    <button
                    onClick={handleUpdate}
                        className="bg-primary text-white w-full py-3 rounded-lg bg-blue-500"
                    >
                       Update
                    </button>
                </div>
            </div>
        
        </Sidebar>
  )
}

export default page