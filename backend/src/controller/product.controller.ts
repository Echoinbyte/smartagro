import APIresponse from "../utility/APIresponse";
import asyncHandeler from "../utility/AyncHandler";
import Errorhandler from "../utility/Errorhandler";
import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";
import FormData from "form-data";
import axios from "axios";

const speechToText = async (audioFile: Express.Multer.File) => {
  const API_KEY = process.env.EllevenLabs_API_KEy;
  if (!API_KEY) {
    throw new Errorhandler({
      statusCode: 500,
      message: "Internal server error  API key missing",
    });
  }
  const form = new FormData();
  const fileStream = fs.createReadStream(audioFile.path);
  const filename = audioFile.originalname || path.basename(audioFile.path);

  form.append("file", fileStream, {
    filename,
    contentType: audioFile.mimetype || "audio/mpeg",
  });
  form.append("model_id", "scribe_v1");
  form.append("language_code", "ne");
  try {
    const response = await axios.post(
      "https://api.elevenlabs.io/v1/speech-to-text",
      form,
      {
        headers: {
          "xi-api-key": API_KEY,
          ...form.getHeaders(),
        },
        maxBodyLength: Infinity,
      }
    );
    try {
      fs.unlinkSync(audioFile.path);
    } catch (e) {
      console.warn("Failed to delete temp file:", e);
    }
    return response.data.text;
  } catch (err: any) {
    const apiMsg =
      err.response?.data?.detail?.[0]?.msg ||
      err.response?.data?.detail?.message ||
      err.message ||
      "Unknown error";

    throw new Errorhandler({
      statusCode: err.response?.status || 500,
      message: `Speech-to-text failed: ${apiMsg}`,
    });
  }
};

const AI_enhancer = async (textToEnhance: string) => {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API,
  });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
    Generate a JSON object with:
    note that Everything must be in nepali language 
    -This is the input ${textToEnhance} , nepali message now you have to filter and enhance it 
    - price detected from the 
    - quantity : detect from here input
    - description : this "${textToEnhance}" is a message of voice in nepali language given by the nepali farmers where he describes what he have produced and how much quantity . You have to enhance it and make a good product catalog description in nepali language.
    Respond only with JSON.
    `,
    });
    const rawText = response?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    return JSON.parse(rawText)
  } catch (error) {
    console.log(error);
  }
};

const createProduct = asyncHandeler(async (req, res) => {
  if (!req.file) return;
  const a = await speechToText(req.file);
  const enhanced = await AI_enhancer(a);
  console.log(enhanced);
});

export { createProduct };
