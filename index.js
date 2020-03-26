require("dotenv").config();

const dotenv = require("dotenv");
const server = require("./server.js");

const PORT = process.env.PORT || 9000;

console.log(process.env.MY_SECRET);

server.get("/", (req, res) => {
  res.send("<h1>Test Server</h1>");
});

server.listen(PORT, () => {
  console.log(`\n*** Server Running on http://localhost:${PORT} ***\n`);
});
