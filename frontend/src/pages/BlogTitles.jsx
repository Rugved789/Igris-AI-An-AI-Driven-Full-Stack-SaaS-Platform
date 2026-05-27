import { Edit, Hash, Sparkles } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import Markdown from "react-markdown";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const BlogTitles = () => {
  const blogCategories = [
    "General",
    "Technology",
    "Business",
    "Health",
    "Lifestyle",
    "Education",
    "Travel",
    "Food",
  ];

  const [selectedCategory, setSelectedCategory] = useState("General");

  const [input, setInput] = useState("");

  const [loading, setLoading] = useState(false);

  const [content, setcontent] = useState("");

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const prompt = `
You are a viral blog title creator and modern copywriter.

Generate exactly 10 highly engaging and creative blog titles for:

Keyword: "${input}"
Category: "${selectedCategory}"

Rules:
- Return ONLY titles
- No introduction
- No explanations
- No headings
- No categories
- Use numbered format (1,2,3...)
- Make titles modern, emotional, and click-worthy
`;

      const { data } = await axios.post(
        "/api/ai/blog-title",
        { prompt },
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        },
      );

      if (data.success) {
        setcontent(data.content);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-10 text-slate-700">
      {/*left Col*/}
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#8E37EB]" />
          <h1 className="text-xl font-semibold">Ai Title Generator</h1>
        </div>
        <p
          className="mt-6 text-lg
        font-medium"
        >
          Keyword
        </p>
        <input
          type="text"
          onChange={(e) => {
            setInput(e.target.value);
          }}
          value={input}
          placeholder="The future of artifical intelligence is...."
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300"
          required
        />

        <p
          className="mt-6 text-lg
        font-medium"
        >
          Category
        </p>
        <div className="flex flex-wrap mt-3 gap-3 sm:max-w-9/11">
          {blogCategories.map((item) => {
            return (
              <span
                key={item}
                className={`rounded-full text-xs px-4 py-1 border cursor-pointer ${
                  selectedCategory === item
                    ? "bg-purple-50 text-purple-700"
                    : "text-gray-500 border-gray-300"
                }`}
                onClick={() => {
                  setSelectedCategory(item);
                }}
              >
                {item}
              </span>
            );
          })}
        </div>

        <button
          disabled={loading}
          className="bg-linear-to-r from-[#C341F6] to-[#8E37EB] text-white flex gap-3 w-full justify-center rounded-xl items-center 
        px-4 py-2 mt-6 cursor-pointer "
        >
          {loading ? (
            <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
          ) : (
            <Hash className="w-6" />
          )}
          Generate title
        </button>
      </form>

      {/*Right Col*/}
      <div className="w-full max-w-lg p-4 bg-white flex flex-col border border-gray-200 min-h-96">
        <div className="flex items-center gap-3">
          <Hash className="w-5 h-5 text-[#8E37EB]" />
          <h1 className="text-xl font-semibold">Generated titles</h1>
        </div>

        {!content ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
              <Hash className="w-9 h-9" />
              <p>Enter keywords and click “Generate Titles” to get started</p>
            </div>
          </div>
        ) : (
          <div className="mt-3 flex-1 min-h-0 overflow-y-auto pr-2 text-sm text-slate-600 whitespace-pre-wrap break-words leading-7">
            <div className="reset-tw">
              <Markdown>{content}</Markdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogTitles;
