"use client";
import Sidebar from "@/components/Sidebar";
import SERVER_URL from "@/utils/SERVER_URL";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

function AddUsersFromExcel() {
  const [booth, setBooth] = useState("");
  const [district, setDistrict] = useState("");
  const [assembly, setAssembly] = useState("");
  const [constituency, setConstituency] = useState("");
  const [districtList, setDistrictList] = useState([]);

  const [constituencyList, setConstituencyList] = useState([]);

  const [assemblyList, setAssemblyList] = useState([]);

  const [boothList, setBoothList] = useState([]);
  const [excel,setExcel] = useState("");
  const [caste, setCaste] = useState("");
  const [infavour, setInfavour] = useState("");
  const [votingStatus, setVotingStatus] = useState("");
  const [gender, setGender] = useState("");


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
    axios.get(SERVER_URL + "/admin/state-districtV1").then((res) => {
      setDistrictList(res.data);
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
  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    setExcel(file)
  };
  const handleSubmit = (e: any) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("excel",excel);
    //district constituency assembly booth madatory
    formData.append("district", district);
    formData.append("constituency", constituency);
    formData.append("assembly", assembly);
    formData.append("booth", booth);

    if(gender){
      formData.append("gender", gender);
    }
    if(caste){
      formData.append("caste", caste);
    }
    if(infavour){
      formData.append("infavour", infavour);
    }
    if(votingStatus){
      formData.append("votingStatus", votingStatus);
    }
    
    axios
      .post(
        `${SERVER_URL}/admin/add-user-from-excel`,
       formData,
        {
          headers: {
            "x-access-token": token,
          },
        }
      )
      .then((res) => {
        toast.success("Users added successfully");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <Sidebar>
      <div>
        <h1 className="text-3xl font-bold mx-auto">Add Users From Excel</h1>
    
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
            className="bg-gray-50 border mb-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option>Select an option</option>
            {boothList.map((booth: any) => (
              <option key={booth} value={booth.number}>
                {booth.number} {booth.name}
              </option>
            ))}
          </select>
        </div>
        <div className="max-w-sm mx-auto">
          <label
            htmlFor="excel"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
         Add Excel
          </label>
          <input
            type="file"
            id="excel"
            
            onChange={handleFileChange}
            className="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
         />
         
        </div>
        <div className="max-w-sm mx-auto">
 {/* Voter Status field */}
 <label
            htmlFor="voterStatus"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Voter Status
          </label>
          <select
            id="voterStatus"
            className="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            onChange={(e) => setVotingStatus(e.target.value)}
          >
            <option value="">Select an option</option>
            <option value="alive">Alive</option>
            <option value="incorrect">Incorrect</option>
            <option value="abraod">Abroad</option>
          </select>
                    {/* Gender field */}
                    <label
            htmlFor="gender"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Gender
          </label>
          <select
            id="gender"
            className="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="M">Male</option>
            <option value="F">Female</option>
            <option value="N">NaN</option>
          </select>
              {/* Caste field */}
              <label
            htmlFor="caste"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Caste
          </label>
          <select
            id="caste"
            onChange={(e) => setCaste(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="" >Select an option</option>
            <option value="RC" >RC</option>
            <option value="OBC" >OBC</option>
            <option value="SC" >SC</option>
            <option value="ST" >ST</option>
            <option value="Muslium" >Muslium</option>
            <option value="Hindu" >Hindu</option>
          </select>
          {/* Infavour field */}
          <label
            htmlFor="infavour"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Infavour
          </label>
          <select
            id="infavour"
            onChange={(e) => setInfavour(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="" >Select an option</option>
            <option value="UDF">UDF</option>
            <option value="LDF">LDF</option>
            <option value="NDA">NDA</option>
            <option value="NILL">NILL</option>
          </select>

        </div>

        <div className="max-w-sm mx-auto my-5">
          <button
            className="bg-primary text-white w-full py-3 rounded-lg bg-blue-500"
            onClick={handleSubmit}
          >
            Add Volunteer
          </button>
        </div>
      </div>
    </Sidebar>
  );
}

export default AddUsersFromExcel;
