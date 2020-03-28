const express = require("express");
const helmet = require("helmet");
const Twitter = require("twitter");
const fs = require("fs");

const server = express();
let ba64 = require("ba64");
const cors = require("cors");

const client = new Twitter({
  consumer_key: "rOzeTYuUv4RI97rle3fRi64HF",
  consumer_secret: "myuBSyJuvR92Rc8vUG1JVJ5cAA9yrcUU4xc4cVrGDkVVcPELFU",
  access_token_key: "1241376150041112577-ugvNSScEIoRc2iwa4FDi0cZowAKGzq",
  access_token_secret: "XcZWWasaD1GCLuQ2N4nv4mTywuxv6mWIqHtLAQIQNE4H0"
});

server.use(helmet());
server.use(express.json());
server.use(cors());

const deleteImage = () => {
  const path = "./media/myimage.png";
  if (fs.existsSync(path)) {
    //file exists
    fs.unlink(path, err => {
      if (err) {
        console.error(err);
        return;
      }
      //file removed
    });
  }
};

server.post("/imagetotweet", async (req, res) => {
  const { dataUrl } = req.body;
  // const imageData = null;
  console.log(dataUrl);
  deleteImage();
  ba64.writeImage("myimage", dataUrl, err => {
    if (err) {
      console.log("Write image error", err);
    }
    console.log("Image saved successfully");
    fs.readFile("myimage.png", (err, data) => {
      if (err) {
        console.log("Read file err", err);
      }
      try {
        client.post(
          "media/upload",
          {
            media: data
          },
          function(error, media, response) {
            if (error) {
              console.log(error);
            } else {
              const status = {
                status: "I tweeted from Node.js!",
                media_ids: media.media_id_string
              };
              client.post("statuses/update", status, function(error, response) {
                if (error) {
                  console.log(error);
                } else {
                  debugger;
                  res.status(200).json({
                    message: response.entities.media[0].display_url
                  });
                  // console.log("Media", response.entities.media[0].display_url);
                }
              });
            }
          }
        );
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
      // deleteImage();
    });
  });
});
// if (err) {
//   console.log(err);
//   res.status(500).json({ error: "To many tweets, try again later" });
// }

// do stuff

server.get("/img", (req, res) => {
  res.send("<h1>test img</h1>");
});

module.exports = server;
