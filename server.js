const express = require("express");
const helmet = require("helmet");
const Twitter = require("twitter");

const cors = require("cors"); //needed to disable sendgrid security
const server = express();
const fs = require("fs");
//sendgrid api key

// sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

server.use(helmet());
server.use(express.json());
server.use(cors());

const imageData = fs.readFileSync("./media/whyBlockchain.png");

server.post("/imagetotweet", (req, res) => {
  console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", req.body);
  const { img } = req.body;
  console.log(img);
  debugger;
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
          console.log(media);
          debugger;
          // console.log(media);
          // console.log(response);
          client.post("statuses/update", status, function(error, response) {
            if (error) {
              console.log(error);
            } else {
              debugger;
              res.status(200).json({
                message: `Created with Codelify ${response.entities.media[0].display_url}`
              });
              console.log("Media", response.entities.media[0].display_url);
            }
          });
        }
      }
    );
  } catch (error) {
    res.status(500).json({ error: "error trying to tweet" });
  }
});

// client.post(
//   "media/upload",
//   {
//     media: imageData
//   },
//   function(error, media, response) {
//     if (error) {
//       console.log(error);
//     } else {
//       const status = {
//         status: "I tweeted from Node.js!",
//         media_ids: media.media_id_string
//       };
//       console.log(media);
//       // console.log(media);
//       // console.log(response);
//       client.post("statuses/update", status, function(error, response) {
//         if (error) {
//           console.log(error);
//         } else {
//           console.log("Media", response.entities.media[0].display_url);
//         }
//       });
//     }
//   }
// );

server.get("/img", (req, res) => {
  res.send("<h1>test img</h1>");
});

module.exports = server;
