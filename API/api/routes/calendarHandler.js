express = require('express');
router = express.Router();
require('dotenv').config();
moment = require('moment');
require('twix');
nodemailer = require('nodemailer');
let Payment = require("./redsysPayments");


const { google } = require('googleapis');
const userPayed = false;

// Configuración de los credenciales de cada negocio
const CREDENTIALS = JSON.parse(process.env.SULTAN_BARBER_CRED);
const calendarId = process.env.SULTAN_BARBER_CALENDAR_ID;

// Configuración de la API de Google Calendar
const SCOPES = 'https://www.googleapis.com/auth/calendar';
const calendar = google.calendar({ version: "v3" });
let availableAppointments
const auth = new google.auth.JWT(
    CREDENTIALS.client_email,
    null,
    CREDENTIALS.private_key,
    SCOPES
);

// Middleware
router.use(express.urlencoded({ extended: true }))

/* 
Declarando el metódo HTTP GET, se encarga de capturar e administrar los datos iniciales al frontend. 
*/
router.get('/mount', async(req, res, next) => {

    let serverResponse = createPaymentRequest()
    availableAppointments = []
    
    let reservationFreq = { //cada cuanto hay una reserva
        every: 1, //se pueden usar decimales
        time: 'hours',
    }

    let reservationMin = 60; //(Minutos) Primera reserva a partir de estos minutos.
    let reservationMax = 30; //(días) numero de días disponibles para reservar.

    availableAppointments = await readCalendar(reservationMin, reservationMax, reservationFreq)

    serverResponse["availableAppointments"] = availableAppointments

    res.send(serverResponse);

    console.log('______________________________________________________________________________________');
    console.log('______________________________________________________________________________________');
    console.log('______________________________________________________________________________________');
    console.log('______________________________________________________________________________________'); 
    console.log("Calendario Leído..." + Date())
})


/* 
Declarando el metódo HTTP POST, se encarga de capturar los datos de una reserva enviados por el frontend. 
*/
router.post('/', function (req, res) {

    //Variables a entregar por Frontend
    let userSelectedDate = new Date();
    let date = req.body.userSelectedDate.split("-")
    let hour = req.body.userSelectedHour.split(":")
    let userIndicatedName = req.body.userName;
    let eventCreated = null;
    let userEmail = req.body.userEmail

    userSelectedDate.setFullYear(date[0], date[1] - 1, date[2])
    userSelectedDate.setHours(hour[0], hour[1], 0)
    // console.log("Fecha de la reserva = " + req.body);
    // console.dir(date[0]);
    // console.log("Hora:  = " + hour[0]);
    // console.log("Minutos:  = " + hour[1]);

    //console.log("Evento creado = " + req.body.userSelectedDate);
    addEventToCalendar(userIndicatedName, userSelectedDate, userPayed, writeCalendarResponse, eventCreated,userEmail)

    res.send(eventCreated);
})

/* 
Declarando el metódo HTTP POST, se encarga de capturar los datos de la notificación online de redsys. 
*/
router.post('/notificacion', function (req, res) {

    const redsys = new Payment()
    const merchantParams = req.Ds_MerchantParameters || req.DS_MERCHANTPARAMETERS;
    const signature = req.Ds_Signature || req.DS_SIGNATURE;
    
    const merchantParamsDecoded = redsys.decodeMerchantParameters(merchantParams);
    const merchantSignatureNotif = redsys.createMerchantSignatureNotif("sq7HjrUOBfKmC576ILgskD5srU870gJ7", merchantParams);
    const dsResponse = parseInt(merchantParamsDecoded.Ds_Response || merchantParamsDecoded.DS_RESPONSE, 10);
    
    if (redsys.merchantSignatureIsValid(signature, merchantSignatureNotif) && dsResponse > -1 && dsResponse < 100) {
        console.log("Pago OK")
    } else {
        console.log("Pago KO")
    }
})

/* 
Declarando la función 'createPaymentRequest', se encarga de preparar la solicitud de pago que se 
enviará mediante el metodo POST a la API de Redsys 
*/
function createPaymentRequest(){
    const redsys = new Payment()
    const mParams = {
        DS_MERCHANT_AMOUNT: "1200",
        DS_MERCHANT_ORDER: "123455446",
        DS_MERCHANT_MERCHANTCODE: "999008881",
        DS_MERCHANT_CURRENCY: "978",
        DS_MERCHANT_TRANSACTIONTYPE: "0",
        DS_MERCHANT_TERMINAL: "001",
        DS_MERCHANT_MERCHANTURL: "http://192.168.1.132:9065/calendartHandler/notificacion",
        DS_MERCHANT_URLOK: "http://192.168.1.130:3002/pagorealizado",
        DS_MERCHANT_URLKO: "http://192.168.1.130:3002/pagonorealizado"
    };

    const signature = redsys.createMerchantSignature("sq7HjrUOBfKmC576ILgskD5srU870gJ7", mParams);
    const merchantParameters = redsys.createMerchantParameters(mParams);
    const paymentRequest = {
        signature: signature,
        merchantParameters: merchantParameters
    }

    console.log("Signature: " + signature)
    console.log("Parameters: " + merchantParameters)

    return paymentRequest;
}

/* 
Declarando la función 'writeCalendarResponse', se encarga de evaluar la respuesta de la función insertEvent, que es asíncrono. 
*/
function writeCalendarResponse(writeCalendarResponse) {
    console.log("Evento creado = " + writeCalendarResponse);
    //Aquí se podría confirmar al usuario que se ha creado la reserva o que ha habido un error
}

/* 
Declarando la función 'addEventToCalendar', se encarga de añadir un nuevo evento al calendario. 
*/
function addEventToCalendar(userIndicatedName, userSelectedDate, userPayed, callback, eventCreated,userEmail) {
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
    console.log('Event start time ' + eventStartTime)
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
                            return response;
                        } else {
                            return 0;
                        }
                    } catch (error) {
                        console.log(`Error at insertEvent --> ${error}`);
                        return 0;
                    }
                };

                var currentdate = new Date(); 
                // Crear el objecto evento a añadir
                let event = {
                    summary: `${currentdate} ${userIndicatedName}`,
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
                        // console.log(res);
                        eventCreated = true;
                        callback(eventCreated);
                        // console.log(res.data.id)
                        //sendEmail(userEmail,eventStartTime,userPayed,res.data.id,userIndicatedName)
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

/* 
Declarando la función 'readCalendar', se encarga de leer los eventos del calendario, es una función asíncrona. 
*/
async function readCalendar(reservationMin, reservationMax, reservationFreq) {
    /* console.log('______________________________________________________________________________________');
    console.log('______________________________________________________________________________________');
    console.log('______________________________________________________________________________________');
    console.log('______________________________________________________________________________________'); */
    
    let availableAppointments = [];

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


    await getEvents(start, end)
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
            return availableAppointments;
            //callback(availableAppointments)
            //resu.send(availableAppointments)
        })
        .catch((err) => {
            console.log(err);
    });
    //console.log(availableAppointments)
    return availableAppointments;
}

/* 
Declarando la función 'sendEmail', se encarga de enviar un correo electrónico al usuario con los detalles de la reserva. 
*/
function sendEmail(userEmail,eventStartTime,userPayed,reservationId,userIndicatedName){
    // console.log('______________________________________________________________________________________');
    // console.log('______________________________________________________________________________________');
    // console.log('______________________________________________________________________________________');
    // console.log('______________________________________________________________________________________'); 

    //tuscitas-sultan-barber-api
    //Sultan Barber Api

    // //Para obtención de token
    // const credentials = JSON.parse(process.env.SULTAN_BARBER_GMAIL_CRED);
    // const { google } = require('googleapis');
    // //const credentials = require('./credentials.json');
    
    // const { client_secret, client_id, redirect_uris } = credentials.installed;
    // const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    
    // const GMAIL_SCOPES = ['https://www.googleapis.com/auth/gmail.send'];
    
    // const url = oAuth2Client.generateAuthUrl({
    //   access_type: 'offline',
    //   prompt: 'consent',
    //   scope: GMAIL_SCOPES,
    // });
    
    // console.log('Authorize this app by visiting this url:', url);

    // const { google } = require('googleapis');
    // const path = require('path');
    // const fs = require('fs');
    // const credentials = JSON.parse(process.env.SULTAN_BARBER_GMAIL_CRED);
    // //const credentials = require('./credentials.json');

    // // Replace with the code you received from Google
    // const code = '4/0AX4XfWjg7Pi_gQWj89MF8cnTu7Wc2DxNrywrgQVj7Ms2rPj4EW9td2hNHOPiabmLGSoKaQ';
    // const { client_secret, client_id, redirect_uris } = credentials.installed;
    // const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    // console.log(`
    // ${client_id}
    // ${client_secret}
    // ${redirect_uris[0]}
    // `)
    // oAuth2Client.getToken(code).then(({ tokens }) => {
    // //console.log(tokens)
    // const tokenPath = path.join(__dirname, 'token.json');
    // fs.writeFileSync(tokenPath, JSON.stringify(tokens));
    // console.log('Access token and refresh token stored to token.json');
    // });

    
    const credentials = JSON.parse(process.env.SULTAN_BARBER_GMAIL_CRED);
    const tokens = JSON.parse(process.env.TOKENS);
    const { google } = require('googleapis');
    const MailComposer = require('nodemailer/lib/mail-composer');
    
    //const credentials = require('./credentials.json');
    //const tokens = require('./token.json');
  
    const getGmailService = () => {
      const { client_secret, client_id, redirect_uris } = credentials.installed;
      const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
      oAuth2Client.setCredentials(tokens);
      const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
      return gmail;
    };
    
    const encodeMessage = (message) => {
      return Buffer.from(message).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    };
    
    const createMail = async (options) => {
      const mailComposer = new MailComposer(options);
      const message = await mailComposer.compile().build();
      return encodeMessage(message);
    };
    
    const sendMail = async (options) => {
      const gmail = getGmailService();
      const rawMessage = await createMail(options);
      const { data: { id } = {} } = await gmail.users.messages.send({
        userId: 'me',
        resource: {
          raw: rawMessage,
        },
      });
      return id;
    };
    
    //module.exports = sendMail;

    const fs = require('fs');
    const path = require('path');
    //const sendMail = require('./gmail');

    const main = async () => {
    /* const fileAttachments = [
        {
        filename: 'attachment1.txt',
        content: 'This is a plain text file sent as an attachment',
        },
        {
        path: path.join(__dirname, './attachment2.txt'),
        },
        {
        filename: 'websites.pdf',
        path: 'https://www.labnol.org/files/cool-websites.pdf',
        },

        {
        filename: 'image.png',
        content: fs.createReadStream(path.join(__dirname, './attach.png')),
        },
    ]; */

    const options = {
        to: userEmail,
        cc: '., .',
        //replyTo: 'sultan.barber.reservas@gmail.com',
        subject: 'Reserva confirmada',
        text: `Hola,
        Su reserva ha sido confirmada.
        Detalles de la reserva:
        - Nombre: ${userIndicatedName}.
        - Hora: ${eventStartTime}.
        - ID de reserva: ${reservationId}.
        - Pagada: ${userPayed}.
        `,
        //html: `<p>🙋🏻‍♀️  &mdash; This is a <b>test email</b> from <a href="https://digitalinspiration.com">Digital Inspiration</a>.</p>`,
        //attachments: fileAttachments,
        // textEncoding: 'base64',
        // headers: [
        //   { key: 'X-Application-Developer', value: 'Amit Agarwal' },
        //   { key: 'X-Application-Version', value: 'v1.0.0.2' },
        // ],
    };

    const messageId = await sendMail(options);
    return messageId;
    };

    main()
    .then((messageId) => console.log('Message sent successfully:', messageId))
    .catch((err) => console.error(err));


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