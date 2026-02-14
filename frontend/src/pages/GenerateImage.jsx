import { Edit, Flag, Hash, Image, Sparkles } from "lucide-react";
import { useState } from "react";

const GenerateImage = () => {
  const imageStyles = [
    "Realistic style",
    "Ghibli style",
    "Anime style",
    "Cartoon style",
    "Fantasy style",
    "3D style",
    "Portrait style",
  ];

  const [selectedImageStyle, setSelectedImageStyle] =
    useState("Realistic style");

  const [input, setInput] = useState("");
  const [publish, setPublish] = useState(false);

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
          <Sparkles className="w-6 text-[#00AD25]" />
          <h1 className="text-xl font-semibold">Ai Image Generator</h1>
        </div>
        <p
          className="mt-6 text-lg
        font-semibold"
        >
          Describe Your Images
        </p>
        <textarea
          onChange={(e) => {
            setInput(e.target.value);
          }}
          value={input}
          placeholder="Describe what you want to see in the image.."
          rows={5}
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300"
          required
        />

        <p
          className="mt-6 text-lg
        font-semibold"
        >
          Style
        </p>
        <div className="flex flex-wrap mt-3 gap-3 sm:max-w-9/11">
          {imageStyles.map((item) => {
            return (
              <span
                key={item}
                className={`rounded-full text-xs px-4 py-1 border cursor-pointer ${
                  selectedImageStyle === item
                    ? "bg-green-50 text-green-700"
                    : "text-gray-500 border-gray-300"
                }`}
                onClick={() => {
                  setSelectedImageStyle(item);
                }}
              >
                {item}
              </span>
            );
          })}
        </div>

        {/* Community upload Section*/}
        <div className="my-6 flex items-center gap-3">
          <label className="relative cursor-pointer">
            <input
              type="checkbox"
              onChange={(e) => {
                setPublish(e.target.checked);
              }}
              checked={publish}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-300 rounded-full peer-checked:bg-green-500 transition"></div>
            <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition peer-checked:translate-x-4"></span>
          </label>
          <p className="text-sm">
            Make this image Public
          </p>
        </div>

        <button
          className="bg-linear-to-r from-[#00AD25] to-[#04FF50] text-white flex gap-3 w-full justify-center rounded-xl items-center 
        px-4 py-2 mt-6 cursor-pointer "
        >
          <Hash className="w-6" />
          Generate image
        </button>
      </form>

      {/*Right Col*/}
      <div className="w-full max-w-lg p-4 bg-white flex flex-col border border-gray-200 min-h-96">
        <div className="flex items-center gap-3">
          <Image className="w-5 h-5 text-[#00AD25]" />
          <h1 className="text-xl font-semibold">Generated image</h1>
        </div>
        <div className="flex-1 flex justify-center items-center">
          <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
            <Image className="w-9 h-9" />
            <p>Describe an image and click "Generate Image" to get started"</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateImage;
