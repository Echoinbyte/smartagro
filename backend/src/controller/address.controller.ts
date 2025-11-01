import { Request } from "express";
import asyncHandeler from "../utility/AyncHandler";
import Errorhandler from "../utility/Errorhandler";
import { prisma } from "../Database/ConnectDB";
import APIresponse from "../utility/APIresponse";

interface address {
  province: string;
  district: string;
  localLevel: string;
  street: string;
  costumerId: string;
}

const createAddress = asyncHandeler(
  async (req: Request<{}, {}, address>, res) => {
    console.log("working ");
    const { province, district, localLevel, street, costumerId } = req.body;
    if (
      [province, district, localLevel, street, costumerId].some(
        (field) => field === undefined || ""
      )
    ) {
      throw new Errorhandler({
        statusCode: 404,
        message: "All fields are required!",
      });
    }
    const createAddress = await prisma.address.create({
      data: {
        district: district,
        localLevel: localLevel,
        province: province,
        street: street,
        costumerId: costumerId,
      },
    });
    if (!createAddress) {
      throw new Errorhandler({
        statusCode: 500,
        message: "Internal server error",
      });
    }
    return res.status(200).json(
      new APIresponse({
        statusCode: 200,
        message: "Address Created sucessfully !",
        data: createAddress,
      })
    );
  }
);

export { createAddress };
