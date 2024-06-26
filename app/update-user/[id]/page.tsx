"use client";
import Sidebar from "@/components/Sidebar";
import SERVER_URL from "@/utils/SERVER_URL";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

function updateUser() {
  const { id } = useParams();
  const [district, setDistrict] = useState("");
  const [constituency, setConstituency] = useState("");
  const [assembly, setAssembly] = useState("");
  const [booth, setBooth] = useState("");
  const [caste, setCaste] = useState("");
  const [infavour, setInfavour] = useState("");
  const [votingStatus, setVotingStatus] = useState("");
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [voterId, setVoterId] = useState("");
  const [whatsappNo, setWhatsappNo] = useState("");

  const [guardianName, setGuardianName] = useState("");
  const [houseNo, setHouseNo] = useState("");
  const [houseName, setHouseName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [districtList, setDistrictList] = useState([]);
  const [constituencyList, setConstituencyList] = useState([]);
  const [assemblyList, setAssemblyList] = useState([]);
  const [boothList, setBoothList] = useState([]);
  const [infavourList, setInfavourList] = useState([]);
  const [casteList, setCasteList] = useState([]);
  const[state,setState] = useState(false);
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
            .get(SERVER_URL + `/admin/user/${id}`, {
              headers: {
                "x-access-token": token,
              },
            })
            .then((res) => {
              setCaste(res.data.caste);
              setInfavour(res.data.infavour);
              setVotingStatus(res.data.votingStatus);
              setName(res.data.name);
              setGender(res.data.gender);
              setAge(res.data.age);
              setVoterId(res.data.voterId);
              setWhatsappNo(res.data.whatsappNo);
              setAddress(res.data.address);
              setGuardianName(res.data.guardianName);
              setHouseNo(res.data.houseNo);
              setHouseName(res.data.houseName);
              setEmail(res.data.email);
              setPhone(res.data.phone);
            });
        }
      })
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
  useEffect(() => {
    axios.get(SERVER_URL + "/admin/infavour").then((res) => {
      setInfavourList(res.data.infavour);
    });
  }, []);
  useEffect(() => {
    axios.get(SERVER_URL + "/admin/caste").then((res) => {
      setCasteList(res.data.castes);
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
  };
  const handleSubmit = (e: any) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    axios
      .put(
        `${SERVER_URL}/admin/update-user/${id}`,
        {
          district,
          constituency,
          assembly,
          booth,
          caste,
          infavour,
          votingStatus,
          name,
          gender,
          age,
          voterId,
          whatsappNo,
          email,
          address,
          guardianName,
          houseNo,
          houseName,
          phone,
        },
        {
          headers: {
            "x-access-token": token,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          setState(!state);
          toast.success("Updated Successfully");
          router.push("/all-users");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <Sidebar>
      <div>
        <h1 className="text-3xl font-bold mx-auto">updateUser</h1>

        <div className="max-w-sm mx-auto mt-14 ">
          <label
            htmlFor="name"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-blue-400"
          >
            Name
          </label>
          <input
            onChange={(e) => setName(e.target.value)}
            type="text"
            id="name"
            value={name}
            className="bg-gray-50 border mb-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-blue-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Enter your name"
          />

          {/* Email field */}
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-blue-400"
          >
            Email
          </label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            id="email"
            value={email}
            className="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-blue-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Enter your email"
          />

          {/* Phone field */}
          <label
            htmlFor="phone"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-blue-400"
          >
            Phone
          </label>
          <input
            onChange={(e) => setPhone(e.target.value)}
            type="tel"
            id="phone"
            value={phone}
            className="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-blue-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Enter your phone number"
          />
          {/* Voter ID field */}
          <label
            htmlFor="voterId"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-blue-400"
          >
            Voter ID
          </label>
          <input
            onChange={(e) => setVoterId(e.target.value)}
            type="text"
            id="voterId"
            value={voterId}
            className="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-blue-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Enter your voter ID"
          />

          {/* Whatsapp Number field */}
          <label
            htmlFor="whatsappNo"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-blue-400"
          >
            Whatsapp Number
          </label>
          <input
            onChange={(e) => setWhatsappNo(e.target.value)}
            type="tel"
            id="whatsappNo"
            value={whatsappNo}
            className="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-blue-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Enter your Whatsapp number"
          />
          {/* Caste field */}
          <label
            htmlFor="caste"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-blue-400"
          >
            Caste
          </label>
          <select
            id="caste"
            onChange={(e) => setCaste(e.target.value)}
            value={caste}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-blue-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="">Select an option</option>
            {casteList?.map((item: any) => (
              <option key={item._id} value={item.caste}>
                {item.caste}
              </option>
            ))}
          </select>

          {/* Infavour field */}
          <label
            htmlFor="infavour"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-blue-400"
          >
            Infavour
          </label>
          <select
            id="infavour"
            value={infavour}
            onChange={(e) => setInfavour(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-blue-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="">Select an option</option>
            {infavourList?.map((item: any) => (
              <option key={item._id} value={item.infavour}>
                {item.infavour}
              </option>
            ))}
          </select>

          {/* Gender field */}
          <label
            htmlFor="gender"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-blue-400"
          >
            Gender
          </label>
          <select
            id="gender"
            value={gender}
            className="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-blue-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="M">Male</option>
            <option value="F">Female</option>
            <option value="N">NaN</option>
          </select>

          {/* Age field */}
          <label
            htmlFor="age"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-blue-400"
          >
            Age
          </label>
          <input
            onChange={(e) => setAge(e.target.value)}
            type="number"
            id="age"
            value={age}
            className="bg-gray-50 border mb-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-blue-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Enter your age"
          />
          {/* Voter Status field */}
          <label
            htmlFor="voterStatus"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-blue-400"
          >
            Voter Status
          </label>
          <select
            id="voterStatus"
            value={votingStatus}
            className="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-blue-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
            onChange={(e) => setVotingStatus(e.target.value)}
          >
            <option value="">Select an option</option>
            <option value="native">Alive</option>
              <option value="nomore">No More</option>
              <option value="abroad">Abroad</option>
          </select>
          {/* Guardian Name field */}
          <label
            htmlFor="guardianName"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-blue-400"
          >
            Guardian Name
          </label>
          <input
            onChange={(e) => setGuardianName(e.target.value)}
            type="text"
            id="guardianName"
            value={guardianName}
            className="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-blue-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Enter your guardian's name"
          />

          {/* House Number field */}
          <label
            htmlFor="houseNo"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-blue-400"
          >
            House Number
          </label>
          <input
            onChange={(e) => setHouseNo(e.target.value)}
            type="text"
            id="houseNo"
            value={houseNo}
            className="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-blue-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Enter your house number"
          />

          {/* House Name field */}
          <label
            htmlFor="houseName"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-blue-400"
          >
            House Name
          </label>
          <input
            onChange={(e) => setHouseName(e.target.value)}
            type="text"
            id="houseName"
            value={houseName}
            className="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-blue-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Enter your house name"
          />

          {/* Address field */}
          <label
            htmlFor="address"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-blue-400"
          >
            Address
          </label>
          <input
            onChange={(e) => setAddress(e.target.value)}
            type="text"
            id="address"
            value={address}
            className="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-blue-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Enter your address"
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
            value={district}
            className="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-blue-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
            className="block mb-2  text-sm font-medium text-gray-900 dark:text-blue-400"
          >
            Select Assembly
          </label>
          <select
            id="constituency"
            value={constituency}
            onChange={(e) => handleConstituencyChange(e)}
            className="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-blue-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
            value={assembly}
            onChange={(e) => handleAssemblyChange(e)}
            className="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-blue-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
            value={booth}
            onChange={(e) => setBooth(e.target.value)}
            className="bg-gray-50 border mb-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-blue-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option>Select an option</option>
            {boothList.map((booth: any) => (
              <option key={booth} value={booth.number}>
                {booth.number} {booth.name}
              </option>
            ))}
          </select>
        </div>

        <div className="max-w-sm mx-auto my-5">
          <button
            className="bg-primary text-white w-full py-3 rounded-lg bg-blue-500"
            onClick={handleSubmit}
          >
            update Volunteer
          </button>
        </div>
      </div>
    </Sidebar>
  );
}

export default updateUser;
