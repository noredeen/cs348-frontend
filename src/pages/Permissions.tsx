import React, { useContext, useEffect, useState } from "react";
import { Layout } from "./components/Layout";
import AuthContext from "./AuthContext";
import { CurrentUserType } from "@/utils/auth";
import axios from "axios";

const Permissions: React.FC = () => {
  const [users, setUsers] = useState<CurrentUserType[]>([]);
  const { user: currentUser } = useContext(AuthContext);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("https://localhost:8000/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const updateRole = async (userId: string, newRole: string) => {
    try {
      await axios.post("https://localhost:8000/updaterole", {
        user_id: userId,
        role: newRole,
      });
      fetchUsers();
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  if (currentUser?.role !== "admin") {
    return (
      <Layout>
        <div className="mx-auto max-w-3xl py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl py-6 sm:px-6 lg:px-8">
            <div className="border-b border-gray-900/10 pb-2">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                You are not authorized to view this page
              </h2>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto max-w-3xl py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl py-6 sm:px-6 lg:px-8">
          <div className="p-4 bg-white rounded-lg border shadow-md sm:p-8 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
                Permissions
              </h3>
            </div>
            <div className="flow-root">
              <ul
                role="list"
                className="divide-y divide-gray-200 dark:divide-gray-700"
              >
                {users.map((user) => (
                  <li key={user.id} className="py-3 sm:py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <img
                          className="w-8 h-8 rounded-full"
                          src={user?.profile_picture_url}
                          alt={`${user.username} image`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                          {user?.username}
                        </p>
                        <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                          {user?.role}
                        </p>
                      </div>
                      <div className="inline-flex items-center">
                        <select
                          className="text-base font-semibold text-gray-900 dark:text-white"
                          value={user.role}
                          onChange={(e) => updateRole(user.id, e.target.value)}
                        >
                          <option value="admin">Admin</option>
                          <option value="default">Default</option>
                        </select>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Permissions;
