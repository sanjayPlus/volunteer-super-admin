"use client";
import Sidebar from "@/components/Sidebar";
import SERVER_URL from "@/utils/SERVER_URL";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";



function Caste() {
const [caste, setCaste] = useState("");
    const [casteList, setCasteList] = useState([]);
    const[state, setState] = useState(false);
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
        }
      })
      .then((res) => {
        if (res.status === 200) {
          axios.get(`${SERVER_URL}/admin/caste`).then((res) => {
            if (res.status === 200) {
              setCasteList(res.data.castes);
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

  const handleSubmit = () => {
    const token:any = localStorage.getItem("token");
    axios.post(`${SERVER_URL}/admin/caste`, {
      caste
    },{
      headers: {
        "x-access-token": token,
      }
      }
    ).then((res) => {
      if (res.status === 200 || res.status === 201) {
        setState(!state);
        setCaste("");
        toast.success("Caste added successfully");
        axios.get(`${SERVER_URL}/admin/caste`).then((res) => {
          if (res.status === 200) {
            setCasteList(res.data.caste);
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
        `${SERVER_URL}/admin/caste/${id}`,
        {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {

          toast.success("Caste deleted successfully");
          setCasteList(casteList.filter((caste:any) => caste._id !== id));
        }
      });
  };

  return (
    <Sidebar>
      <div>
        <h1 className="text-3xl font-bold mx-auto">Caste</h1>
       
        
        <div className="max-w-sm mx-auto mt-4">
          <label
            htmlFor="caste"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-blue-400"
          >
           Caste
          </label>
          <input
            onChange={(e) => setCaste(e.target.value)}
            type="text"
            id="caste"
            value={caste}
            aria-describedby="helper-text-explanation"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-white dark:text-blue-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="caste"
          />
        </div>
        

        <div className="max-w-sm mx-auto my-5">
          <button
            onClick={handleSubmit}
            className="bg-primary text-white w-full py-3 rounded-lg bg-blue-500"
          >
            Add
          </button>
        </div>
      </div>
      <div className="table-list-group my-20">
        <div className="relative overflow-x-auto rounded-xl">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-blue-400 rounded-xl">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-blue-400">
              <tr>
               <th className="pl-5">
                  Caste
               </th>
                <th scope="col" className="px-6 py-3">
                  Delete
                </th>
              </tr>
            </thead>
            <tbody>
              {casteList?.map((item: any) => (
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td className="px-6 py-4">{item?.caste}</td>
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

export default Caste;