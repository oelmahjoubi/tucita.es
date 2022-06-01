var express = require('express');
var router = express.Router();
require('dotenv').config();

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
    Write_Calendar(UserIndicatedName, UserSelectedDay, UserPayed, Write_Calendar_Response, EventCreated)
    res.send(EventCreated);
  })


// /* Para ejecución local, node ./... */
// //Variables a entregar por Frontend
// const UserSelectedDay = new Date();
// UserSelectedDay.setFullYear(2022, 4, 31)
// UserSelectedDay.setHours(13, 0, 0)
// var UserIndicatedName = "Jose Luis";
// var UserPayed = true
// let EventCreated = null;
// // //Llamo a la función escribir en el calendario
//  Write_Calendar(UserIndicatedName, UserSelectedDay, UserPayed, Write_Calendar_Response, EventCreated)



//Esta función es para evaluar la respuesta del método Insert event, que es asíncrono
function Write_Calendar_Response(CalendarWriteResponse) {
    console.log("Evento creado = " + CalendarWriteResponse);
    //Aquí se podría confirmar al usuario que se ha creado la reserva o que ha habido un error
  }  

function Write_Calendar(UserIndicatedName, UserSelectedDay, UserPayed, callback, EventCreated) {
    const ServiceDuration = 59; //minutos

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
module.exports = router;

// Get all the events between two dates
// const getEvents = async (dateTimeStart, dateTimeEnd) => {

//     try {
//         let response = await calendar.events.list({
//             auth: auth,
//             calendarId: calendarId,
//             timeMin: dateTimeStart,
//             timeMax: dateTimeEnd,
//             timeZone: 'Asia/Kolkata'
//         });
    
//         let items = response['data']['items'];
//         return items;
//     } catch (error) {
//         console.log(`Error at getEvents --> ${error}`);
//         return 0;
//     }
// };

// let start = '2020-10-03T00:00:00.000Z';
// let end = '2020-10-04T00:00:00.000Z';

// getEvents(start, end)
//     .then((res) => {
//         console.log(res);
//     })
//     .catch((err) => {
//         console.log(err);
//     });

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