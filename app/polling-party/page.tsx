"use client";
import Sidebar from "@/components/Sidebar";
import SERVER_URL from "@/utils/SERVER_URL";
import DCC_URL from "@/utils/DCC_URL";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

function AddPollingParty() {
    const [district, setDistrict] = useState("");
    const [assembly, setAssembly] = useState("");
    const [constituency, setConstituency] = useState("");
    const [booth, setBooth] = useState("");
    const [name, setName] = useState("");
    const [party, setParty] = useState("");
    const [symbol, setSymbol] = useState("");
    const [image, setImage] = useState("");
    const [loka, setLoka] = useState("");
    const [districtList, setDistrictList] = useState([]);
    const [constituencyList, setConstituencyList] = useState([]);
    const [assemblyList, setAssemblyList] = useState([]);
    const [boothList, setBoothList] = useState([]);
    const [boothRule, setBoothRule] = useState<any[]>([]);
    const [pollingParty, setPollingParty] = useState([]);
    const [lokaList, setLokaList] = useState([]);
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
            .then((res) => {
                if (res.status === 200) {
                    axios
                        .get(`${SERVER_URL}/admin/volunteers`, {
                            headers: {
                                "x-access-token": localStorage.getItem("token"),
                            },
                        })
                        .then((userResponse) => {
                            if (userResponse.status === 200) {
                                setDistrict(userResponse.data.volunteer.district);
                                axios.get(`${DCC_URL}/admin/districtV4?district=${userResponse.data.volunteer.district}`, {
                                    headers: {
                                        "x-access-token": localStorage.getItem("volunteer-token"),
                                    },
                                }).then((response) => {
                                    setLokaList(response.data);
                                })
                            }
                        });
                }

            })
    }, []);
    useEffect(() => {
        axios.get(DCC_URL + "/admin/districtV4").then((res) => {
            setDistrictList(res.data);
        });
    }, [state]);
    useEffect(() => {
        axios.get((SERVER_URL + "/admin/poling-party"),
            {
                headers: {
                    "x-access-token": localStorage.getItem("token")
                }
            }).then((res) => {
                setPollingParty(res.data);
            });
    }, [state]);

    const handleDistrictChange = (e: any) => {


        const selectedDistrict = e.target.value; // Get the selected district from the event
        setDistrict(selectedDistrict); // Update the district state with the selected district
        axios.get(`${DCC_URL}/admin/districtV4?district=${selectedDistrict}`, {
            headers: {
                "x-access-token": localStorage.getItem("volunteer-token"),
            },
        }).then((response) => {
            if (response.status === 200) {
                setLokaList(response.data);
            }
        })
    }

    const handleLokaChange = (e: any) => {
        if (district == "") {
            toast.error("Select The District");
        }

        const selectedLoka = e.target.value; // Get the selected district from the event
        setLoka(selectedLoka); // Update the district state with the selected district
        axios.get(`${DCC_URL}/admin/districtV4?district=${district}&constituency=${selectedLoka}`, {
            headers: {
                "x-access-token": localStorage.getItem("volunteer-token"),
            },
        }).then((response) => {
            if (response.status === 200) {
                setConstituencyList(response.data);
            }
        })
    }
    const handleConstitunecyChange = (e: any) => {
        if (district == "") {
            toast.error("Select The District");
        }
        const selectedConstitunecy = e.target.value; // Get the selected district from the event

        setConstituency(selectedConstitunecy); // Update the district state with the selected district

        axios
            .get(
                `${SERVER_URL}/admin/state-districtV1?district=${district}&constituency=${selectedConstitunecy}`,
                {
                    // Use the updated district value
                    headers: { "x-access-token": localStorage.getItem("token") },
                }
            )
            .then((userResponse) => {
                if (userResponse.status === 200) {
                    setAssemblyList(userResponse.data);
                    setBoothList([]);
                    setAssembly("");
                    setBooth("");
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
        formData.append("district", district);
        formData.append("assembly", assembly);
        formData.append("constituency", constituency);
        formData.append("booth", booth);
        formData.append("name", name);
        formData.append("party", party);
        formData.append("symbol", symbol);
        formData.append("image", image);
        formData.append("loksabha", loka);
        axios.post(`${SERVER_URL}/admin/add-poling-party`, formData, {
            headers: {
                'x-access-token': localStorage.getItem("token")
            }
        }).then((res) => {
            if (res.status === 200 || res.status === 201) {
                setState(!state)
                toast.success("Polling party added successfully")
                setDistrict("")
                setAssembly("")
                setConstituency("")
                setBooth("")
                setName("")
                setParty("")
                setSymbol("")
                setImage("")
            }
        }).catch((err) => {
            console.log(err)
        })
    }
    const handleDelete = (id: string) => {
        axios
            .delete(
                `${SERVER_URL}/admin/poling-party/${id}`,
                {
                    headers: {
                        "x-access-token": localStorage.getItem("token"),
                    },
                }
            )
            .then((res) => {
                if (res.status === 200) {

                    toast.success("Polling party deleted successfully");
                    setPollingParty(pollingParty.filter((item: any) => item._id !== id));
                }
            });
    };
    return (
        <Sidebar>
            <div>
                <h1 className="text-3xl font-bold mx-auto">Add Polling Party</h1>

                <div className="max-w-sm mx-auto mt-14 ">

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
                            htmlFor="loka"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                        >
                            Select Loksabha
                        </label>
                        <select
                            id="loka"
                            onChange={(e) => handleLokaChange(e)}
                            className="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-900 focus:border-blue-900 block w-full p-3 dark:bg-white dark:border-gray-600 dark:placeholder-black dark:text-black dark:focus:ring-blue-800 dark:focus:border-blue-900"
                        >
                            <option>Select an option</option>
                            {lokaList.map((assembly: any) => (
                                <option key={assembly} value={assembly}>
                                    {assembly}
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
                            onChange={(e) => handleConstitunecyChange(e)}
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
                    <div className="max-w-sm mx-auto">
                        <label
                            htmlFor="booth"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Select Booth
                        </label>
                        <select
                            id="booth"
                            onChange={(e) => setBooth(e.target.value)}
                            className="bg-gray-50 border mb-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-white dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        >
                            <option>Select an option</option>
                            {boothList.map((booth: any) => (
                                <option key={booth} value={booth.number}>
                                    {booth.number} {booth.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* Name field */}
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
                        onChange={(e) => setParty(e.target.value)}
                        id="party"
                        value={party}
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
                        onChange={(e) => setSymbol(e.target.value)}
                        type="text"
                        id="symbol"
                        value={symbol}
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
                        onChange={handleFileChange}

                        className='w-full cursor-pointer rounded-md border border-stroke file:dark:bg-slate-700 file:dark:text-white dark:border-dark-3 text-dark-6 outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke dark:file:border-dark-3 file:bg-gray-2 dark:file:bg-dark-2 file:py-3 file:px-5 file:text-body-color dark:file:text-dark-6 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2'
                    />
                </div>



                <div className="max-w-sm mx-auto my-5">
                    <button
                        className="bg-primary text-white w-full py-3 rounded-lg bg-blue-500"
                        onClick={handleSubmit}
                    >
                        Add Polling Party
                    </button>
                </div>
            </div>
        
        </Sidebar>

    );
}

export default AddPollingParty;