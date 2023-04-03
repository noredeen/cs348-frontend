import axios from "axios";
import { toast } from "react-hot-toast";

export type CurrentUserType = {
  id: string;
  username: string;
  role: string;
  profile_picture_url: string;
};

export const loginUser = async (username: string, password: string) => {
  try {
    const response = await axios.post(
      "http://localhost:8000/login",
      {
        username,
        password,
      },
      {
        withCredentials: true,
      }
    );

    if (response.status === 200) {
      const user = await response.data.user;
      return user;
    } else {
      toast(response.data.status, TOAST_OPTIONS);
      return null;
    }
  } catch (e: any) {
    toast(e.message, TOAST_OPTIONS);
    return null;
  }
};

export const registerUser = async (
  username: string,
  password: string,
  profilePicture: string,
  role: "admin" | "default"
) => {
  try {
    const response = await axios.post(
      "http://localhost:8000/register",
      {
        username,
        password,
        profilePicture,
        role,
      },
      {
        withCredentials: true,
      }
    );

    if (response.status === 200) {
      const user = await response.data.user;
      return user;
    } else {
      toast(response.data.status, TOAST_OPTIONS);
      return null;
    }
  } catch (e: any) {
    toast(e.message, TOAST_OPTIONS);
    return null;
  }
};

export const currentUser = async () => {
  try {
    const response = await axios.get<CurrentUserType>(
      "http://localhost:8000/currentuser",
      {
        withCredentials: true,
      }
    );

    if (response.status === 200) {
      return response.data;
    } else {
      toast(String(response.data), TOAST_OPTIONS);
      return null;
    }
  } catch (e: any) {
    toast(e.message, TOAST_OPTIONS);
    return null;
  }
};

export const logoutUser = async () => {
  try {
    const response = await axios.post(
      "http://localhost:8000/logout",
      {},
      {
        withCredentials: true,
      }
    );

    if (response.status === 200) {
      return response.data;
    } else {
      toast(String(response.data), TOAST_OPTIONS);
      return null;
    }
  } catch (e: any) {
    toast(e.message, TOAST_OPTIONS);
    return null;
  }
};

// Constants
export const TOAST_OPTIONS = {
  icon: "❌",
};
