import express from "express";

const app = express();
const PORT = 5050;

app.get("/", (req, res) => {
  res.send("OK");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});