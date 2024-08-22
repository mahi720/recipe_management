const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./helpers/db");
require("dotenv").config();



app.use(express.json());
app.use(cors());

const userRoute = require("./routes/userRouter");
const thirdPartyRoute = require('./routes/thirdPartyRoute')

app.use("/user", userRoute);
app.use('/api', thirdPartyRoute)

// const PORT = process.env.PORT;
const PORT = 5000;
app.listen(PORT, async () => {
  try {
      await connection;
      console.log(`Running on server ${PORT}`);
  }
  catch (ex) {
      console.log(ex);
  }
});
