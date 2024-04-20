"use client";
import Sidebar from "@/components/Sidebar";
import SERVER_URL from "@/utils/SERVER_URL";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

function AddWhatsapp() {
    const [link, setLink] = useState("");
    const [optional, setOptional] = useState("");
    const[power, setPower] = useState("")
    const [whatsapp, setWhatsapp] = useState([]);
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
        axios.get((SERVER_URL + "/admin/whatsapp"),
            {
                headers: {
                    "x-access-token": localStorage.getItem("token")
                }
            }).then((res) => {
                setWhatsapp(res.data.whatsapp);
            });
    }, [state]);



    const handleSubmit = () => {
        const token: any = localStorage.getItem("token");
        axios.post(`${SERVER_URL}/admin/whatsapp`, {
            link,
            optional,
            power
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
                setPower("");
                toast.success("whatsapp link added successfully");
                axios.get(`${SERVER_URL}/admin/whatsapp`).then((res) => {
                    if (res.status === 200) {
                        setWhatsapp(res.data.whatsapp);
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
                `${SERVER_URL}/admin/whatsapp/${id}`,
                {
                    headers: {
                        "x-access-token": localStorage.getItem("token"),
                    },
                }
            )
            .then((res) => {
                if (res.status === 200) {

                    toast.success("whatsapp link deleted successfully");
                    setWhatsapp(whatsapp.filter((whatsapp: any) => whatsapp._id !== id));
                }
            });
    };
    return (
        <Sidebar>
            <div>
                <h1 className="text-3xl font-bold mx-auto">Add Whatsapp Link</h1>

                <div className="max-w-sm mx-auto mt-14 ">
                    
                    {/* power field */}
                    <label
                        htmlFor="power"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                    >
                        Power
                    </label>
                    <select
                        onChange={(e) => setPower(e.target.value)}
                        id="power"
                        value={power}
                        className="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-text-white dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                        <option value="">Select Power</option>
                        <option value="DTF">DTF</option>
                        <option value="ATF">ATF</option>
                        <option value="MTF">MTF</option>
                        <option value="BTF">BTF</option>
                        <option value="ALL">ALL</option>
                    </select>

                    {/* Link field */}
                    <label
                        htmlFor="link"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                    >
                        Link
                    </label>
                    <input
                        onChange={(e) => setLink(e.target.value)}
                        type="text"
                        id="link"
                        value={link}
                        className="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-text-white dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Link"
                    />
                    {/* optional field */}
                    <label
                        htmlFor="optional"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                    >
                        Optional
                    </label>
                    <input
                        onChange={(e) => setOptional(e.target.value)}
                        type="text"
                        id="optional"
                        value={optional}
                        className="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-text-white dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Optional"
                    />
                </div>
                <div className="max-w-sm mx-auto my-5">
                    <button
                        className="bg-primary text-white w-full py-3 rounded-lg bg-blue-500"
                        onClick={handleSubmit}
                    >
                        Add Whatsapp Link
                    </button>
                </div>
            </div>
            <div className="table-list-group my-20">
                <div className="relative overflow-x-auto">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-black">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-black">
                            <tr>
                                <th className="pl-5">
                                    Power
                                </th>
                                <th>
                                    Link
                                </th>
                                <th>
                                    Optional
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Delete
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {whatsapp?.map((item: any) => (
                                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <td className="px-6 py-4">{item?.power}</td>
                                    <td className="px-6 py-4">{item?.link}</td>
                                    <td className="px-6 py-4">{item?.optional}</td>
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

export default AddWhatsapp;