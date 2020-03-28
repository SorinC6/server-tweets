const express = require("express");
const helmet = require("helmet");
const Twitter = require("twitter");
const fs = require("fs");
const ba64 = require("ba64");

const cors = require("cors");
const server = express();

const client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

server.use(helmet());
server.use(express.json());
server.use(cors());

const deleteImage = () => {
  const path = "./media/myimage.png";
  fs.unlink(path, err => {
    if (err) {
      console.error(err);
      return;
    }
    //file removed
  });
};

server.post("/imagetotweet", async (req, res) => {
  const { dataUrl } = req.body;

  ba64.writeImage("./media/myimage", dataUrl, function(err, i) {
    if (err) {
      res.status(500).json({ error: "To many tweets, try again later" });
    }
    console.log("Image saved successfully");

    // do stuff
    const imageData = fs.readFileSync("./media/myimage.png");
    try {
      client.post(
        "media/upload",
        {
          media: imageData
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
      res.status(500).json({ error: "error trying to tweet" });
    }
    deleteImage();
  });
});

server.get("/img", (req, res) => {
  res.send("<h1>test img</h1>");
});

module.exports = server;
