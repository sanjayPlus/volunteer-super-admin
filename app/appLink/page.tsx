"use client";
import Sidebar from "@/components/Sidebar";
import SERVER_URL from "@/utils/SERVER_URL";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

function AddAppLink() {
    const [link, setLink] = useState("");
    const [name, setName] = useState("");
    const [AppLink, setAppLink] = useState([]);
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
        axios.get((SERVER_URL + "/admin/app-link"),
        {
            headers: {
                "x-access-token": localStorage.getItem("token")
            }
        })
        .then((res) => {
            setAppLink(res.data.volunteerAppLink);
        });
    }, [state]);



    const handleSubmit = () => {
        const token: any = localStorage.getItem("token");
        axios.post(`${SERVER_URL}/admin/add-app-link`, {
            link,
            name,
        }, {
            headers: {
                "x-access-token": token,
            }
        }
        ).then((res) => {
            if (res.status === 200 || res.status === 201) {
                setLink("");
                setName("");
                toast.success("App link added successfully");
                axios.get(`${SERVER_URL}/admin/app-link`).then((res) => {
                    if (res.status === 200) {
                        setAppLink(res.data.volunteerAppLink);
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
                `${SERVER_URL}/admin/app-link/${id}`,
                {
                    headers: {
                        "x-access-token": localStorage.getItem("token"),
                    },
                }
            )
            .then((res) => {
                if (res.status === 200) {
                    setState(!state);
                    toast.success("App link deleted successfully");
                    setAppLink(AppLink.filter((AppLink: any) => AppLink._id !== id));
                }
            });
    };
    return (
        <Sidebar>
            <div>
                <h1 className="text-3xl font-bold mx-auto">Add App Link</h1>

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
                        className="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Link"
                    />
                    {/* name field */}
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
                        className="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Name"
                    />
                </div>
                <div className="max-w-sm mx-auto my-5">
                    <button
                        className="bg-primary text-white w-full py-3 rounded-lg bg-blue-500"
                        onClick={handleSubmit}
                    >
                        Add App Link
                    </button>
                </div>
            </div>
            <div className="table-list-group my-20">
                <div className="relative overflow-x-auto">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th>
                                    Link
                                </th>
                                <th>
                                    Name
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Delete
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {AppLink?.map((item: any) => (
                                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <td className="px-6 py-4">{item?.link}</td>
                                    <td className="px-6 py-4">{item?.name}</td>
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

export default AddAppLink;