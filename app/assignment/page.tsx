"use client";
import Sidebar from "@/components/Sidebar";
import SERVER_URL from "@/utils/SERVER_URL";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

function AddAssignment() {
    const [title, setTitle] = useState("");
    const [link, setLink] = useState("");
    const [image, setImage] = useState("");
    const [description, setDescription] = useState("");
    const [optional, setOptional] = useState("");
    const [districtRule, setDistrictRule] = useState("");
    const [taskForce, setTaskForce] = useState("");
    const [date, setDate] = useState("");
    const [assignment, setAssignment] = useState([]);
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
        axios.get((SERVER_URL + "/admin/assignments"),
        {
            headers: {
                "x-access-token": localStorage.getItem("token")
            }
        }).then((res) => {
            setAssignment(res.data.assignment);
        });
    }, [state]);


    const handleFileChange = (e: any) => {
        const file = e.target.files[0]
        setImage(file)
    }
    const handleSubmit = () => {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("link", link);
        formData.append("image", image);
        formData.append("description", description);
        formData.append("districtRule", districtRule);
        formData.append("taskForce", taskForce);
        formData.append("optional", optional);
        formData.append("date", date);
        axios.post(`${SERVER_URL}/admin/assignment`, formData, {
            headers: {
                'x-access-token': localStorage.getItem("token")
            }
        }).then((res) => {
            if (res.status === 200 || res.status === 201) {
                setState(!state)
                toast.success("Assignment added successfully")
                setTitle("")
                setLink("")
                setOptional("")
                setImage("")
                setDescription("")
                setDistrictRule("")
                setTaskForce("")
                setDate("")
            }
        }).catch((err) => {
            console.log(err)
        })
    }
    const handleDelete = (id: string) => {
        axios
            .delete(
                `${SERVER_URL}/admin/assignment/${id}`,
                {
                    headers: {
                        "x-access-token": localStorage.getItem("token"),
                    },
                }
            )
            .then((res) => {
                if (res.status === 200) {

                    toast.success("Assignment deleted successfully");
                    setAssignment(assignment.filter((assignment: any) => assignment._id !== id));
                }
            });
    };
    return (
        <Sidebar>
            <div>
                <h1 className="text-3xl font-bold mx-auto">Add Assignment</h1>

                <div className="max-w-sm mx-auto mt-14 ">
                    <label
                        htmlFor="title"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-blue-400"
                    >
                        Title
                    </label>
                    <input
                        onChange={(e) => setTitle(e.target.value)}
                        type="text"
                        id="name"
                        value={title}
                        className="bg-gray-50 border mb-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-white dark:text-blue-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Enter your name"
                    />

                    {/* Link field */}
                    <label
                        htmlFor="link"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-blue-400"
                    >
                        Link
                    </label>
                    <input
                        onChange={(e) => setLink(e.target.value)}
                        type="test"
                        id="link"
                        value={link}
                        className="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-white dark:text-blue-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Link"
                    />

                    {/* description field */}
                    <label
                        htmlFor="description"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-blue-400"
                    >
                        Description
                    </label>
                    <input
                        onChange={(e) => setDescription(e.target.value)}
                        type="text"
                        id="description"
                        value={description}
                        className="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-white dark:text-blue-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Description"
                    />
                    {/* optional field */}
                    <label
                        htmlFor="optional"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-blue-400"
                    >
                        Optional
                    </label>
                    <input
                        onChange={(e) => setOptional(e.target.value)}
                        type="text"
                        id="optional"
                        value={optional}
                        className="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-white dark:text-blue-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Optinal"
                    />
                    {/* district rule field */}
                    <label
                        htmlFor="districtRule"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-blue-400"
                    >
                        DistrictRule
                    </label>
                    <select
                        onChange={(e) => setDistrictRule(e.target.value)}
                        id="districtRule"
                        value={districtRule}
                        className="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-white dark:text-blue-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                        <option value="">Select District</option>
                        <option value="Alappuzha">Alappuzha</option>
                        <option value="Ernakulam">Ernakulam</option>
                        <option value="Idukki">Idukki</option>
                        <option value="Kannur">Kannur</option>
                        <option value="Kasaragod">Kasaragod</option>
                        <option value="Kollam">Kollam</option>
                        <option value="Kottayam">Kottayam</option>
                        <option value="Kozhikode">Kozhikode</option>
                        <option value="Malappuram">Malappuram</option>
                        <option value="Palakkad">Palakkad</option>
                        <option value="Pathanamthitta">Pathanamthitta</option>
                        <option value="Thiruvananthapuram">Thiruvananthapuram</option>
                        <option value="Thrissur">Thrissur</option>
                        <option value="Wayanad">Wayanad</option>
                    </select>

                    {/* taskforce field */}
                    <label
                        htmlFor="taskForce"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-blue-400"
                    >
                        Task Force
                    </label>
                    <select
                        onChange={(e) => setTaskForce(e.target.value)}
                        id="taskForce"
                        value={taskForce}
                        className="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-white dark:text-blue-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                        <option value="">Select Task Force</option>
                        <option value="DTF">DTF</option>
                        <option value="ATF">ATF</option>
                        <option value="MTF">MTF</option>
                        <option value="BTF">BTF</option>
                        <option value="ALL">ALL</option>
                    </select>

                    {/* date field */}
                    <label
                        htmlFor="date"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-blue-400"
                    >
                        Date
                    </label>
                    <input
                        onChange={(e) => setDate(e.target.value)}
                        type="date"
                        id="date"
                        value={date}
                        className="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-white dark:text-blue-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                </div>
                {/* image upload */}
                <div className="max-w-sm mx-auto my-5">
                    <label className='mb-[10px] block text-base font-medium text-dark dark:text-blue-400'>
                        Upload Image
                    </label>
                    <input
                        type='file'
                        onChange={handleFileChange}

                        className='w-full cursor-pointer rounded-md border dark:file:text-white dark:file:bg-slate-700 border-stroke dark:border-dark-3 text-dark-6 outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke dark:file:border-dark-3 file:bg-gray-2 dark:file:bg-dark-2 file:py-3 file:px-5 file:text-body-color dark:file:text-dark-6 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2'
                    />
                </div>






                <div className="max-w-sm mx-auto my-5">
                    <button
                        className="bg-primary text-white w-full py-3 rounded-lg bg-blue-500"
                        onClick={handleSubmit}
                    >
                        Add Assignment
                    </button>
                </div>
            </div>
            <div className="table-list-group my-20">
                <div className="relative overflow-x-auto rounded-xl">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-blue-400 rounded-xl">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-blue-400">
                            <tr>
                                <th className="pl-5">
                                    Title
                                </th>
                                <th>
                                    Link
                                </th>
                                <th>
                                    Description
                                </th>
                                <th>
                                    Date
                                </th>
                                <th>
                                    Optional
                                </th>
                                <th>
                                    District Rule
                                </th>
                                <th>
                                    Task Force
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
                            {assignment?.map((item: any) => (
                                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <td className="px-6 py-4">{item?.title}</td>
                                    <td className="px-6 py-4">{item?.link}</td>
                                    <td className="px-6 py-4">{item?.description}</td>
                                    <td className="px-6 py-4">{item?.date}</td>
                                    <td className="px-6 py-4">{item?.optional}</td>
                                    <td className="px-6 py-4">{item?.districtRule}</td>
                                    <td className="px-6 py-4">{item?.taskForce}</td>
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

export default AddAssignment;