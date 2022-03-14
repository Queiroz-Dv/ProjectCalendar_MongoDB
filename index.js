const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const moongose = require("mongoose");
const { request } = require("http");

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');

moongose.connect("mongodb://localhost:27017/agendamento", { useNewUrlParser: true, useUnifiedTopology: true })

app.get("/", (request, response) => {
  response.send("Testando");
});


app.get("/cadastro", (request, response) => {
  response.render("create");
});
app.listen(9090);