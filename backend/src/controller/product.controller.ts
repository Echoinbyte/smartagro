import APIresponse from "../utility/APIresponse";
import asyncHandeler from "../utility/AyncHandler";
import Errorhandler from "../utility/Errorhandler";
import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";
import FormData from "form-data";
import axios from "axios";
import { Request } from "express";
import { prisma } from "../Database/ConnectDB";

interface product {
  productName: string;
  price: number;
  description: string;
  sellerId: string;
}

// Elleven labs speech to text 
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

// Gemini text enhancer + JSON manager
const AI_enhancer = async (textToEnhance: string) => {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API,
  });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
    Generate a JSON object with:
    note that Everything must be in nepali language in UTF-8 format like the nepali characters should be clear and easily readable
    -This is the input ${textToEnhance} , nepali message now you have to filter and enhance it 
    - price detected from the 
    - quantity : detect from here input
    - expectedLifeSpan : detect from the input vege or fruit type / give maximum
    - name : detect from input (Both eng and Nepali) like {english : englishName , nepali : NepaliName} 
    - description : this "${textToEnhance}" is a message of voice in nepali language given by the nepali farmers where he describes what he have produced and how much quantity . You have to enhance it and make a good product catalog description in nepali language.
    Respond only with JSON.
    `,
    });
    const rawText = response?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    return JSON.parse(rawText.trim().replace(/^```json|```$/g, ""));
  } catch (error) {
    console.log(error);
  }
};

const createProductFromVoice = asyncHandeler(async (req, res) => {
  const voiceAudio = req.file;
  if (voiceAudio) {
    try {
      const speechToTextResponse = await speechToText(voiceAudio);
      const inhanced_response = await AI_enhancer(speechToTextResponse);
      return res.status(200).json(
        new APIresponse({
          data: inhanced_response,
          statusCode: 200,
          message: "Voice audio fetched sucessfully !",
        })
      );
    } catch (error) {
      console.log("error : ", error);
      throw new Errorhandler({
        message: "Internal server error",
        statusCode: 500,
      });
    }
  } else {
    throw new Errorhandler({
      message: "Voice audio not received",
      statusCode: 404,
    });
  }
});

const createProduct = asyncHandeler(
  async (req: Request<{}, {}, product>, res) => {
    const { description, price, productName, sellerId } = req.body;
    if (
      [description, price, productName, sellerId].some(
        (field) => field === "" || !field
      )
    ) {
      throw new Errorhandler({
        statusCode: 404,
        message: "All fields are required !",
      });
    }
    try {
      const createProduct = await prisma.product.create({
        data: {
          productName: productName,
          price: Number(price),
          description: description,
          sellerId: sellerId,
        },
      });
      if (!createProduct) {
        throw new Errorhandler({
          message: "Internal server occured ! (create product)",
          statusCode: 500,
        });
      }
      return res.status(200).json(
        new APIresponse({
          statusCode: 200,
          message: "Product created sucessfully",
          data: createProduct,
        })
      );
    } catch (error) {
      throw new Errorhandler({
        statusCode: 500,
        message: "Internal Server error !",
      });
    }
  }
);

export { createProduct, createProductFromVoice };
