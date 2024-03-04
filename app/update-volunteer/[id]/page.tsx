"use client";
import Sidebar from "@/components/Sidebar";
import SERVER_URL from "@/utils/SERVER_URL";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

function UpdateVolunteer() {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [booth, setBooth] = useState("");
  const [district, setDistrict] = useState("");
  const [assembly, setAssembly] = useState("");
  const [constituency, setConstituency] = useState("");
  const [mandalamMember, setMandalamMember] = useState("");
  const [mandlamPresident, setMandlamPresident] = useState("");
  const [phone, setPhone] = useState("");
  const [districtList, setDistrictList] = useState([]);

  const [constituencyList, setConstituencyList] = useState([]);

  const [assemblyList, setAssemblyList] = useState([]);

  const [boothList, setBoothList] = useState([]);
  const [boothRule, setBoothRule] = useState<any[]>([]);

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
            .get(SERVER_URL + "/admin/volunteer/" + id, {
              headers: {
                "x-access-token": token,
              },
            })
            .then((res) => {
              if (res.status === 200) {
                setName(res.data.name);
                setEmail(res.data.email);
                setMandalamMember(res.data.mandalamMember);
                setMandlamPresident(res.data.mandlamPresident);
                setPhone(res.data.phone);

                // axios
                //   .get(
                //     SERVER_URL + "/admin/state-districtV1?district=" + district
                //   )
                //   .then((re) => {
                //     if (re.status === 200) {
                //       setAssemblyList(re.data);
                //       axios
                //         .get(
                //           SERVER_URL +
                //             "/admin/state-districtV1?district=" +
                //             district +
                //             "&constituency=" +
                //             constituency
                //         )
                //         .then((resp) => {
                //           if (resp.status === 200) {
                //             setConstituencyList(resp.data);
                //             axios
                //               .get(
                //                 SERVER_URL +
                //                   "/admin/state-districtV1?district=" +
                //                   district +
                //                   "&constituency=" +
                //                   constituency +
                //                   "&assembly=" +
                //                   assembly
                //               )
                //               .then((respo) => {
                //                 if (respo.status === 200) {
                //                   setBoothList(respo.data);
                //                   setAssembly(res.data.assembly);
                //                   setConstituency(res.data.constituency);
                //                   setBooth(res.data.booth);
                //                   setBoothRule(res.data.boothRule);
                //                 }
                //               });
                //           }
                //         });
                //     }
                //   });
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
  };
  const handleSubmit = (e: any) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    axios
      .post(
        `${SERVER_URL}/admin/update-volunteer`,
        {
          name,
          email,
          phone,
          district,
          assembly,
          booth,
          boothRule,
          constituency,
          mandalamMember,
          mandlamPresident,
          volunteerId: id,
        },
        {
          headers: {
            "x-access-token": token,
          },
        }
      )
      .then((res) => {
        console.log(res);
        toast.success("Volunteer Updated");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <Sidebar>
      <div>
        <h1 className="text-3xl font-bold mx-auto">Update Volunteer</h1>

        <div className="max-w-sm mx-auto mt-14 ">
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
            className="bg-gray-50 border mb-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Enter your name"
          />

          {/* Email field */}
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Email
          </label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            id="email"
            value={email}
            className="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Enter your email"
          />

          {/* Phone field */}
          <label
            htmlFor="phone"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Phone
          </label>
          <input
            onChange={(e) => setPhone(e.target.value)}
            type="tel"
            id="phone"
            value={phone}
            className="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Enter your phone number"
          />

          {/* MandalamMember field */}
          <label
            htmlFor="mandalamMember"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Mandalam Member
          </label>
          <input
            onChange={(e) => setMandalamMember(e.target.value)}
            type="text"
            id="mandalamMember"
            value={mandalamMember}
            className="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Enter mandalam member"
          />

          {/* MandlamPresident field */}
          <label
            htmlFor="mandlamPresident"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Mandlam President
          </label>
          <input
            onChange={(e) => setMandlamPresident(e.target.value)}
            type="text"
            id="mandlamPresident"
            value={mandlamPresident}
            className="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Enter mandlam president"
          />
        </div>
        <div className="max-w-sm mx-auto">
          <label
            htmlFor="district"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Select District
          </label>
          <select
            id="district"
            value={district}
            className="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            onChange={(e) => handleDistrictChange(e)}
          >
            <option value="">Select an option</option>
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
            value={constituency}
            className="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="">Select an option</option>
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
            value={assembly}
            onChange={(e) => handleAssemblyChange(e)}
            className="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="">Select an option</option>
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
            value={booth}
            onChange={(e) => setBooth(e.target.value)}
            className="bg-gray-50 border mb-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="">Select an option</option>
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
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Select Booth Rule
          </label>
          {boothList.map((booth: any) => (
            <div key={booth.number}>
              <input
                type="checkbox"
                id={`booth-${booth.number}`}
                value={booth.number}
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
              <label htmlFor={`booth-${booth.number}`}>
                {booth.number} {booth.name}
              </label>
            </div>
          ))}
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

export default UpdateVolunteer;
