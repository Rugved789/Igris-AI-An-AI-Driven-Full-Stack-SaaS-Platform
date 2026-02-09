import { useClerk, useUser } from "@clerk/clerk-react";
import {
  Eraser,
  FileText,
  Hash,
  House,
  Image,
  Scissors,
  SquarePen,
  Users,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const SideBarItems = [
  { Name: "DashBoard", to: "/ai", Icon: House },
  { Name: "Write Article", to: "/ai/write-article", Icon: SquarePen },
  { Name: "Blog Titles", to: "/ai/blog-titles", Icon: Hash },
  { Name: "Generate Images", to: "/ai/generate-images", Icon: Image },
  { Name: "Remove Background", to: "/ai/remove-bg", Icon: Eraser },
  { Name: "Remove Object", to: "/ai/remove-obj", Icon: Scissors },
  { Name: "Review Resume", to: "/ai/review-resume", Icon: FileText },
  { Name: "Community", to: "/ai/community", Icon: Users },
];

const SideBar = ({ sidebar, setSidebar }) => {
  const { user, isLoaded } = useUser();
  const { signOut, openUserProfile } = useClerk();

  // Wait until user is loaded
  if (!isLoaded || !user) {
    return null; // or loader
  }

  return (
    <div
      className={`w-60 bg-white border-r border-gray-200 flex flex-col justify-between items-center mt-7 max-sm:absolute top-14 bottom-0 ${
        sidebar ? "translate-x-0" : "max-sm:-translate-x-full"
      } transition-all duration-300`}
    >
      <div className="sm:my-25 w-full">
        <img
          src={user.imageUrl}
          alt="user image"
          className="w-13 rounded-full mx-auto"
        />

        <h1 className="mt-1 text-center">{user.fullName}</h1>

        <div className="px-6 mt-5 text-sm text-gray-600 font-medium ">
          {SideBarItems.map(({ Name, to, Icon }) => {
            return (
              <NavLink
                key={to}
                to={to}
                end={to === "/ai"}
                onClick={() => {
                  setSidebar(false);
                }}
                className={({ isActive }) =>
                  `px-3.5 py-2.5 flex items-center gap-3 rounded 
                ${isActive ? "bg-gradient-to-r from-[#3C8CF6] to-[#9234EA] text-white" : ""}`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? "text-white" : "text-gray-500"
                      }`}
                    />
                    <span>{Name}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
