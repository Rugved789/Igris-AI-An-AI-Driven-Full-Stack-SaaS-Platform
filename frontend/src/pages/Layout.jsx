import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import SideBar from "../components/SideBar";
import { SignIn,useUser } from "@clerk/clerk-react";

const Layout = () => {
  const [sidebar, setsidebar] = useState(false);
  const {user} = useUser();
  return  user ? (
    <div className="flex flex-col items-start justify-start h-screen">
      <Navbar extraPadding="px-5" />
      <div className="mt-15 sm:mt-70 px-2 sm:hidden">
        {sidebar ? (
          <X
            className="w-6 h-6 cursor-pointer text-gray-600"
            onClick={() => {
              setsidebar(false);
            }}
          />
        ) : (
          <Menu
            className="w-6 h-6 cursor-pointer text-gray-600"
            onClick={() => {
              setsidebar(true);
            }}
          />
        )}
      </div>
      <div className="flex-1 w-full flex h-[calc(100vh-64px)]">
        <SideBar sidebar={sidebar} setSidebar={setsidebar} />
        <div className="flex-1 bg-[#F4F7FB] overflow-y-auto sm:mt-19">
          <Outlet />
        </div>
      </div>
    </div>
  )
  : (
    <div className="flex items-center justify-center h-screen">
      <SignIn/>
    </div>
  )
};

export default Layout;
