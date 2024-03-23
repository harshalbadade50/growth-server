import { Application } from "./Application";

const PORT = process.env.PORT || 4000;
const server = new Application().setup();

console.log("port process.env.NODE_ENV - ", PORT);

server.listen(PORT, () => {
  console.log("Server is running at port 4000");
});
