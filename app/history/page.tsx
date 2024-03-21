"use client";
import Sidebar from "@/components/Sidebar";
import SERVER_URL from "@/utils/SERVER_URL";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

function AddHistory() {
    const [link, setLink] = useState("");
    const [optional, setOptional] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [year, setYear] = useState("");
    const [history, setHistory] = useState([]);
    const[state,setState]=useState(false)
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
        axios.get((SERVER_URL + "/admin/history"),
            {
                headers: {
                    "x-access-token": localStorage.getItem("token")
                }
            }).then((res) => {
                setHistory(res.data.history);
            });
    }, [state]);



    const handleSubmit = () => {
        const token: any = localStorage.getItem("token");
        axios.post(`${SERVER_URL}/admin/add-history`, {
            link,
            optional,
            title,
            description,
            year,
        }, {
            headers: {
                "x-access-token": token,
            }
        }
        ).then((res) => {
            if (res.status === 200 || res.status === 201) {
                setState(!state);
                setLink("");
                setOptional("");
                setTitle("");
                setDescription("");
                setYear("");
                toast.success("History added successfully");
                axios.get(`${SERVER_URL}/admin/history`).then((res) => {
                    if (res.status === 200) {
                        setHistory(res.data.history);
                    }
                })
            }
        }).catch((err) => {
            console.log(err)
        })
    }
    const handleDelete = (id: string) => {
        axios
            .delete(
                `${SERVER_URL}/admin/history/${id}`,
                {
                    headers: {
                        "x-access-token": localStorage.getItem("token"),
                    },
                }
            )
            .then((res) => {
                if (res.status === 200) {

                    toast.success("History deleted successfully");
                    setHistory(history.filter((item: any) => item._id !== id));
                }
            });
    };
    return (
        <Sidebar>
            <div>
                <h1 className="text-3xl font-bold mx-auto">Add History</h1>

                <div className="max-w-sm mx-auto mt-14 ">

                    {/* Link field */}
                    <label
                        htmlFor="link"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Link
                    </label>
                    <input
                        onChange={(e) => setLink(e.target.value)}
                        type="text"
                        id="link"
                        value={link}
                        className="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-white dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Link"
                    />
                    {/* title field */}
                    <label
                        htmlFor="title"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Title
                    </label>
                    <input
                        onChange={(e) => setTitle(e.target.value)}
                        type="text"
                        id="title"
                        value={title}
                        className="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-white dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Title"
                    />
                    {/* description field */}
                    <label
                        htmlFor="description"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Description
                    </label>
                    <input
                        onChange={(e) => setDescription(e.target.value)}
                        type="text"
                        id="description"
                        value={description}
                        className="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-white dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Description"
                    />
                    {/* optional field */}
                    <label
                        htmlFor="optional"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Optional
                    </label>
                    <input
                        onChange={(e) => setOptional(e.target.value)}
                        type="text"
                        id="optional"
                        value={optional}
                        className="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-white dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Optional"
                    />
                    {/* year field */}
                    <label
                        htmlFor="year"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Year
                    </label>
                    <input
                        onChange={(e) => setYear(e.target.value)}
                        type="text"
                        id="year"
                        value={year}
                        className="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-white dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Year"
                    />
                </div>

                
                
                <div className="max-w-sm mx-auto my-5">
                    <button
                        className="bg-primary text-white w-full py-3 rounded-lg bg-blue-500"
                        onClick={handleSubmit}
                    >
                        Add History
                    </button>
                </div>
            </div>
            <div className="table-list-group my-20">
                <div className="relative overflow-x-auto rounded-xl">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-white rounded-xl">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-white">
                            <tr>
                                <th className="pl-5">
                                    Link
                                </th>
                                <th>
                                    Optional
                                </th>
                                <th>
                                    title
                                </th>
                                <th>
                                    description
                                </th>
                                <th>
                                    year
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Delete
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {history?.map((item: any) => (
                                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <td className="px-6 py-4">{item?.link}</td>
                                    <td className="px-6 py-4">{item?.optional}</td>
                                    <td className="px-6 py-4">{item?.title}</td>
                                    <td className="px-6 py-4">{item?.description}</td>
                                    <td className="px-6 py-4">{item?.year}</td>
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

export default AddHistory;