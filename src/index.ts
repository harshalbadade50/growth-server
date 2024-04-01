import { Application } from "./Application.js";

const PORT = process.env.PORT || 4000;
const server = await new Application().setup();

console.log("Running on Port - ", PORT);

server.listen(PORT, () => {
  console.log("Server is running at port 4000");
});
