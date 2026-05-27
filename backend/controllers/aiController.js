import OpenAI from "openai";
import sql from "../configs/db.js";
import axios from "axios";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import * as pdfParse from "pdf-parse";
const pdf = pdfParse.default ?? pdfParse;

const AI = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

export const generateArticle = async (req, res) => {
  try {
    const authData = req.auth?.();
    const { userId } = authData ?? {};

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { prompt, length } = req.body;
    const targetWords = Number(length) || 800;
    const maxTokens = Math.max(6000, Math.ceil(targetWords * 4));
    const articlePrompt = `${prompt}\n\nWrite a complete, well-structured article of at least ${targetWords} words. Do not stop early. Return only the article content.`;

    const response = await AI.chat.completions.create({
      model: "gemini-2.5-flash",
      messages: [
        {
          role: "user",
          content: articlePrompt,
        },
      ],
      temperature: 0.7,
      max_tokens: maxTokens,
    });

    const content = response.choices[0].message.content ?? "";

    await sql` INSERT INTO creations (user_id,prompt,content,type) values (${userId},${articlePrompt},${content},'write-article')`;

    res.json({ success: true, content });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const generateBlogTitles = async (req, res) => {
  try {
    const authData = req.auth?.();
    const { userId } = authData ?? {};

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { prompt } = req.body;

    const response = await AI.chat.completions.create({
      model: "gemini-3.5-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 2000,
    });

    const content = response.choices[0].message.content ?? "";

    await sql` INSERT INTO creations (user_id,prompt,content,type) values (${userId},${prompt},${content},'blog-title')`;

    res.json({ success: true, content });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const generateImage = async (req, res) => {
  try {
    const authData = req.auth?.();
    const { userId } = authData ?? {};

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { prompt, publish } = req.body;

    if (!process.env.CLIPDROP_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "Missing CLIPDROP_API_KEY in backend environment",
      });
    }

    const formData = new FormData();
    formData.append("prompt", prompt);

    const response = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      formData,
      {
        headers: {
          "x-api-key": process.env.CLIPDROP_API_KEY,
        },
        responseType: "arraybuffer",
      },
    );

    const base64Image = `data:image/png;base64,${Buffer.from(response.data).toString("base64")}`;

    const { secure_url } = await cloudinary.uploader.upload(base64Image);

    await sql` INSERT INTO creations (user_id,prompt,content,type,published) values (${userId},${prompt},${secure_url},'image-generation',${publish ?? false})`;

    res.json({ success: true, secure_url });
  } catch (error) {
    const status = error.response?.status;
    const message = error.response?.data
      ? Buffer.from(error.response.data).toString("utf8")
      : error.message;

    console.log(status, message);
    return res.status(status || 500).json({
      success: false,
      message,
    });
  }
};

export const removeBg = async (req, res) => {
  try {
    const authData = req.auth?.();
    const { userId } = authData ?? {};
    const { image } = req.file;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { secure_url } = await cloudinary.uploader.upload(image.path, {
      transformation: [
        {
          effect: "background_removal",
          background_removal: "remove_the_background",
        },
      ],
    });

    await sql` INSERT INTO creations (user_id,prompt,content,type) values (${userId},'Remove background from the image',${secure_url},'background-removal'`;

    res.json({ success: true, secure_url });
  } catch (error) {
    const status = error.response?.status;
    const message = error.response?.data
      ? Buffer.from(error.response.data).toString("utf8")
      : error.message;

    console.log(status, message);
    return res.status(status || 500).json({
      success: false,
      message,
    });
  }
};

export const removeObj = async (req, res) => {
  try {
    const authData = req.auth?.();
    const { userId } = authData ?? {};
    const { image } = req.file;
    const { object } = req.object;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { public_id } = await cloudinary.uploader.upload(image.path);

    const image_url = cloudinary.url(public_id, {
      transformation: [{ effect: `gen_remove:${object}` }],
      resource_type: "image",
    });

    await sql` INSERT INTO creations (user_id,prompt,content,type) values (${userId},${`Remove ${object} from image`},${image_url},'Object-removal'`;

    res.json({ success: true, image_url });
  } catch (error) {
    const status = error.response?.status;
    const message = error.response?.data
      ? Buffer.from(error.response.data).toString("utf8")
      : error.message;

    console.log(status, message);
    return res.status(status || 500).json({
      success: false,
      message,
    });
  }
};
export const reviewResume = async (req, res) => {
  try {
    const authData = req.auth?.();
    const { userId } = authData ?? {};
    const resume = req.file;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (resume.size > 5 * 1024 * 1024) {
      return res.json({
        success: false,
        message: "Resume file size exceeds allowed size (5MB).",
      });
    }
    const dataBuffer = fs.readFileSync(resume.path);
    const pdfData = await pdf(dataBuffer);

    const prompt = `Review the following resume and provide constructive feedback on its strengths, weaknesses, and areas for improvement. Resume Content:\n\n${pdfData.text}`;

    const response = await AI.chat.completions.create({
      model: "gemini-3.5-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const content = response.choices[0].message.content;

    await sql` INSERT INTO creations (user_id,prompt,content,type) values (${userId},"Review the uploaded resume",${content},'Resume-Review'`;

    res.json({ success: true, content });
  } catch (error) {
    const status = error.response?.status;
    const message = error.response?.data
      ? Buffer.from(error.response.data).toString("utf8")
      : error.message;

    console.log(status, message);
    return res.status(status || 500).json({
      success: false,
      message,
    });
  }
};
