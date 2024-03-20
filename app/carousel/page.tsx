"use client";
import Sidebar from "@/components/Sidebar";
import SERVER_URL from "@/utils/SERVER_URL";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

function AddCarousel() {
    const[name,setName]=useState("");
    const[link,setLink]=useState("");
    const[image,setImage]=useState("");
    const[type,setType]=useState("");
    const[carousel, setCarousel] = useState([]);
    const [state, setState] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
    axios
      .get(`${SERVER_URL}/admin/protected`, {
        headers: {
          "x-access-token": token,
        },
      })
      .then((res) => {})
      .catch((err) => {
        router.push("/login");
        localStorage.removeItem("token");
      });
  }, []);
  useEffect(() => {
    axios.get((SERVER_URL + "/admin/carousel"),
    {
      headers: {
          "x-access-token": localStorage.getItem("token")
      }
  }).then((res) => {
      setCarousel(res.data.carousel);
    });
  }, [state]);
  
  
  const handleFileChange = (e: any) => {
    const file = e.target.files[0]
    setImage(file)
}
const handleSubmit = () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("link", link);
    formData.append("image", image);
    formData.append("type",type);
    axios.post(`${SERVER_URL}/admin/carousel`, formData,{
        headers:{
            'x-access-token':localStorage.getItem("token")
        }
    }).then((res) => {
        if (res.status === 200 || res.status === 201) {
            setState(!state)
            toast.success("Carousel added successfully")
            setName("")
            setLink("")
            setType("")
            setImage("")
        }
    }).catch((err) => {
        console.log(err)
    })
}
const handleDelete = (id: string) => {
    axios
      .delete(
        `${SERVER_URL}/admin/carousel/${id}`,
        {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {

          toast.success("Carousel deleted successfully");
          setCarousel(carousel.filter((carousel:any) => carousel._id !== id));
        }
      });
  };
  return (
    <Sidebar>
      <div>
        <h1 className="text-3xl font-bold mx-auto">Add Carousel</h1>

        <div className="max-w-sm mx-auto mt-14 ">
          <label
            htmlFor="name"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Name
          </label>
          <input
            onChange={(e) => setName(e.target.value)}
            type="text"
            id="name"
            value={name}
            className="bg-gray-50 border mb-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Enter your name"
          />

          {/* Link field */}
          <label
            htmlFor="link"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Link
          </label>
          <input
            onChange={(e) => setLink(e.target.value)}
            type="test"
            id="link"
            value={link}
            className="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Link"
          />

          {/* Type field */}
          <label
            htmlFor="type"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Type
          </label>
          <input
            onChange={(e) => setType(e.target.value)}
            type="text"
            id="type"
            value={type}
            className="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Type"
          /> 
        </div>
            {/* image upload */}
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
          <button
            className="bg-primary text-white w-full py-3 rounded-lg bg-blue-500"
            onClick={handleSubmit}
          >
            Add Carousel
          </button>
        </div>
      </div>
      <div className="table-list-group my-20">
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
               <th>
                  Name
               </th>
               <th>
                  Link
               </th>
               <th>
                  Type
               </th>
                <th>
                  Image
                </th>
                <th scope="col" className="px-6 py-3">
                  Delete
                </th>
              </tr>
            </thead>
            <tbody>
              {carousel?.map((item: any) => (
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td className="px-6 py-4">{item?.name}</td>
                  <td className="px-6 py-4">{item?.link}</td>
                  <td className="px-6 py-4">{item?.type}</td>
                  <td className="px-6 py-4" width={"200px"}><img src={item?.image}/></td>
                  <td className="px-6 py-4">
                    <button
                      className="text-red-700 "
                      onClick={() => handleDelete(item._id)}
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
    
  );
}

export default AddCarousel;

