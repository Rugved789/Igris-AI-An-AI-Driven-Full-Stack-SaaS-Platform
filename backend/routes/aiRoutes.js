import express from "express"
import { generateArticle, generateBlogTitles, generateImage, removeBg, removeObj, reviewResume } from "../controllers/aiController.js";
import { auth } from "../middlewares/auth.js";
import {upload} from "../configs/multer.js"

const aiRouter = express.Router();

aiRouter.post('/write-article',auth,generateArticle)
aiRouter.post('/blog-title',auth,generateBlogTitles)
aiRouter.post('/generate-image',auth,generateImage)
aiRouter.post('/remove-bg',upload.single('image'),auth,removeBg)
aiRouter.post('/remove-obj',upload.single('image'),auth,removeObj)
aiRouter.post('/review-resume',upload.single('resume'),auth,reviewResume)




export default aiRouter;