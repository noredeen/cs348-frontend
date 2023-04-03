import { createContext } from "react";
import { CurrentUserType } from "../utils/auth";

const authContext = createContext({
  user: null as CurrentUserType | null,
  setUser: (user: CurrentUserType | null) => {},
});

export default authContext;
