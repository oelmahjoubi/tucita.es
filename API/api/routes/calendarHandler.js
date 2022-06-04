var express = require('express');
var router = express.Router();
require('dotenv').config();
var moment=require('moment');
require('twix');
var nodemailer = require('nodemailer');

const {google} = require('googleapis');
// Provide the required configuration, aquí hay que llamar a distintos negocios
const CREDENTIALS = JSON.parse(process.env.SULTAN_BARBER_CRED);
const calendarId = process.env.SULTAN_BARBER_CALENDAR_ID;


// Google calendar API settings
const SCOPES = 'https://www.googleapis.com/auth/calendar';
const calendar = google.calendar({version : "v3"});

const auth = new google.auth.JWT(
    CREDENTIALS.client_email,
    null,
    CREDENTIALS.private_key,
    SCOPES
);



/* GET calendar listing. */
router.get('/', function(req, res, next) {
    //Variables a entregar por Frontend
    const UserSelectedDay = new Date();
    UserSelectedDay.setFullYear(2022, 4, 31)
    UserSelectedDay.setHours(13, 0, 0)
    var UserIndicatedName = "Laya";
    var UserPayed = true
    let EventCreated = null;
    Write_Calendar(UserIndicatedName, UserSelectedDay, UserPayed, Write_Calendar_Response, EventCreated)
    res.send(EventCreated);
  });

/* POST calendar listing. */
router.post('/', function(req, res, next) {
    //Variables a entregar por Frontend
    const UserSelectedDay = new Date();
    UserSelectedDay.setFullYear(2022, 04, 31)
    UserSelectedDay.setHours(14, 0, 0)
    var UserIndicatedName = req.body.title;
    var UserPayed = true
    let EventCreated = null;
    //Write_Calendar(UserIndicatedName, UserSelectedDay, UserPayed, Write_Calendar_Response, EventCreated)
    //res.send(EventCreated);

    let availableAppointments = []
    let reservationFreq = { //cada cuanto hay una reserva
        every: 1, //se pueden usar decimales
        time: 'hours',
    }
    let reservationMin = 60; //(Minutos) Primera reserva a partir de estos minutos.
    let reservationMax = 30; //(días) numero de días disponibles para reservar.

    Read_Calendar(reservationMin,reservationMax,reservationFreq,availableAppointments)

    //send_Email()

  })



//Esta función es para evaluar la respuesta del método Insert event, que es asíncrono
function Write_Calendar_Response(CalendarWriteResponse) {
    console.log("Evento creado = " + CalendarWriteResponse);
    //Aquí se podría confirmar al usuario que se ha creado la reserva o que ha habido un error
  }  

function Write_Calendar(UserIndicatedName, UserSelectedDay, UserPayed, callback, EventCreated) {
    const ServiceDuration = 59; //minutos

    // // Your TIMEOFFSET Offset
    // const TIMEOFFSET = '+02:00';

    // Create a new event start date instance for temp uses in our calendar.
    var eventStartTime = UserSelectedDay//= new Date();

     // Create a new event end date instance for temp uses in our calendar.
    const eventEndTime = new Date()
    //eventEndTime.setDate(eventEndTime.getDay() + 1)
    eventEndTime.setFullYear(eventStartTime.getFullYear(), eventStartTime.getMonth(), eventStartTime.getDate()) //mes de 0 - 11
    eventEndTime.setHours(eventStartTime.getHours(), eventStartTime.getMinutes() + ServiceDuration, 0)


    // // Get date-time string for calender
    // const dateTimeForCalander = () => {

    //     let date = new Date();

    //     let year = date.getFullYear();
    //     let month = date.getMonth() + 1;
    //     if (month < 10) {
    //         month = `0${month}`;
    //     }
    //     let day = date.getDate();
    //     if (day < 10) {
    //         day = `0${day}`;
    //     }
    //     let hour = date.getHours();
    //     if (hour < 10) {
    //         hour = `0${hour}`;
    //     }
    //     let minute = date.getMinutes();
    //     if (minute < 10) {
    //         minute = `0${minute}`;
    //     }

    //     let newDateTime = `${year}-${month}-${day}T${hour}:${minute}:00.000${TIMEOFFSET}`;
    //     console.log(newDateTime)

    //     let event = new Date(Date.parse(newDateTime));

    //     let startDate = event;
    //     // Delay in end time is 1
    //     let endDate = new Date(new Date(startDate).setHours(startDate.getHours()+1));

    //     return {
    //         'start': startDate,
    //         'end': endDate
    //     }
    // };

    // Insert new event to Google Calendar
    const insertEvent = async (event) => {

        try {
            let response = await calendar.events.insert({
                auth: auth,
                calendarId: calendarId,
                resource: event
            });
        
            if (response['status'] == 200 && response['statusText'] === 'OK') {
                return 1;
            } else {
                return 0;
            }
        } catch (error) {
            console.log(`Error at insertEvent --> ${error}`);
            return 0;
        }
    };

    // let dateTime = dateTimeForCalander();

    // Event for Google Calendar
    let event = {
        summary: `V1 ${UserIndicatedName}`,
        //location: `3595 California St, San Francisco, CA 94118`, //a indicar en función del negocio
        description: `Pagado = ${UserPayed}`,
        colorId: 1,
            //Color: Blue | ID: 1
            //Color: Green | ID: 2
            // Color: Purple | ID: 3
            //  Color: Red | ID: 4
            //  Color: Yellow | ID: 5
            //  Color: Orange | ID: 6
            //  Color: Turquoise | ID: 7
            //  Color: Gray | ID: 8
            //  Color: Bold Blue | ID: 9
            //  Color: Bold Green | ID: 10
            //  Color: bold red | ID: 11 
        start: {
            //dateTime: dateTime['start'],
            dateTime: eventStartTime,
            timeZone: 'Europe/Madrid'
        },
        end: {
            //dateTime: dateTime['end'],
            dateTime: eventEndTime,
            timeZone: 'Europe/Madrid',
        }
    };

    insertEvent(event)
        .then((res) => {
            console.log(res);
            EventCreated = true;
            callback(EventCreated);
        })
        .catch((err) => {
            console.log(err);
            EventCreated = false
            callback(EventCreated);
        });
        
        
    
        return EventCreated;
}


function Read_Calendar(reservationMin,reservationMax,reservationFreq,availableAppointments){

    /* console.log('______________________________________________________________________________________');
    console.log('______________________________________________________________________________________');
    console.log('______________________________________________________________________________________');
    console.log('______________________________________________________________________________________'); */

    
    // Get all the events between two dates
    const getEvents = async (dateTimeStart, dateTimeEnd) => {

        try {
            let response = await calendar.events.list({
                auth: auth,
                calendarId: calendarId,
                timeMin: dateTimeStart,
                timeMax: dateTimeEnd,
                timeZone: 'Europe/Madrid',
                singleEvents: 'true',
                maxResults: 2500
            });
        
            let items = response['data']['items'];
            return items;
        } catch (error) {
            console.log(`Error at getEvents --> ${error}`);
            return 0;
        }
    };

    //let start = '2022-05-29T00:00:00.000Z';
    //let end = '2022-06-02T21:59:00.000Z';
    let start = new Date()
    let end = new Date(start.valueOf());
    end.setDate(end.getDate()+reservationMax)


    getEvents(start, end)
        .then((res) => {

            //Para loop por horas (tiempo de reserva)
            let checkedPeriod=moment(start.setMinutes(start.getMinutes()+reservationMin)).twix(end).iterate(reservationFreq.every, reservationFreq.time)
            while(checkedPeriod.hasNext())
            {
                appointmentAvailable=true
                let nextHour = new Date(checkedPeriod.next().format())
                let until = new Date(nextHour.valueOf())
                t1=moment(nextHour).twix(until.setMinutes(until.getMinutes()+reservationFreq.every*60)) //periodo de una reserva, inicio y fin
                res.forEach(function(calendarFoundEvent){
                    t2=moment(calendarFoundEvent.start.dateTime).twix(calendarFoundEvent.end.dateTime)
                    if (t1.overlaps(t2) ==true){
                        appointmentAvailable=false;
                    }
                })
                if (appointmentAvailable==true){
                    
                    nextHour=new Date(nextHour).toLocaleString("en-GB", {timeZone: "Europe/Madrid"})
                    availableAppointments.push(nextHour);
                }
            }
            console.log(availableAppointments)

        })
        .catch((err) => {
            console.log(err);
        });
return availableAppointments;
}


function send_Email(){
/*     console.log(CREDENTIALS.mail)
    console.log(CREDENTIALS.mailPass)
    
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: CREDENTIALS.mail,
          pass: CREDENTIALS.mailPass
        }
      });
      
      var mailOptions = {
        from: CREDENTIALS.mail,
        to: 'simo.anaimi@outlook.com',
        subject: 'Reserva confirmada en ...',
        text: 'Aquí pondremos el texto, id de calendario, fecha, hora, como cambiar fecha, como ponerse en contacto con el negocio..'
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });*/
} 


// Delete an event from eventID
// const deleteEvent = async (eventId) => {

//     try {
//         let response = await calendar.events.delete({
//             auth: auth,
//             calendarId: calendarId,
//             eventId: eventId
//         });

//         if (response.data === '') {
//             return 1;
//         } else {
//             return 0;
//         }
//     } catch (error) {
//         console.log(`Error at deleteEvent --> ${error}`);
//         return 0;
//     }
// };

// let eventId = 'hkkdmeseuhhpagc862rfg6nvq4';

// deleteEvent(eventId)
//     .then((res) => {
//         console.log(res);
//     })
//     .catch((err) => {
//         console.log(err);
//     });

module.exports = router;
