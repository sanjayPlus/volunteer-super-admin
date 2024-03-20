"use client";
import Sidebar from "@/components/Sidebar";
import SERVER_URL from "@/utils/SERVER_URL";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

function Assembly() {
  const [assembly, setAssembly] = useState("");
  const [district, setDistrict] = useState("");
  const [assemblyList, setAssemblyList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [constituencyList, setConstituencyList] = useState([]);
  const [constituency, setConstituency] = useState("");
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
  }, [state]);
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
  const handleSubmit = () => {
    const token: any = localStorage.getItem("token");
    axios
      .post(
        `${SERVER_URL}/admin/add-state-assembly`,
        {
          name: assembly,
          district: district,
          constituency: constituency,
        },
        {
          headers: {
            "x-access-token": token,
          },
        }
      )
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setState(!state);
          setAssembly("");
          toast.success("Assembly added successfully");
          axios.get(`${SERVER_URL}/admin/state-districtV1?district=${district}&constituency=${constituency}`).then((res) => {
            if (res.status === 200) {
              setAssemblyList(res.data);
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
        `${SERVER_URL}/admin/delete-state-assembly`,
        {
          assembly: name,
          district: district,
          constituency: constituency,
        },
        {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          toast.success("Assembly deleted successfully");
          axios.get(`${SERVER_URL}/admin/state-districtV1?district=${district}&constituency=${constituency}`).then((res) => {
            if (res.status === 200) {
              setAssemblyList(res.data);
            }
          })
        }
      });
  };

  return (
    <Sidebar>
      <div>
        <h1 className="text-3xl font-bold mx-auto">Assembly</h1>
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
        <div className="max-w-sm mx-auto mt-4">
          <label
            htmlFor="assembly"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Assembly
          </label>
          <input
            onChange={(e) => setAssembly(e.target.value)}
            type="text"
            id="assembly"
            value={assembly}
            aria-describedby="helper-text-explanation"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="assembly"
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
                <th>Assembly</th>
                <th scope="col" className="px-6 py-3">
                  Delete
                </th>
              </tr>
            </thead>
            <tbody>
              {assemblyList?.map((item: any) => (
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td className="px-6 py-4">{item}</td>
                  <td className="px-6 py-4">
                    <button
                      className="text-red-700 "
                      onClick={() => handleDelete(item)}
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

export default Assembly;
