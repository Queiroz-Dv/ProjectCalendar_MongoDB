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
moongose.set('useFindAndModify', false);


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
});

app.get("/event/:id", async (request, response) => {
  var appointment = await AppointmentService.GetById(request.params.id);
  response.render("event", { appo: appointment });
});

app.post("/finish", async (request, response) => {
  var id = request.body.id;
  var result = await AppointmentService.Finish(id);
  response.redirect("/")
});

app.get("/list", async (request, response) => {
  var appos = await AppointmentService.GetAll(true);
  response.render("list", { appos });
});

app.get("/searchresult", async (request, response) => {
  var appos = await AppointmentService.Search(request.query.search)
  response.render("list", { appos });
});

var pollTime = 1000 * 60 * 5;
setInterval(async () => {
  await AppointmentService.SendNotification();
}, pollTime)
app.listen(9090);