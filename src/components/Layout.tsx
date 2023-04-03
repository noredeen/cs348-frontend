import { PropsWithChildren } from "react";
import NavBar from "./NavBar";

export const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <NavBar />
      <div>{children}</div>
    </>
  );
};
