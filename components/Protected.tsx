import SERVER_URL from "@/utils/SERVER_URL";
import axios from "axios";

export const Protected = async () => {
    if(!localStorage.getItem('token')){
        return false;
    }
    
  return axios
    .get(`${SERVER_URL}/admin/protected`, {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    })
    .then((res) => {
      if (res.status === 200) {
        return true;
      } else {
        return false;
      }
    })
    .catch((err) => {
      return false;
    });
};
