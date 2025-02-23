import express from "express";
const app = express();

app.use(express.static("dist", { index: "index.html" }));

// app.get("/", (req, res) => {
//   res.send("Server is ready");
// });

//get a list of 5 jokes

app.get("/api/jokes", (req, res) => {
  const jokes = [
    {
      id: 1,
      title: "joke 1",
      joke: "Why don't scientists trust atoms? Because they make up everything.",
    },
    {
      id: 2,
      title: "joke 2",
      joke: "Why don't scientists trust atoms? Because they make up everything.",
    },
    {
      id: 3,
      title: "joke 3",
      joke: "Why don't scientists trust atoms? Because they make up everything.",
    },
    {
      id: 4,
      title: "joke 4",
      joke: "Why don't scientists trust atoms? Because they make up everything.",
    },
    {
      id: 5,
      title: "joke 5",
      joke: "Why don't scientists trust atoms? Because they make up everything.",
    },
  ];
  res.send(jokes);
});

const port = process.env.PORT || 3034;
app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`);
});
