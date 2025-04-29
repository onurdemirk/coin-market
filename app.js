const express = require("express");
const app = express();
const path = require("node:path");

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const PORT = 3000;

const index = require("./routes/index");

app.use("/", index);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
