const express = require("express");
const helmet = require("helmet");
const bodyParser = require("body-parser");

const Twitter = require("twitter");
const fs = require("fs");

const cors = require("cors");
const server = express();
let ba64 = require("ba64");

const client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
});

server.use(helmet());
server.use(bodyParser.json({ limit: "50mb" }));
server.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
server.use(express.json());
server.use(cors());

const deleteImage = () => {
  const path = "myimage.png";
  if (fs.existsSync(path)) {
    //file exists
    fs.unlink(path, (err) => {
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
  // console.log(dataUrl);
  deleteImage();
  ba64.writeImage("myimage", dataUrl, (err) => {
    if (err) {
      console.log("Write image error", err);
    }
    console.log("Image saved successfully");

    fs.readFile("processed.png", (err, data) => {
      if (err) {
        console.log("Read file err", err);
      }
      try {
        client.post(
          "media/upload",
          {
            media: data,
          },
          function (error, media, response) {
            if (error) {
              console.log("MEDIA UPLOAD", error);
            } else {
              const status = {
                status: "Just made a tweet",
                media_ids: media.media_id_string,
              };
              client.post("statuses/update", status, function (
                error,
                response
              ) {
                if (error) {
                  console.log("STATUS  UPDATE", error);
                } else {
                  debugger;
                  res.status(200).json({
                    message: response.entities.media[0].display_url,
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

server.get("/img", (req, res) => {
  res.send("<h1>test img</h1>");
});

module.exports = server;
