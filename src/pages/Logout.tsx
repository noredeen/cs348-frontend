import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../utils/auth";
import AuthContext from "./AuthContext";

interface Props {}

const Logout: React.FC<Props> = () => {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    const logout = async () => {
      const response = await logoutUser();
      if (response && response.status === "success") {
        setUser(null);
        navigate("/login");
      }
    };

    logout();
  }, []);

  return <h1>Loading...</h1>;
};

export default Logout;
