import OpenAI from "openai";
import sql from "../configs/db.js";

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

    const response = await AI.chat.completions.create({
      model: "gemini-2.5-flash",
      messages: [
        {
          role: "user",
          content:prompt,
        },
      ],
      temperature:0.7,
      max_tokens:length,
    });

    const content = response.choices[0].message.content

    await sql` INSERT INTO creations (user_id,prompt,content,type) values (${userId},${prompt},${content},'article')`;


    res.json({success:true,content})

  } catch(error){
    console.log(error.message);
    res.json({success:false,message:error.message})
  }
};
