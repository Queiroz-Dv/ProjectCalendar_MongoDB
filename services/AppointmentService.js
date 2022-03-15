var appointment = require("../models/Appointment");
var mongoose = require("mongoose");
var AppointmentFactory = require("../factories/AppointmentFactory")
const Appo = mongoose.model("Appointment", appointment);

class AppointmentService {

  async Create(name, email, description, cpf, date, time) {
    var newAppo = new Appo({
      name,
      email,
      description,
      cpf,
      date,
      time,
      finished: false
    });
    try {
      await newAppo.save();
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async GetAll(showFinished) {

    if (showFinished) {
      return await Appo.find();
    } else {
      //Primeiro pesquisa todas as consultas no banco de dados
      //menos as que estão finalizadas
      var appos = await Appo.find({ 'finished': false });
      var appointments = [];

      appos.forEach(appointment => {
        if (appointment.date != undefined) {
          appointments.push(AppointmentFactory.Build(appointment))
        }
      });
      return appointments;
    }
  }

  async GetById(id) {
    try {
      var event = await Appo.findOne({ '_id': id });
      return event;
    } catch (error) {
      console.log(error);
    }
  }

  async Finish(id) {
    try {
      await Appo.findByIdAndUpdate(id, { finished: true });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async Search(query) {
    try {
      var appos = Appo.find().or([{ email: query }, { cpf: query }])
      return appos;
    } catch (error) {
      console.log(error);
      return [];
    }
  }
}
module.exports = new AppointmentService();