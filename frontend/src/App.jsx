import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import DashBoard from "./pages/DashBoard";
import WriteArticle from "./pages/WriteArticle";
import BlogTitles from "./pages/BlogTitles";
import GenerateImage from "./pages/GenerateImage";
import RemoveBg from "./pages/RemoveBg";
import RemoveObj from "./pages/RemoveObj";
import ReviewResume from "./pages/ReviewResume";
import Community from "./pages/Community";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ai" element={<Layout />}>
          <Route index element={<DashBoard />} />
          <Route path="write-article" element={<WriteArticle />} />
          <Route path="blog-title" element={<BlogTitles />} />
          <Route path="generate-images" element={<GenerateImage/>}/>
          <Route path="remove-bg" element={<RemoveBg/>}/>
          <Route path="remove-obj" element={<RemoveObj/>}/>
          <Route path="review-resume" element={<ReviewResume/>}/>
          <Route path="community" element={<Community/>}/>
        </Route>
      </Routes>
    </div>
  );
};

export default App;
