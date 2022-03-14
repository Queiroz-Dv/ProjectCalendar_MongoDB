const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const moongose = require("mongoose");
const appointmentService = require("./services/AppointmentService");
const { response } = require("express");
const AppointmentService = require("./services/AppointmentService");

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');

moongose.connect("mongodb://localhost:27017/agendamento", { useNewUrlParser: true, useUnifiedTopology: true })

app.get("/", (request, response) => {
  response.render("index");
});


app.get("/cadastro", (request, response) => {
  response.render("create");
});

app.post("/create", async (request, response) => {

  var status = await appointmentService.Create(
    request.body.name,
    request.body.email,
    request.body.description,
    request.body.cpf,
    request.body.date,
    request.body.time
  )
  if (status) {
    response.redirect("/");
  } else {
    response.send("Ocorreu uma falha");
  }
});

app.get("/getcalendar", async (request, response) => {
  var appointments = await AppointmentService.GetAll(false);
  response.json(appointments);
})

app.listen(9090);