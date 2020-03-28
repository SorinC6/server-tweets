const express = require("express");
const helmet = require("helmet");
const Twitter = require("twitter");
const fs = require("fs");

const server = express();
let ba64 = require("ba64");
const cors = require("cors");

const client = new Twitter({
  consumer_key: "YszswGYtUgKcubTfFIMsy7UGV",
  consumer_secret: "o9I9X8bLMANkTigt3maqZeL5ToPfUJkdLfKAPJK4CgaCl3l6yd",
  access_token_key: "1243942606180098049-7N9S0FlWOPa3dq7zHl6IoeW1xzCPPi",
  access_token_secret: "DvJWYSz6u4XKJkJXnrfWDPCSI8ew65dt7AT0e4B2Funs7"
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
  const { dataUrl, shareId } = req.body;
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
                status: `Codelify image - ShareId ${shareId}`,
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
