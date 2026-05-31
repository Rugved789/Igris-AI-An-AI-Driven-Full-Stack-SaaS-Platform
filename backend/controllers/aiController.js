import OpenAI from "openai";
import sql from "../configs/db.js";
import axios from "axios";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

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
      model: "gemini-3.5-flash",
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
      max_tokens: 1500,
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
    const  image  = req.file;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!image || !image.path) {
      return res.status(400).json({ success: false, message: "No image uploaded" });
    }

    const { secure_url } = await cloudinary.uploader.upload(image.path, {
      transformation: [
        {
          effect: "background_removal",
          background_removal: "remove_the_background",
        },
      ],
    });

    // record creation
    await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${"Remove background from the image"}, ${secure_url}, ${"background-removal"})`;

    // cleanup uploaded file
    try {
      fs.unlinkSync(image.path);
    } catch (err) {
      // ignore cleanup errors
    }

    res.json({ success: true, secure_url });
  } catch (error) {
    const status = error.response?.status;
    const message = error.response?.data
      ? Buffer.from(error.response.data).toString("utf8")
      : error.message;
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
    const image = req.file;
    const { object } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    if (!image || !image.path) {
      return res.status(400).json({ success: false, message: "No image uploaded" });
    }

    if (!object || typeof object !== "string") {
      return res.status(400).json({ success: false, message: "Missing 'object' field in request body" });
    }

    const uploadResult = await cloudinary.uploader.upload(image.path);
    const public_id = uploadResult.public_id;

    const image_url = cloudinary.url(public_id, {
      transformation: [{ effect: `gen_remove:${object}` }],
      resource_type: "image",
    });

    await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${"Remove " + object + " from image"}, ${image_url}, ${"Object-removal"})`;

    // cleanup uploaded file
    try {
      fs.unlinkSync(image.path);
    } catch (err) {
      // ignore
    }

    res.json({ success: true, image_url });
  } catch (error) {
    const status = error.response?.status;
    const message = error.response?.data
      ? Buffer.from(error.response.data).toString("utf8")
      : error.message;

    return res.status(status || 500).json({
      success: false,
      message,
    });
  }
};


export const reviewResume = async (req, res) => {
  let resumePath;

  try {
    const authData = req.auth?.();
    const { userId } = authData ?? {};
    const resume = req.file;
    resumePath = resume?.path;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!resume || !resume.path) {
      return res.status(400).json({ success: false, message: "No resume uploaded" });
    }

    if (resume.size > 5 * 1024 * 1024) {
      return res.json({
        success: false,
        message: "Resume file size exceeds allowed size (5MB).",
      });
    }
    const dataBuffer = fs.readFileSync(resume.path);
    const { default: pdfParse } = await import("../node_modules/pdf-parse/lib/pdf-parse.js");
    const pdf = typeof pdfParse === "function" ? pdfParse : pdfParse.default;
    let pdfData;

    try {
      pdfData = await pdf(dataBuffer);
    } catch (parseError) {
      return res.status(400).json({
        success: false,
        message: "Unable to read the uploaded PDF. Please upload a valid text-based PDF resume.",
      });
    }

    const resumeText = (pdfData.text ?? "").trim().slice(0, 12000);

    if (!resumeText) {
      return res.status(400).json({
        success: false,
        message: "No readable text was found in the uploaded PDF. Please upload a text-based resume.",
      });
    }

    const prompt = `Review the following resume and provide constructive feedback on its strengths, weaknesses, and areas for improvement. Resume Content:\n\n${resumeText}`;

    const response = await AI.chat.completions.create({
      model: "gemini-2.5-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    const content = response.choices?.[0]?.message?.content?.trim();

    if (!content) {
      return res.status(502).json({
        success: false,
        message: "The AI service returned an empty resume review. Please try again.",
      });
    }

    try {
      await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${"Review the uploaded resume"}, ${content}, ${"Resume-Review"})`;
    } catch (dbError) {
      console.error("Failed to save resume review:", dbError.message);
    }

    res.json({ success: true, content });
  } catch (error) {
    const status = error.response?.status;
    const message = error.response?.data
      ? Buffer.from(error.response.data).toString("utf8")
      : error.message;
    return res.status(status || 502).json({
      success: false,
      message,
    });
  } finally {
    if (resumePath) {
      try {
        fs.unlinkSync(resumePath);
      } catch (err) {
        // ignore cleanup errors
      }
    }
  }
};
