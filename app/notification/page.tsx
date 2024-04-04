"use client";
import Sidebar from "@/components/Sidebar";
import SERVER_URL from "@/utils/SERVER_URL";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

function AddDailyNews() {
    const [title, setTitle] = useState("");
    const [url, setUrl] = useState("");
    const [image, setImage] = useState("");
    const [district, setDistrict] = useState("");
    const [assembly, setAssembly] = useState("");
    const [constituency, setConstituency] = useState("");
    const [districtList, setDistrictList] = useState([]);
    const [assemblyList, setAssemblyList] = useState([]);
    const [constituencyList, setConstituencyList] = useState([]);
    const [boothList, setBoothList] = useState([]);
    const [notification, setNotification] = useState([]);
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
            .then((res) => { })
            .catch((err) => {
                router.push("/login");
                localStorage.removeItem("token");
            });
    }, []);
    useEffect(() => {
        axios.get(SERVER_URL + "/admin/state-districtV1").then((res) => {
            setDistrictList(res.data);
        })
    }, [])
    useEffect(() => {
        axios.get((SERVER_URL + "/admin/notifications"),
            {
                headers: {
                    "x-access-token": localStorage.getItem("token")
                }
            }).then((res) => {
                setNotification(res.data);
            });
    }, [state]);

    const handleDistrictChange = (e: any) => {
        const selectedDistrict = e.target.value; // Get the selected district from the event

        setDistrict(selectedDistrict); // Update the district state with the selected district

        axios
            .get(`${SERVER_URL}/admin/state-districtV1?district=${selectedDistrict}`, {
                // Use the updated district value
                headers: { "x-access-token": localStorage.getItem("token") },
            })
            .then((userResponse) => {
                if (userResponse.status === 200) {
                    setConstituencyList(userResponse.data);
                }
            })
            .catch((err) => {
                console.log(err.response.data);
            });
    };

    const handleConstituencyChange = (e: any) => {
        if (district == "") {
            toast.error("Select The District");
        }
        const selectedConstituency = e.target.value; // Get the selected district from the event

        setConstituency(selectedConstituency); // Update the district state with the selected district

        axios
            .get(
                `${SERVER_URL}/admin/state-districtV1?district=${district}&constituency=${selectedConstituency}`,
                {
                    // Use the updated district value
                    headers: { "x-access-token": localStorage.getItem("token") },
                }
            )
            .then((userResponse) => {
                if (userResponse.status === 200) {
                    setAssemblyList(userResponse.data);
                }
            })
            .catch((err) => {
                console.log(err.response.data);
            });
    };
    const handleAssemblyChange = (e: any) => {
        if (district == "") {
            toast.error("Select The District");
        }
        if (constituency == "") {
            toast.error("Select The Constituency");
        }
        const selectedAssembly = e.target.value; // Get the selected district from the event

        setAssembly(selectedAssembly); // Update the district state with the selected district

        axios
            .get(
                `${SERVER_URL}/admin/state-districtV1?district=${district}&constituency=${constituency}&assembly=${selectedAssembly}`,
                {
                    // Use the updated district value
                    headers: { "x-access-token": localStorage.getItem("token") },
                }
            )
            .then((userResponse) => {
                if (userResponse.status === 200) {
                    setBoothList(userResponse.data);
                }
            })
            .catch((err) => {
                console.log(err.response.data);
            });
    };

    const handleFileChange = (e: any) => {
        const file = e.target.files[0]
        setImage(file)
    }
    const handleSubmit = () => {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("url", url);
        formData.append("image", image);
        formData.append("district", district);
        formData.append("constituency", constituency);
        formData.append("assembly", assembly);
        axios.post(`${SERVER_URL}/admin/send-notification-with-district`, formData,{
            headers:{
                'x-access-token':localStorage.getItem("token")
            }
        }).then((res) => {
            if (res.status === 200 || res.status === 201) {
                setState(!state)
                toast.success("Notification added successfully")
                setTitle("")
                setUrl("")
                setDistrict("")
                setImage("")
                setConstituency("")
                setAssembly("")
            }
        }).catch((err) => {
            console.log(err)
        })
    }
    const handleDelete = (id: string) => {
        axios
            .delete(
                `${SERVER_URL}/admin/notification/${id}`,
                {
                    headers: {
                        "x-access-token": localStorage.getItem("token"),
                    },
                }
            )
            .then((res) => {
                if (res.status === 200) {

                    toast.success("Notification deleted successfully");
                    setNotification(notification.filter((dailyNews: any) => dailyNews._id !== id));
                }
            });
    };
    return (
        <Sidebar>
            <div>
                <h1 className="text-3xl font-bold mx-auto">Add Notification</h1>

                <div className="max-w-sm mx-auto mt-14 ">
                    <label
                        htmlFor="title"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Title
                    </label>
                    <input
                        onChange={(e) => setTitle(e.target.value)}
                        type="text"
                        id="name"
                        value={title}
                        className="bg-gray-50 border mb-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-white dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="title"
                    />

                    {/* url field */}
                    <label
                        htmlFor="url"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Url
                    </label>
                    <input
                        onChange={(e) => setUrl(e.target.value)}
                        type="text"
                        id="url"
                        value={url}
                        className="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-white dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Url"
                    />
                </div>
                <div className="max-w-sm mx-auto">
                    <label
                        htmlFor="district"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Select District
                    </label>
                    <select
                        id="district"
                        className="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-white dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        onChange={(e) => handleDistrictChange(e)}
                    >
                        <option>Select an option</option>
                        {districtList.map((district: any) => (
                            <option key={district} value={district}>
                                {district}
                            </option>
                        ))}
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
                        id="constituency"
                        onChange={(e) => handleConstituencyChange(e)}
                        className="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-white dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                        <option>Select an option</option>
                        {constituencyList.map((constituency: any) => (
                            <option key={constituency} value={constituency}>
                                {constituency}
                            </option>
                        ))}
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
                        id="assembly"
                        onChange={(e) => handleAssemblyChange(e)}
                        className="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-white dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                        <option>Select an option</option>
                        {assemblyList.map((assembly: any) => (
                            <option key={assembly} value={assembly}>
                                {assembly}
                            </option>
                        ))}
                    </select>
                </div>
                {/* image upload */}
                <div className="max-w-sm mx-auto my-5">
                    <label className='mb-[10px] block text-base font-medium text-dark dark:text-white'>
                        Upload Image
                    </label>
                    <input
                        type='file'
                        onChange={handleFileChange}

                        className='w-full cursor-pointer rounded-md border border-stroke file:dark:bg-slate-700 file:dark:text-white dark:border-dark-3 text-dark-6 outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke dark:file:border-dark-3 file:bg-gray-2 dark:file:bg-dark-2 file:py-3 file:px-5 file:text-body-color dark:file:text-dark-6 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2'
                    />
                </div>






                <div className="max-w-sm mx-auto my-5">
                    <button
                        className="bg-primary text-white w-full py-3 rounded-lg bg-blue-500"
                        onClick={handleSubmit}
                    >
                        Add Notification
                    </button>
                </div>
            </div>
            <div className="table-list-group my-20">
                <div className="relative overflow-x-auto rounded-xl">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-white rounded-xl">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-white ">
                            <tr>
                                <th className="pl-5">
                                    Title
                                </th>
                                <th>
                                    url
                                </th>
                                <th>
                                    district
                                </th>
                                <th>
                                    assembly
                                </th>
                                <th>
                                    mandalam
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
                            {notification?.map((item: any) => (
                                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <td className="px-6 py-4">{item?.title}</td>
                                    <td className="px-6 py-4">{item?.url}</td>
                                    <td className="px-6 py-4">{item?.district}</td>
                                    <td className="px-6 py-4">{item?.constituency}</td>
                                    <td className="px-6 py-4">{item?.assembly}</td>
                                    <td className="px-6 py-4" width={"200px"}><img src={item?.image} /></td>
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

export default AddDailyNews;