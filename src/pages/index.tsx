import React, { createContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Home";
import Flights from "./Flights";
import Register from "./Register";
import Login from "./Login";
import { Toaster } from "react-hot-toast";
import { CurrentUserType, currentUser } from "@/utils/auth";
import Logout from "./Logout";
import AuthContext from "./AuthContext";

export default function App() {
  const [user, setUser] = useState<CurrentUserType | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      const res = await currentUser();
      if (res) {
        setUser(res);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log("user", user);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <div>
        <Toaster position="bottom-left" reverseOrder={false} />
      </div>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/flights" element={<Flights />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}
