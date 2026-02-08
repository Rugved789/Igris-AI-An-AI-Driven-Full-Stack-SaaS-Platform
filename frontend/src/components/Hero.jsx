import { useNavigate } from "react-router-dom";

const Hero = () => {

    const navigate=useNavigate();

  return (
    <div id="hero"className="px-4 sm:px-40 lg:32 relative inline-flex flex-col w-full justify-center bg-[url(/gradientBackground.png)] bg-cover bg-no-repeat min-h-screen">
      <div className="text-center mb-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl 2xl:text-6xl font-semibold mx-auto leading-[1.2]">
          Create amazing content
          <br /> with
          <span className="text-primary"> AI tools</span>
        </h1>
        <p className="mt-4 max-w-xs sm:max-w-lg 2xl:max-w-xl mx-auto">
          Supercharge your content creation with our powerful AI tools. Create
          articles, generate stunning images, and streamline your entire
          workflow.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-4 text-sm max-sm:text-xs">
        <button onClick={()=>{
            navigate("/ai")
        }} className="bg-primary text-white px-10 py-3  rounded-lg hover:scale-105 active:scale-95 transition cursor-pointer">Start creating now</button>
        <button className="bg-white px-10 py-3 rounded-lg border border-gray-300 hover:scale-105 active:scale-95 transition cursor-pointer">Watch demo</button>
      </div>
    </div>
  );
};

export default Hero;
