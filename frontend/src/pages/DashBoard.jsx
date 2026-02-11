import { useEffect, useState } from "react";
import { dummyCreationData } from "../assets/assets";
import { Sparkles } from "lucide-react";
import Creations from "../components/Creations";

const DashBoard = () => {
  const [creations, setCreations] = useState([]);

  const getDashBoardData = async () => {
    setCreations(dummyCreationData);
  };

  useEffect(() => {
    getDashBoardData();
  }, []);

  return (
    <div className="w-full overflow-y-scroll p-6 no-scrollbar">

      <div className="flex justify-start gap-4 flex-wrap">
        <div className="flex justify-between items-center w-72 p-4 bg-white rounded-xl border border-gray-200">
          <div className="text-slate-600">
            <p className="text-sm">Total Creations</p>
            <h2 className="text-xl font-semibold">{creations.length}</h2>
          </div>
          <div className="w-10 h-10 rounded-lg bg-linear-to-br from-[#3588F2] to-[#0BB0D7] text-white flex justify-center items-center">
            <Sparkles className="w-5 text-white"/>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <p className="mt-6 mb-4">Recent Creations</p>
        {creations.map((item)=>
          <Creations key={item.id} item={item}/>
        )}
      </div>
    </div>
  );
};

export default DashBoard;
