"use client";
import Sidebar from "@/components/Sidebar";
import SERVER_URL from "@/utils/SERVER_URL";
import DCC_URL from "@/utils/DCC_URL";
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
    const [party, setParty] = useState("");
    const [electionType, setElectionType] = useState("");
    const [noOfVotes, setNoOfVotes] = useState("");
    const [noOfVoters, setNoOfVoters] = useState("");
    const [district, setDistrict] = useState("");
    const [loksabha, setLoksabha] = useState("");
    const [constituency, setConstituency] = useState("");
    const [assembly, setAssembly] = useState("");
    const [booth, setBooth] = useState("");
    const [history, setHistory] = useState([]);
    const [lokaList, setLokaList] = useState([]);
    const [districtList, setDistrictList] = useState([]);
    const [loka, setLoka] = useState("");
    const [constituencyList, setConstituencyList] = useState([]);
    const [assemblyList, setAssemblyList] = useState([]);
    const [boothList, setBoothList] = useState([]);
    const [state, setState] = useState(false)
    
    const router = useRouter();
    const [parties, setParties] = useState<any>([{ name: "", count: "", percentage: "" }]);
    // Other state variables...

  
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
                     
                      }
                    });
                  }
                
              })
            .catch((err) => {
                router.push("/login");
                localStorage.removeItem("token");
            });
    }, [state]);

    useEffect(() => {
        axios.get(DCC_URL + "/admin/districtV4").then((res) => {
          setDistrictList(res.data);
        });
      }, [state]);
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
      const handlePartyChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const updatedParties = [...parties];
        updatedParties[index][name] = value;
        setParties(updatedParties);
    };
    

    const addParty = () => {
        setParties([...parties, { name: "", count: "", percentage: "" }]);
    };

    const removeParty = (index: number) => {
        const updatedParties = [...parties];
        updatedParties.splice(index, 1);
        setParties(updatedParties);
    };

    const handleSubmit = () => {
        const token: any = localStorage.getItem("token");
        axios.post(`${SERVER_URL}/admin/add-history`, {
            link,
            optional,
            title,
            description,
            year,
            party: parties,
            no_of_voters: noOfVoters,
            no_of_votes: noOfVotes,
            election_type: electionType,
            district,
            loksabha: loka,
            constituency,
            assembly,
            booth
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
                setParty("");
                setElectionType("");
                setNoOfVotes("");
                setNoOfVoters("");
                setDistrict("");
                setLoksabha("");
                setConstituency("");
                setAssembly("");
                setBooth("");
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
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-blue-400"
                    >
                        Link
                    </label>
                    <input
                        onChange={(e) => setLink(e.target.value)}
                        type="text"
                        id="link"
                        value={link}
                        className="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-white dark:text-blue-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Link"
                    />
                    {/* title field */}
                    <label
                        htmlFor="title"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-blue-400"
                    >
                        Title
                    </label>
                    <input
                        onChange={(e) => setTitle(e.target.value)}
                        type="text"
                        id="title"
                        value={title}
                        className="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-white dark:text-blue-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Title"
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
                        placeholder="Optional"
                    />
                    {/* year field */}
                    <label
                        htmlFor="year"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-blue-400"
                    >
                        Year
                    </label>
                    <input
                        onChange={(e) => setYear(e.target.value)}
                        type="text"
                        id="year"
                        value={year}
                        className="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-white dark:text-blue-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Year"
                    />
                    {/* election type field */}
                    <label
                        htmlFor="electionType"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-blue-400"
                    >
                        Election Type
                    </label>
                    <input
                        onChange={(e) => setElectionType(e.target.value)}
                        type="text"
                        id="electionType"
                        value={electionType}
                        className="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-white dark:text-blue-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Election Type"
                    />

                    {/* no of votes field */}
                    <label
                        htmlFor="noOfVotes"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-blue-400"
                    >
                        No. of Votes
                    </label>
                    <input
                        onChange={(e) => setNoOfVotes(e.target.value)}
                        type="text"
                        id="noOfVotes"
                        value={noOfVotes}
                        className="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-white dark:text-blue-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="No. of Votes"
                    />
                    {/* no of voters field */}
                    <label
                        htmlFor="noOfVoters"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-blue-400"
                    >
                        No. of Voters
                    </label>
                    <input
                        onChange={(e) => setNoOfVoters(e.target.value)}
                        type="text"
                        id="noOfVoters"
                        value={noOfVoters}
                        className="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-white dark:text-blue-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="No. of Voters"
                    />
                </div>

                <div className="max-w-sm mx-auto">
                    <label
                        htmlFor="district"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-blue-400"
                    >
                        Select District
                    </label>
                    <select
                        id="district"
                        className="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-white dark:text-blue-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-blue-400"
                    >
                        Select Loksabha
                    </label>
                    <select
                        id="loka"
                        onChange={(e) => handleLokaChange(e)}
                        className="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-900 focus:border-blue-900 block w-full p-3 dark:bg-white dark:border-gray-600 dark:placeholder-black dark:text-blue-400 dark:focus:ring-blue-800 dark:focus:border-blue-900"
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
                        className="block mb-2  text-sm font-medium text-gray-900 dark:text-blue-400"
                    >
                        Select Assembly
                    </label>
                    <select
                        id="constituency"
                        onChange={(e) => handleConstitunecyChange(e)}
                        className="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-white dark:text-blue-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-blue-400"
                    >
                        Select Mandalam
                    </label>
                    <select
                        id="assembly"
                        onChange={(e) => handleAssemblyChange(e)}
                        className="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-white dark:text-blue-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-blue-400"
                    >
                        Select Booth
                    </label>
                    <select
                        id="booth"
                        onChange={(e) => setBooth(e.target.value)}
                        className="bg-gray-50 border mb-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-white dark:text-blue-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                        <option>Select an option</option>
                        {boothList.map((booth: any) => (
                            <option key={booth} value={booth.number}>
                                {booth.number} {booth.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="parties">Parties</label>
                    {parties.map((party: any, index: number) => (
                        <div key={index}>
                            <input
                                type="text"
                                name="name"
                                value={party.name}
                                onChange={(e) => handlePartyChange(index, e)}
                                placeholder="Party Name"
                            />
                            <input
                                type="text"
                                name="count"
                                value={party.count}
                                onChange={(e) => handlePartyChange(index, e)}
                                placeholder="Party Count"
                            />
                            <input
                                type="text"
                                name="percentage"
                                value={party.percentage}
                                onChange={(e) => handlePartyChange(index, e)}
                                placeholder="Party Percentage"
                            />
                            <button onClick={() => removeParty(index)}>Remove</button>
                        </div>
                    ))}
                    <button onClick={addParty}>Add Party</button>
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
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-blue-400 rounded-xl">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-blue-400">
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