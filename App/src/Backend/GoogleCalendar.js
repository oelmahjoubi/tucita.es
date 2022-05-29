//Variables a entregar por Frontend
const UserSelectedDay = new Date();
UserSelectedDay.setFullYear(2022, 4, 29)
UserSelectedDay.setHours(12,0,0)
var UserIndicatedName="Antonio Machado Garrido";
var UserPayed=true


//Llamo a la función escribir en el calendario
Write_Calendar(UserIndicatedName, UserSelectedDay,UserPayed, Write_Calendar_Response)

//Esta función es para evaluar la respuesta del método Insert event, que es asíncrono
function Write_Calendar_Response(CalendarWriteResponse){
  console.log("Evento creado = " + CalendarWriteResponse);
  //Aquí se podría confirmar al usuario que se ha creado la reserva o que ha habido un error
}

function Write_Calendar(UserIndicatedName, UserSelectedDay, UserPayed,callback){
  const ServiceDuration = 59; //minutos
  let EventCreated=null;
  //Faltaría crear un array con los datos del local, dirección, taken, ID, secret...
  //if (Parameter === undefined) {}
  

 // Require google from googleapis package.
 const { google } = require('googleapis')

// Require oAuth2 from our google instance.
const { OAuth2 } = google.auth

// Create a new instance of oAuth and set our Client ID & Client Secret.
const oAuth2Client = new OAuth2(
  '569172170053-kn7t5315uld8sia0bho2r2tckkjsi7u8.apps.googleusercontent.com',
  'AIzaSyAqYzSyoPE-P97j_2CHIHp0x4VgYxcHQFY'
);

// Call the setCredentials method on our oAuth2Client instance and set our refresh token.
oAuth2Client.setCredentials({
  refresh_token: '1//04RHhgOVzMNlrCgYIARAAGAQSNwF-L9IrHRs08PBC06N1b_cZYNYrHP0taUsgl5775pTtMfH6ZrqwLFCr5w-UI-ikdX17lwK1Ueo',
});


// Create a new calender instance.
const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

// Create a new event start date instance for temp uses in our calendar.
var eventStartTime = UserSelectedDay//= new Date();

// Create a new event end date instance for temp uses in our calendar.
const eventEndTime = new Date()
//eventEndTime.setDate(eventEndTime.getDay() + 1)
eventEndTime.setFullYear(eventStartTime.getFullYear(), eventStartTime.getMonth(), eventStartTime.getDate()) //mes de 0 - 11
eventEndTime.setHours(eventStartTime.getHours(),eventStartTime.getMinutes()+ServiceDuration,0)

//eventEndTime.setMinutes(eventEndTime.getMinutes() + 45)

console.log('Fecha inicio ' + eventStartTime)
console.log('Fecha inicio ' + eventEndTime)
// Create a dummy event for temp uses in our calendar
const event = {
  summary: `Reserva ${UserIndicatedName}`,
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
    dateTime: eventStartTime,
    timeZone: 'Europe/Madrid',
  },
  end: {
    dateTime: eventEndTime,
    timeZone: 'Europe/Madrid',
  },
}

calendar.events.insert(
  { calendarId: 'primary', resource: event },
  err => {
    // Check for errors and log them if they exist.
    if (err)  {EventCreated=false} //console.error('Error Creating Calender Event:', err)
    // Else log that the event was created.
    else {EventCreated=true} //la función no espera a que el evento termine
    
    callback(EventCreated)
    //waitFor(EventCreated)
  }
  
) 
//while(EventCreated==null){}



// Check if we a busy and have an event on our calendar for the same time.
 /*calendar.freebusy.query(
  {
    resource: {
      timeMin: eventStartTime,
      timeMax: eventEndTime,
      timeZone: 'Europe/Madrid',
      items: [{ id: 'primary' }],
    },
  },
  (err, res) => {
    // Check for errors in our query and log them if they exist.
    if (err) return console.error('Free Busy Query Error: ', err)

    // Create an array of all events on our calendar during that time.
    const eventArr = res.data.calendars.primary.busy

    // Check if event array is empty which means we are not busy
    if (eventArr.length === 0)
      // If we are not busy create a new calendar event.
      return calendar.events.insert(
        { calendarId: 'primary', resource: event },
        err => {
          // Check for errors and log them if they exist.
          if (err) return console.error('Error Creating Calender Event:', err)
          // Else log that the event was created.
          return console.log('Calendar event successfully created.')
        }
      )

    // If event array is not empty log that we are busy.
    return console.log(`Sorry I'm busy...`)
  }
) */


//}
//export default Read_Calendar;
return EventCreated;
}