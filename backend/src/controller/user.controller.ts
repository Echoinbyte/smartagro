import { Request, Response } from "express";
import asyncHandeler from "../utility/AyncHandler";
import { prisma } from "../Database/ConnectDB";
import APIresponse from "../utility/APIresponse";
import Errorhandler from "../utility/Errorhandler";
import uploadOnCloud from "../utility/uploadToCloudinary";

interface createUser {
  username: string;
  contact: number;
  gmail: string;
  identity: "user" | "farmer";
  latitude?: number;
  longitude?: number;
}

const createUser = asyncHandeler(
  async (req: Request<{}, {}, createUser>, res) => {
    const { username, contact, gmail, identity, latitude, longitude } =
      req.body;
    if (!username) {
      throw new Errorhandler({
        statusCode: 404,
        message: "Username is required",
      });
    }
    if (!contact) {
      throw new Errorhandler({
        statusCode: 404,
        message: "Conatct is required",
      });
    }
    if (!identity) {
      throw new Errorhandler({
        statusCode: 404,
        message: "identity is required",
      });
    }
    if (identity === "user") {
      const createUser = await prisma.user.create({
        data: {
          username: username,
          contact: contact,
          gmail: gmail,
        },
      });
      if (!createUser) {
        throw new Errorhandler({
          statusCode: 400,
          message: "User not created !",
        });
      }
      return res.status(200).json(
        new APIresponse({
          statusCode: 200,
          message: "User created sucessfully",
          data: createUser,
        })
      );
    }
    if (identity === "farmer") {
      if (!(latitude && longitude)) {
        throw new Errorhandler({
          statusCode: 404,
          message: "Latitude and longitude is required",
        });
      }

      let fetched_address;
      try {
        // Getting live location of the seller from his GPS tracked lat and long
        const apiRes = await fetch(
          `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=89df02ba673d478597b70cb330b159e7`
        );
        const data = await apiRes.json();
        const addressObject = data.features[0].properties;
        if (data) {
          fetched_address = `${addressObject.city},${addressObject.county}`;
        } else {
          fetched_address =
            "एक त्रुटि देखा पर्‍यो, कृपया म्यानुअल रूपमा स्थान इनपुट गर्नुहोस्";
        }
      } catch (error) {
        fetched_address =
          "एक त्रुटि देखा पर्‍यो, कृपया म्यानुअल रूपमा स्थान इनपुट गर्नुहोस्";
      }

      const createFarmer = await prisma.farmer.create({
        data: {
          username: username,
          contact: contact,
          gmail: gmail,
          address: fetched_address,
        },
      });
      if (!createFarmer) {
        throw new Errorhandler({
          statusCode: 400,
          message: "Farmer not created !",
        });
      }
      return res.status(200).json(
        new APIresponse({
          statusCode: 200,
          message: "Farmer created sucessfully",
          data: createFarmer,
        })
      );
    }
  }
);

const verifyFarmerKYC = asyncHandeler(async (req, res) => {
  const { farmer_id } = req.body;
  const files = req.files as {
    [fieldname: string]: Express.Multer.File[];
  };
  const citizenship_front = files["citizenship-front"]?.[0];
  const citizenship_back = files["citizenship-back"]?.[0];
  if (!(citizenship_front && citizenship_back)) {
    throw new Errorhandler({
      statusCode: 404,
      message: "Files not found",
    });
  }
  const uploadCitizenshipFront = await uploadOnCloud(citizenship_front.path);
  const uploadCitizenshipBack = await uploadOnCloud(citizenship_back.path);
  if (!(uploadCitizenshipFront && uploadCitizenshipBack)) {
    throw new Errorhandler({
      statusCode: 400,
      message: "Cannot upload the files",
    });
  }
  const updateSellerDB = await prisma.farmer.update({
    where: {
      farmerID: farmer_id,
    },
    data: {
      citizenShip_front: uploadCitizenshipFront.url,
      citizenShip_back: uploadCitizenshipBack.url,
      verified: true,
    },
  });
  return res.status(200).json(
    new APIresponse({
      statusCode: 200,
      message: "KYC uploaded sucessfully wait for verification",
      data: updateSellerDB,
    })
  );
});

export { createUser, verifyFarmerKYC };
