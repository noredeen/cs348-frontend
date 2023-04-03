import { CurrentUserType, currentUser } from "@/utils/auth";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AuthContext from "./AuthContext";
import Flights from "./Flights";
import Home from "./Home";
import Login from "./Login";
import Logout from "./Logout";
import Register from "./Register";
import Permissions from "./Permissions";

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
          <Route path="/permissions" element={<Permissions />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}
