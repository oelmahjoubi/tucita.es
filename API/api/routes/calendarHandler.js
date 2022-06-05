express = require('express');
router = express.Router();
require('dotenv').config();
moment = require('moment');
require('twix');
nodemailer = require('nodemailer');

const { google } = require('googleapis');

// Configuración de los credenciales de cada negocio
const CREDENTIALS = JSON.parse(process.env.SULTAN_BARBER_CRED);
const calendarId = process.env.SULTAN_BARBER_CALENDAR_ID;

// Configuración de la API de Google Calendar
const SCOPES = 'https://www.googleapis.com/auth/calendar';
const calendar = google.calendar({ version: "v3" });

const auth = new google.auth.JWT(
    CREDENTIALS.client_email,
    null,
    CREDENTIALS.private_key,
    SCOPES
);

let availableAppointments

// Middleware
router.use(express.urlencoded({ extended: true }))

router.get('/mount', function (req, res, next) {

    availableAppointments = []
    console.log("Mounting...")
    let reservationFreq = { //cada cuanto hay una reserva
        every: 1, //se pueden usar decimales
        time: 'hours',
    }

    let reservationMin = 60; //(Minutos) Primera reserva a partir de estos minutos.
    let reservationMax = 30; //(días) numero de días disponibles para reservar.

    readCalendar(reservationMin, reservationMax, reservationFreq)
})

/* GET calendar listing. */
router.get('/:selecteddate', function (req, res, next) {

    let availableAppointmentsHours = []
    let userSelectedDateData = req.params.selecteddate.split("-")
    let userSelectedDate = userSelectedDateData[2] + "/" + userSelectedDateData[1] + "/" + userSelectedDateData[0]

    console.log("Available hours A: " + availableAppointmentsHours)

    availableAppointments.forEach(function (element) {
        if (element.substring(0, 10) == userSelectedDate) {
            availableAppointmentsHours.push(element.substring(11, 17)) // Obtener las horas disponibles para la fecha selecionada
        }

        //console.log("User selected date: " + userSelectedDate)
        //console.log("Substring: " + element.substring(0, 10))
    })

    console.log("Available hours B: " + availableAppointmentsHours)
    res.send(availableAppointmentsHours);
});

/* POST calendar listing. */
router.post('/', function (req, res) {

    //Variables a entregar por Frontend
    let userSelectedDate = new Date();
    let date = req.body.userSelectedDate.split("-")
    let hour = req.body.userSelectedHour.split(":")
    let userIndicatedName = req.body.userName;
    let userPayed = true
    let eventCreated = null;
    userSelectedDate.setFullYear(date[0], date[1] - 1, date[2])
    userSelectedDate.setHours(hour[0], hour[1], 0)
    //console.log("Fecha de la reserva = " + req.body);
    console.dir(date[0]);
    console.log("Hora:  = " + hour[0]);
    console.log("Minutos:  = " + hour[1]);

    console.log("Evento creado = " + req.body.userSelectedDate);
    addEventToCalendar(userIndicatedName, userSelectedDate, userPayed, writeCalendarResponse, eventCreated)

    res.send(eventCreated);
})

//Esta función es para evaluar la respuesta del método Insert event, que es asíncrono
function writeCalendarResponse(writeCalendarResponse) {
    console.log("Evento creado = " + writeCalendarResponse);
    //Aquí se podría confirmar al usuario que se ha creado la reserva o que ha habido un error
}

function addEventToCalendar(userIndicatedName, userSelectedDate, userPayed, callback, eventCreated) {
    console.log('______________________________________________________________________________________');
    console.log('______________________________________________________________________________________');
    console.log('______________________________________________________________________________________');
    console.log('______________________________________________________________________________________'); 
    const serviceDuration = 59; //minutos

    // // Your TIMEOFFSET Offset
    // const TIMEOFFSET = '+02:00';

    // Create a new event start date instance for temp uses in our calendar.
    var eventStartTime = userSelectedDate//= new Date();

    // Create a new event end date instance for temp uses in our calendar.
    const eventEndTime = new Date()
    //eventEndTime.setDate(eventEndTime.getDay() + 1)
    eventEndTime.setFullYear(eventStartTime.getFullYear(), eventStartTime.getMonth(), eventStartTime.getDate()) //mes de 0 - 11
    eventEndTime.setHours(eventStartTime.getHours(), eventStartTime.getMinutes() + serviceDuration, 0)

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

    getEvents(eventStartTime, eventEndTime)
        .then((res) => {
            if(res.length !== 0){
                console.log('¡Ups! parece que se te han adelantado, esta hora ya está reservada!')
                eventCreated=false
            }
            else {
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

                // Crear el objecto evento a añadir
                let event = {
                    summary: `V1 ${userIndicatedName}`,
                    // location: `3595 California St, San Francisco, CA 94118`, //a indicar en función del negocio
                    description: `Pagado = ${userPayed}`,
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
                        dateTime: eventStartTime,
                        timeZone: 'Europe/Madrid'
                    },
                    end: {
                        dateTime: eventEndTime,
                        timeZone: 'Europe/Madrid',
                    }
                };

                insertEvent(event)
                    .then((res) => {
                        console.log(res);
                        eventCreated = true;
                        callback(eventCreated);
                    })
                    .catch((err) => {
                        console.log(err);
                        eventCreated = false
                        callback(eventCreated);
                    });
            }
            
        })
        .catch((err) => {
            console.log(err);
        });

    return eventCreated;
}


function readCalendar(reservationMin, reservationMax, reservationFreq) {
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
    end.setDate(end.getDate() + reservationMax)


    getEvents(start, end)
        .then((res) => {

            //Para loop por horas (tiempo de reserva)
            let checkedPeriod = moment(start.setMinutes(start.getMinutes() + reservationMin)).twix(end).iterate(reservationFreq.every, reservationFreq.time)
            while (checkedPeriod.hasNext()) {
                appointmentAvailable = true
                let nextHour = new Date(checkedPeriod.next().format())
                let until = new Date(nextHour.valueOf())
                t1 = moment(nextHour).twix(until.setMinutes(until.getMinutes() + reservationFreq.every * 60)) //periodo de una reserva, inicio y fin
                res.forEach(function (calendarFoundEvent) {
                    t2 = moment(calendarFoundEvent.start.dateTime).twix(calendarFoundEvent.end.dateTime)
                    if (t1.overlaps(t2) == true) {
                        appointmentAvailable = false;
                    }
                })
                if (appointmentAvailable == true) {

                    nextHour = new Date(nextHour).toLocaleString("en-GB", { timeZone: "Europe/Madrid" })
                    availableAppointments.push(nextHour);
                }
            }
            //console.log(availableAppointments)

        })
        .catch((err) => {
            console.log(err);
    });
return availableAppointments;
}


function sendEmail(){
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