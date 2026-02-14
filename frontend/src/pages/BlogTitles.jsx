import { Edit, Hash, Sparkles } from "lucide-react";
import { useState } from "react";

const BlogTitles = () => {

  const blogCategories = ["General","Technology","Business","Health","Lifestyle","Education","Travel","Food"];
  
    const [selectedCategory, setSelectedCategory] = useState("General");
  
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
          <Sparkles className="w-6 text-[#8E37EB]" />
          <h1 className="text-xl font-semibold">Ai Title Generator</h1>
        </div>
        <p
          className="mt-6 text-lg
        font-semibold"
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
        font-semibold"
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
          className="bg-linear-to-r from-[#C341F6] to-[#8E37EB] text-white flex gap-3 w-full justify-center rounded-xl items-center 
        px-4 py-2 mt-6 cursor-pointer "
        >
          <Hash className="w-6" />
          Generate title
        </button>
      </form>

      {/*Right Col*/}
      <div className="w-full max-w-lg p-4 bg-white flex flex-col border border-gray-200 min-h-96">
        <div className="flex items-center gap-3">
          <Hash className="w-5 h-5 text-[#8E37EB]" />
          <h1 className="text-xl font-semibold">Generated titles</h1>
        </div>
        <div className="flex-1 flex justify-center items-center">
          <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
            <Hash className="w-9 h-9" />
            <p>Enter keywords and click “Generate Titles” to get started</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogTitles