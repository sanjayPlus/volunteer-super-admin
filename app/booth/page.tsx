"use client";
import Sidebar from "@/components/Sidebar";
import SERVER_URL from "@/utils/SERVER_URL";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

function Booth() {
  const [booth, setBooth] = useState("");
  const [boothNo, setBoothNo] = useState("");
  const [district, setDistrict] = useState("");
  const [boothList, setBoothList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [constituencyList, setConstituencyList] = useState([]);
  const [constituency, setConstituency] = useState("");
  const [assemblyList, setAssemblyList] = useState([]);
  const [assembly, setAssembly] = useState("");
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
          axios.get(`${SERVER_URL}/admin/state-districtV1`).then((res) => {
            if (res.status === 200) {
              setDistrictList(res.data);
            }
          });
        } else {
          router.push("/login");
          localStorage.removeItem("token");
        }
      })
      .catch((err) => {
        router.push("/login");
        localStorage.removeItem("token");
      });
  }, []);
  const handleDistrictChange = (e: any) => {
    const selectedDistrict = e.target.value; // Get the selected district from the event

    setDistrict(selectedDistrict); // Update the district state with the selected district

    axios
      .get(
        `${SERVER_URL}/admin/state-districtV1?district=${selectedDistrict}`,
        {
          // Use the updated district value
          headers: { "x-access-token": localStorage.getItem("token") },
        }
      )
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
  const handleSubmit = () => {
    const token: any = localStorage.getItem("token");
    axios
      .post(
        `${SERVER_URL}/admin/add-state-booth`,
        {
          name: booth,
          number: boothNo,
          district: district,
          constituency: constituency,
          assembly: assembly,
        },
        {
          headers: {
            "x-access-token": token,
          },
        }
      )
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setBooth("");
          toast.success("Booth added successfully");
          axios.get(`${SERVER_URL}/admin/state-districtV1?district=${district}&constituency=${constituency}&assembly=${assembly}`).then((res) => {
            if (res.status === 200) {
              setBoothList(res.data);
            }
          })
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleDelete = (name: string) => {
    axios
      .post(
        `${SERVER_URL}/admin/delete-state-booth`,
        {
          booths: name,
          district: district,
          constituency: constituency,
          assembly: assembly,
        },
        {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          toast.success("Booth deleted successfully");
          axios.get(`${SERVER_URL}/admin/state-districtV1?district=${district}&constituency=${constituency}&assembly=${assembly}`).then((res) => {
            if (res.status === 200) {
              setBoothList(res.data);
            }
          })
        }
      });
  };

  return (
    <Sidebar>
      <div>
        <h1 className="text-3xl font-bold mx-auto">Booth</h1>
        <div className="max-w-sm mx-auto">
          <label
            htmlFor="district"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Select District
          </label>
          <select
            id="district"
            className="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
            Select Constituency
          </label>
          <select
            id="constituency"
            onChange={(e) => handleConstituencyChange(e)}
            className="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
            Select Assembly
          </label>
          <select
            id="assembly"
            onChange={(e) => handleAssemblyChange(e)}
            className="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option>Select an option</option>
            {assemblyList.map((assembly: any) => (
              <option key={assembly} value={assembly}>
                {assembly}
              </option>
            ))}
          </select>
        </div>
        <div className="max-w-sm mx-auto mt-4">
          <label
            htmlFor="booth"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Booth
          </label>
          <input
            onChange={(e) => setBooth(e.target.value)}
            type="text"
            id="booth"
            value={booth}
            aria-describedby="helper-text-explanation"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="booth"
          />
        </div>
        <div className="max-w-sm mx-auto mt-4">
          <label
            htmlFor="booth"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Booth Number
          </label>
          <input
            onChange={(e) => setBoothNo(e.target.value)}
            type="text"
            id="booth"
            value={boothNo}
            aria-describedby="helper-text-explanation"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="booth No"
          />
        </div>

        <div className="max-w-sm mx-auto my-5">
          <button
            onClick={handleSubmit}
            className="bg-primary text-white w-full py-3 rounded-lg bg-blue-500"
          >Add</button>
        </div>
      </div>
      <div className="table-list-group my-20">
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th>Booth No</th>
                <th>Booth Name</th>
                <th scope="col" className="px-6 py-3">
                  Delete
                </th>
              </tr>
            </thead>
            <tbody>
              {boothList?.map((item: any) => (
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td className="px-6 py-4">{item.number}</td>
                  <td className="px-6 py-4">{item.name}</td>
                  <td className="px-6 py-4">
                    <button
                      className="text-red-700 "
                      onClick={() => handleDelete(item.number)}
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

export default Booth;
