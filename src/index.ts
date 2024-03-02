import { Application } from "./Application";

const server = new Application().setup();

console.log("process.env.NODE_ENV - ", process.env.NODE_ENV, process.env.PORT);

server.listen(4000, () => {
  console.log("Server is running at port 4000");
});
