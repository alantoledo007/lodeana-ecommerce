import filesMiddleware from "@middlewares/filesMiddleware";
import nextConnect from "next-connect";
import imageSize from "image-size";
import { addDocument, getDocuments } from "@lib/mongodb";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
const ObjectId = require("mongodb").ObjectId;

const cloudinary = require("cloudinary").v2;

const handler = nextConnect();
handler.use(filesMiddleware);

const { CLOUDINARY_FOLDER } = process.env;

export const config = {
  api: {
    bodyParser: false,
  },
};

handler.get(
  withApiAuthRequired(async (req, res) => {
    const {
      user: { sub: userId },
    } = getSession(req, res);

    const items = await getDocuments({
      collection: "images",
      find: { user_id: userId },
    });

    res.json({
      message: items,
      success: true,
    });
    return res.status(200).end();
  })
);

handler.post(
  withApiAuthRequired(async (req, res) => {
    const {
      user: { sub: userId },
    } = getSession(req, res);

    const dimensions = imageSize(req.files.image[0].path);
    if (dimensions.width < 512 && dimensions.height < 512) {
      res.json({
        message:
          "El alto o ancho de la imagen no puede ser inferior a 512 pixeles",
        status: "error",
      });
      return res.status(400).end();
    }
    cloudinary.uploader.upload(
      req.files.image[0].path,
      {
        transformation: [
          {
            width: 512,
            height: 512,
            crop: "pad",
            background: "auto:predominant",
          },
        ],
        resource_type: "image",
        folder: CLOUDINARY_FOLDER.replace(":user_id", userId),
      },
      async (error, result) => {
        if (error) {
          res.json({ message: error.message, success: false });
          return res.status(error.http_code).end();
        }
        const data = {
          _id: new ObjectId(),
          asset_id: result.asset_id,
          secure_url: result.secure_url,
          url: result.url,
          public_id: result.public_id,
          original_filename: result.original_filename,
          user_id: userId,
        };
        if (result) {
          await addDocument({
            collection: "images",
            body: JSON.stringify(data),
          });
          res.json({ message: data, success: true });
          return res.status(200).end();
        }
      }
    );
  })
);

export default handler;
// export default async function handler(req, res) {
//   switch (req.method) {
//     case "GET": {
//       return list(req, res);
//     }

//     case "POST": {
//       return upload(req, res);
//     }

//     case "PUT": {
//       return update(req, res);
//     }

//     case "DELETE": {
//       return remove(req, res);
//     }
//   }
// }

//////
async function list(req, res) {}

async function update(req, res) {}

async function remove(req, res) {}
