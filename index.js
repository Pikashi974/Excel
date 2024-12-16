const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const port = 4040;

require("dotenv").config();

app.use("/src", express.static(__dirname + "/src"));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/src/html/index.html");
});
app.get("/login", (req, res) => {
  process.env.API_TOKEN = "";
  res.sendFile(__dirname + "/src/html/login.html");
});

app.post("/login", async (req, res) => {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify(req.body);
  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  let jsonOutput = await fetch(
    "http://localhost:1337/api/auth/local",
    requestOptions
  )
    .then((response) => response.json())
    .catch((error) => console.log("error", error));

  process.env.API_TOKEN = jsonOutput.jwt;

  res.send(jsonOutput);
});
app.post("/register", async (req, res) => {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify(req.body);
  console.log(raw);

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  let jsonOutput = await fetch(
    "http://localhost:1337/api/auth/local/register",
    requestOptions
  )
    .then((response) => response.json())
    .catch((error) => console.log("error", error));

  res.send(jsonOutput);
});

app.get("/favicon.ico", (req, res) => {
  res.sendFile(__dirname + "/src/img/favicons/favicon.ico");
});
app.get("/data/:obj", async (req, res) => {
  var myHeaders = new Headers();

  myHeaders.append("Authorization", `Bearer ${process.env.API_TOKEN}`);
  // myHeaders.append("Authorization", req.headers.authorization);

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };
  let firstRequest = await fetch(
    "http://localhost:1337/api/" +
      req.params.obj +
      "?pagination[page]=1&pagination[pageSize]=1",
    requestOptions
  )
    .then((response) => response.json())
    .catch((error) => console.log("error", error));

  let jsonOutput = await fetch(
    "http://localhost:1337/api/" +
      req.params.obj +
      "?populate=*&pagination[start]=0&pagination[limit]=" +
      firstRequest.meta.pagination.total,
    requestOptions
  )
    .then((response) => response.json())
    .catch((error) => console.log("error", error));

  res.send(jsonOutput);
});
app.get("/exercice:id", (req, res) => {
  res.sendFile(__dirname + "/src/html/exercice" + req.params.id + ".html");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
