const express = require("express");
const PORT = process.env.PORT || 5000;
const cors = require("cors");
const app = express();

app.use(cors());

const setlistRoutes = require("./api/routes/setlist"); //bring in our user routes
app.use("/setlist", setlistRoutes);


app.listen(PORT, () => {
  console.log(`App is running on ${PORT}`);
});