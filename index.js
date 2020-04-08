const server = require("./server");

const port = 7000;

server.listen(port, () => {
  console.log(`The API is Running on port ${port}`);
});
