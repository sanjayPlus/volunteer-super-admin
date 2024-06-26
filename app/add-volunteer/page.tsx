"use client";
import Sidebar from "@/components/Sidebar";
import SERVER_URL from "@/utils/SERVER_URL";
import DCC_URL from "@/utils/DCC_URL";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

function AddVolunteer() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [booth, setBooth] = useState("");
  const [district, setDistrict] = useState("");
  const [assembly, setAssembly] = useState("");
  const [constituency, setConstituency] = useState("");
  const [mandalamMember, setMandalamMember] = useState("");
  const [mandlamPresident, setMandlamPresident] = useState("");
  const [lokaList, setLokaList] = useState([]);
  const [phone, setPhone] = useState("");
  const [districtList, setDistrictList] = useState([]);
  const [loka, setLoka] = useState("");
  const [constituencyList, setConstituencyList] = useState([]);

  const [assemblyList, setAssemblyList] = useState([]);

  const [boothList, setBoothList] = useState([]);
  const [boothRule, setBoothRule] = useState<any[]>([]);
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
                axios
                  .get(
                    `${DCC_URL}/admin/districtV4?district=${userResponse.data.volunteer.district}`,
                    {
                      headers: {
                        "x-access-token":
                          localStorage.getItem("volunteer-token"),
                      },
                    }
                  )
                  .then((response) => {
                    setLokaList(response.data);
                  });
              }
            });
        }
      })
      .catch((err) => {
        router.push("/login");
        localStorage.removeItem("token");
      });
  }, []);
  useEffect(() => {
    axios.get(DCC_URL + "/admin/districtV4").then((res) => {
      setDistrictList(res.data);
    });
  }, [state]);
  const handleDistrictChange = (e: any) => {
    const selectedDistrict = e.target.value; // Get the selected district from the event
    setDistrict(selectedDistrict); // Update the district state with the selected district
    axios
      .get(`${DCC_URL}/admin/districtV4?district=${selectedDistrict}`, {
        headers: {
          "x-access-token": localStorage.getItem("volunteer-token"),
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setLokaList(response.data);
        }
      });
  };

  const handleLokaChange = (e: any) => {
    if (district == "") {
      toast.error("Select The District");
    }

    const selectedLoka = e.target.value; // Get the selected district from the event
    setLoka(selectedLoka); // Update the district state with the selected district
    axios
      .get(
        `${DCC_URL}/admin/districtV4?district=${district}&constituency=${selectedLoka}`,
        {
          headers: {
            "x-access-token": localStorage.getItem("volunteer-token"),
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          setConstituencyList(response.data);
        }
      });
  };
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
    const file = e.target.files[0];
  };
  const handleSubmit = (e: any) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    axios
      .post(
        `${SERVER_URL}/admin/create-volunteer`,
        {
          name,
          email,
          phone,
          password,
          district,
          assembly,
          booth,
          boothRule,
          constituency,
          mandalamMember,
          mandlamPresident,
          loksabha: loka,
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
          toast.success("Volunteer Added Successfully");
          console.log(res);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const selectAll = () => {
    const allBoothNumbers = boothList.map((booth: any) => booth.number);
    setBoothRule(allBoothNumbers);
  };

  const deselectAll = () => {
    setBoothRule([]);
  };

  return (
    <Sidebar>
      <div>
        <h1 className="text-3xl font-bold mx-auto">AddVolunteer</h1>

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
            className="bg-gray-50 border mb-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-white dark:text-blue-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
            className="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-white dark:text-blue-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Enter your email"
          />

          {/* Password field */}
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-blue-400"
          >
            Password
          </label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            id="password"
            value={password}
            className="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-white dark:text-blue-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Enter your password"
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
            className="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-white dark:text-blue-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Enter your phone number"
          />

          {/* MandalamMember field */}
          {/* <label
            htmlFor="mandalamMember"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-blue-400"
          >
            Mandalam Member
          </label>
          <input
            onChange={(e) => setMandalamMember(e.target.value)}
            type="text"
            id="mandalamMember"
            value={mandalamMember}
            className="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-white dark:text-blue-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Enter mandalam member"
          /> */}

          {/* MandlamPresident field */}
          {/* <label
            htmlFor="mandlamPresident"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-blue-400"
          >
            Mandlam President
          </label>
          <input
            onChange={(e) => setMandlamPresident(e.target.value)}
            type="text"
            id="mandlamPresident"
            value={mandlamPresident}
            className="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-white dark:text-blue-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Enter mandlam president"
          /> */}
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
        <div className="max-w-sm mx-auto">
          <label
            htmlFor="booth"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-blue-400"
          >
            Select Booth Rule
          </label>
          <div>
            <button onClick={selectAll}>Select All</button>
            <button onClick={deselectAll}>Deselect All</button>
          </div>
          {boothList.map((booth: any) => (
            <div key={booth.number}>
              <input
                type="checkbox"
                id={`booth-${booth.number}`}
                value={booth.number}
                checked={boothRule.includes(booth.number)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setBoothRule((prev) => [...prev, booth.number]);
                  } else {
                    setBoothRule((prev) =>
                      prev.filter((num) => num !== booth.number)
                    );
                  }
                }}
              />
              <label htmlFor={`booth-${booth.number}`}>{booth.number}</label>
            </div>
          ))}
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

export default AddVolunteer;
