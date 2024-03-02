"use client";
import Sidebar from "@/components/Sidebar";
import SERVER_URL from "@/utils/SERVER_URL";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function AllVolunteer() {
  const [volunteer, setVolunteer] = useState<{ _id: string }[]>([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [search, setSearch] = useState("");
  const [district, setDistrict] = useState("");
  const [districtList, setDistrictList] = useState([]);
  const [constituency, setConstituency] = useState("");
  const [constituencyList, setConstituencyList] = useState([]);
  const [assembly, setAssembly] = useState("");
  const [assemblyList, setAssemblyList] = useState([]);
  const [booth, setBooth] = useState("");
  const [boothList, setBoothList] = useState([]);
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      axios
        .get(SERVER_URL + "/admin/protected", {
          headers: {
            "x-access-token": token,
          },
        })
        .then((res) => {
          if (res.status === 200) {
            axios
              .get(SERVER_URL + "/admin/volunteers-not-verified?page=1&perPage=10", {
                headers: {
                  "x-access-token": token,
                },
              })
              .then((res) => {
                setVolunteer(res.data.data);
                setPage(res.data.currentPage);
                setTotalPage(res.data.totalPages);

              })
              .catch((err) => {
                console.log(err);
              });
          }
        })
        .catch((error) => {
          router.push("/login");
          localStorage.removeItem("token");
        });
    }
  }, [router]);
  useEffect(() => {
      axios.get(SERVER_URL + "/admin/state-districtV1").then((res) => {
        setDistrictList(res.data);
      })
  },[])
  const handleSearch = () => {
    const token = localStorage.getItem("token");
    if (page > 0 && page <= totalPage) {
      axios
        .get(
          SERVER_URL + "/admin/volunteers-not-verified?page=1&perPage=10&search=" + search,
          {
            headers: {
              "x-access-token": token,
            },
          }
        )
        .then((res) => {
          setVolunteer(res.data.data);
          setPage(res.data.currentPage);
          setTotalPage(res.data.totalPages);
          setSearch("");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(SERVER_URL + "/admin/volunteers-not-verified?page=" + page + "&perPage=10", {
        headers: {
          "x-access-token": token,
        },
      })
      .then((res) => {
        setVolunteer(res.data.data);
        setTotalPage(res.data.totalPages);
        if (res.data.data.length === 0) {
          setPage(1);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [page]);

  const handleDelete = (id: string) => {
    const token = localStorage.getItem("token");
    axios
      .delete(SERVER_URL + "/admin/delete-user/" + id, {
        headers: {
          "x-access-token": token,
        },
      })
      .then((res) => {
        setVolunteer(volunteer.filter((user) => user._id !== id));
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleDistrictChange = (e: any) => {
    const selectedDistrict = e.target.value; // Get the selected district from the event

    setDistrict(selectedDistrict); // Update the district state with the selected district

    axios
      .get(`${SERVER_URL}/admin/state-districtV1?district=${selectedDistrict}`, {
        // Use the updated district value
        headers: { "x-access-token": localStorage.getItem("token") },
      })
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
const handleFilteredSearch = () => {
  const token = localStorage.getItem("token");
  let query = ""
  if(district){
    query += `&district=${district}`
  }
  if(constituency){
    query += `&constituency=${constituency}`
  }
  if(assembly){
    query += `&assembly=${assembly}`
  }
  if(booth){
    query += `&booth=${booth}`
  }
  if(search){
    query += `&search=${search}`
  }
  axios.get(`${SERVER_URL}/admin/volunteers?page=1&perPage=10${query}`, {
    headers: {
      "x-access-token": token,
    }
  }).then((res) => {
    setVolunteer(res.data.data);
    setTotalPage(res.data.totalPages);
    if (res.data.data.length === 0) {
      setPage(1);
    }
  }).catch((err) => {
    console.log(err);
  });
}
const handleVerify = (id:any)=>{
  axios.put(`${SERVER_URL}/admin/verify-volunteer/${id}`,{
      headers:{
          "x-access-token":localStorage.getItem("token")
      }
  }).then((res)=>{
      toast.success("Volunteer Verified");
      setVolunteer(volunteer.filter((user)=>user._id!==id))
  }).catch((err)=>console.log(err))
}
  const handlePageChange = (value: number) => {
    // Ensure that the value is within the valid range
    const newPage = Math.max(1, Math.min(value, totalPage));

    // Update the page state
    setPage(newPage);
  };

  return (
    <>
      <Sidebar>
        <div>
          <label
            htmlFor="default-search"
            className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
          >
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="search"
              id="default-search"
              className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search Mockups, Logos..."
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              type="submit"
              className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
        </div>
        <div className="filters-volunteer-con flex flex-row justify-between flex-wrap items-center mt-6">
          <div className="max-w-sm mx-auto">
            <label
              htmlFor="district"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Select District
            </label>
            <select
              id="district"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              onChange={(e) => handleDistrictChange(e)}
            >
              <option>Select an option</option>
              {districtList.map((district: any) => (
                <option
                  key={district}
                  value={district}
  
                >
                  {district}
                </option>
              ))}
            </select>
          </div>
          <div className="max-w-sm mx-auto">
            <label
              htmlFor="constituency"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Select Constituency
            </label>
            <select
              id="constituency"
              onChange={(e) => handleConstituencyChange(e)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option>Select an option</option>
              {constituencyList.map((constituency: any) => (
                <option
                  key={constituency}
                  value={constituency}
                >
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
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option>Select an option</option>
              {assemblyList.map((assembly: any) => (
                <option
                  key={assembly}
                  value={assembly}
                >
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
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option>Select an option</option>
              {boothList.map((booth: any) => (
                <option
                  key={booth}
                  value={booth.number}
                >
                 {booth.number} {booth.name}
                </option>
              ))}
            </select>
          </div>
          <button  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          onClick={handleFilteredSearch}
          >Search</button>
        </div>
        <h1 className="text-3xl font-bold my-5">All Volunteer</h1>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Name
                </th>
              
                <th scope="col" className="px-6 py-3">
                  Phone Number
                </th>
                <th scope="col" className="px-6 py-3">
                  View
                </th>
                <th scope="col" className="px-6 py-3">
                  Verify
                </th>
                <th scope="col" className="px-6 py-3">
                  Delete
                </th>
              </tr>
            </thead>
            <tbody>
              {volunteer.map((user: any) => (
                <>
                  <tr>
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {user.name}
                    </th>
                    <td className="px-6 py-4">{user.phone}</td>
                    <td className="px-6 py-4"> <p
                        className="font-medium text-blue-700 dark:text-blue-400 hover:underline"
                        onClick={() => router.push('/volunteer/'+user._id)}
                      >
                        View
                      </p></td>
                    <td className="px-6 py-4"> <p
                        className="font-medium text-green-700 dark:text-green-400 hover:underline"
                        onClick={() => handleVerify(user._id)}
                      >
                        Verify
                      </p></td>
                    <td className="px-6 py-4">
                      <p
                        className="font-medium text-red-500 dark:text-red-400 hover:underline"
                        onClick={() => handleDelete(user._id)}
                      >
                        Delete
                      </p>
                    </td>
                  </tr>
                </>
              ))}
            </tbody>
          </table>
          <div></div>
        </div>

        <div className="flex flex-col items-center mt-5">
          {/* Help text */}
          <span className="text-sm text-gray-700 dark:text-gray-400">
            Page{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {page}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {totalPage}
            </span>{" "}
            Total Page
          </span>
          <div className="inline-flex mt-2 xs:mt-0">
            {/* Buttons */}
            <button
              onClick={() => handlePageChange(page - 1)}
              className="flex items-center justify-center px-4 h-10 text-base font-medium text-white bg-gray-800 rounded-s hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <svg
                className="w-3.5 h-3.5 me-2 rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 5H1m0 0 4 4M1 5l4-4"
                />
              </svg>
              Prev
            </button>
            <button
              className="flex items-center justify-center px-4 h-10 text-base font-medium text-white bg-gray-800 border-0 border-s border-gray-700 rounded-e hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              onClick={() => handlePageChange(page + 1)}
            >
              Next
              <svg
                className="w-3.5 h-3.5 ms-2 rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M1 5h12m0 0L9 1m4 4L9 9"
                />
              </svg>
            </button>
          </div>
        </div>
      </Sidebar>
    </>
  );
}

export default AllVolunteer;
