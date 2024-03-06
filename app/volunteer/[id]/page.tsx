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
            setUser(res.data)
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
      <div>

        <div className="bg-white overflow-hidden shadow rounded-lg border">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Volunteer Profile
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              This is some information about the Volunteer.
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Full name</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user?.name}
                </dd>
              </div>
             
              {
                user?.booth&& <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Booth
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user?.booth}
                </dd>
              </div>
              }
              {user?.email && (
                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Email address
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {user?.email}
                  </dd>
                </div>
              )}

           
              {user?.phone && (
                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Phone number
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <a href={`tel:${user?.phone}`} className="text-blue-600 no-underline">

                    {user?.phone}
                    </a>
                  </dd>
                </div>
              )}
          
              {user?.address && (
                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Address</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {user?.address}
                  </dd>
                </div>
              )}
         
         
              {
                user?.district&& <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                District
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user?.district}
                </dd>
              </div>
              }
              {
                user?.constituency&& <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                Constituency
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user?.constituency}
                </dd>
              </div>
              }
              {
                user?.assembly&& <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                Assembly
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user?.assembly}
                </dd>
              </div>
              }
                     {
                user?.booth&& <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Booth
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user?.booth}
                </dd>
              </div>
              }
                     {
                user?.boothRule&& <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Booth Rule
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user?.boothRule.map((booth:any)=>{return <p>{booth}</p>})}
                </dd>
              </div>
              }
                     {
                user?.aadhaar.length!==0&& <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                Aadaar Image
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {
                            user?.aadhaar?.map((aadhaar:any)=>{return <a href={aadhaar}><img src={aadhaar} className="h-20 w-20"/></a> })
                        }
                </dd>
              </div>
              }
              {
                user?.verified&& <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                Verified
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user?.verified ? "Yes" : "No"}
                </dd>
              </div>
              }
            </dl>
          </div>
        </div>
      </div>
    </Sidebar>
   </>
  )
}

export default SingleVolunteer