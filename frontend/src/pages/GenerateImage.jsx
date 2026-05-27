import { Edit, Flag, Hash, Image, Sparkles } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import Markdown from "react-markdown";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

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

  const [loading, setLoading] = useState(false);

  const [content, setcontent] = useState("");

  const { getToken } = useAuth();

  const [publish, setPublish] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const prompt = `Generate an image of ${input} in the style ${selectedImageStyle} `;

      const { data } = await axios.post(
        "/api/ai/generate-image",
        { prompt, publish },
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        },
      );

      if (data.success) {
        setcontent(data.secure_url);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  const downloadImage = async () => {
    try {
      const response = await fetch(content);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "ai-image.png";

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("Failed to download image");
    }
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
        font-medium"
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
        font-medium"
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
          <p className="text-sm">Make this image Public</p>
        </div>

        <button
          disabled={loading}
          className="bg-linear-to-r from-[#00AD25] to-[#04FF50] text-white flex gap-3 w-full justify-center rounded-xl items-center 
        px-4 py-2 mt-6 cursor-pointer "
        >
          {loading ? (
            <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
          ) : (
            <Image className="w-6" />
          )}
          Generate image
        </button>
      </form>

      {/*Right Col*/}
      <div className="w-full max-w-lg p-4 bg-white flex flex-col border border-gray-200 min-h-96">
        <div className="flex items-center gap-3">
          <Image className="w-5 h-5 text-[#00AD25]" />
          <h1 className="text-xl font-semibold">Generated image</h1>
        </div>

        {!content ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
              <Image className="w-9 h-9" />
              <p>
                Describe an image and click "Generate Image" to get started"
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-3 h-full flex flex-col gap-4">
            <img
              src={content}
              alt="image"
              className="w-full h-full rounded-lg"
            />

            <button
              onClick={downloadImage}
              className="bg-linear-to-r from-[#00AD25] to-[#04FF50] text-white py-2 rounded-xl cursor-pointer"
            >
              Download Image
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateImage;
