const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("post"));

app.get("/post", (req, res) => {
  res.sendFile(path.join(__dirname, "post", "post.html"));
});

app.post("/post", (req, res) => {
  const filePath = path.join(__dirname, "post.json");

  let data = [];
  if (fs.existsSync(filePath)) {
    data = JSON.parse(fs.readFileSync(filePath));
  }

  data.push({ title: req.body.title });

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  res.send("Salvato");
});

app.listen(PORT, () => {
  console.log(`Server avviato su http://localhost:${PORT}`);
});
