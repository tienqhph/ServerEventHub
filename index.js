const express = require("express");

const cors = require("cors");
const authRouter = require("./src/routers/authRouter");
const connectToDb = require("./src/api/connectBD");
const eventRouter = require("./src/routers/eventRouter");
const app = express();

require("dotenv").config();
app.use(cors());

connectToDb();
app.use(express.json());
const PORT = 3001;

app.use("/auth", authRouter);
app.use("/event", eventRouter);

app.listen(PORT, () => {
  console.log(`Server stating at http://localhost:${PORT}`);
});
