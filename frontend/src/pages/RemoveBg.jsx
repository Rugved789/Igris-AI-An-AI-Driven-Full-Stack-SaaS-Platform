import { Edit, Eraser, Hash, Sparkles } from "lucide-react";
import { useState } from "react";

const RemoveBg = () => {

    const [input, setInput] = useState("");
  
    const onSubmitHandler = async (e) => {
      e.preventDefault();
    };

  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-10 text-slate-700">
      {/*left Col*/}
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#FF4938]" />
          <h1 className="text-xl font-semibold">Background Removal</h1>
        </div>
        <p
          className="mt-6 text-lg
        font-semibold"
        >
          Upload image
        </p>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            setInput(e.target.files[0]);
          }}
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-600"
          required
        />


        <p
          className="mt-2 text-sm text-gray-500 font-light"
        >
          Supports JPG, PNG, and other image formats
        </p>


        <button
          className="bg-linear-to-r from-[#F6AB41] to-[#FF4938] text-white flex gap-3 w-full justify-center rounded-xl items-center 
        px-4 py-2 mt-6 cursor-pointer "
        >
          <Eraser className="w-6" />
          Remove background
        </button>
      </form>

      {/*Right Col*/}
      <div className="w-full max-w-lg p-4 bg-white flex flex-col border border-gray-200 min-h-96">
        <div className="flex items-center gap-3">
          <Eraser className="w-5 h-5 text-[#FF4938]" />
          <h1 className="text-xl font-semibold">Processed Image</h1>
        </div>
        <div className="flex-1 flex justify-center items-center">
          <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
            <Eraser className="w-9 h-9" />
            <p>Upload an image and click "Remove Background" to get started</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RemoveBg