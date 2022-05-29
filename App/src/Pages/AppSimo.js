
//sultan.barber.reservas
//sultan666666
//ID Cliente: 448017272052-aauovi0am3hboog68d52nf4l2g4kbgsd.apps.googleusercontent.com
//Secret: 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
//refresh_token: '1//04RHhgOVzMNlrCgYIARAAGAQSNwF-L9IrHRs08PBC06N1b_cZYNYrHP0taUsgl5775pTtMfH6ZrqwLFCr5w-UI-ikdX17lwK1Ueo'

alert('hola Simo7')

// Require google from googleapis package.
const { google } = require('googleapis')

// Require oAuth2 from our google instance.
const { OAuth2 } = google.auth

// Create a new instance of oAuth and set our Client ID & Client Secret.
const oAuth2Client = new OAuth2(
  '448017272052-aauovi0am3hboog68d52nf4l2g4kbgsd.apps.googleusercontent.com',
  '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'
)

// Call the setCredentials method on our oAuth2Client instance and set our refresh token.
oAuth2Client.setCredentials({
  refresh_token: '1//04RHhgOVzMNlrCgYIARAAGAQSNwF-L9IrHRs08PBC06N1b_cZYNYrHP0taUsgl5775pTtMfH6ZrqwLFCr5w-UI-ikdX17lwK1Ueo',
})

// Create a new calender instance.
const calendar = google.calendar({ version: 'v3', auth: oAuth2Client })

// Create a new event start date instance for temp uses in our calendar.
const eventStartTime = new Date()
eventStartTime.setDate(eventStartTime.getDay() + 2)

// Create a new event end date instance for temp uses in our calendar.
const eventEndTime = new Date()
eventEndTime.setDate(eventEndTime.getDay() + 4)
eventEndTime.setMinutes(eventEndTime.getMinutes() + 45)

// Create a dummy event for temp uses in our calendar
const event = {
  summary: `Reserva David Garrido`,
  location: `3595 California St, San Francisco, CA 94118`,
  description: `Reserva David Garrido para corte de pelo.`,
  colorId: 1,
                    /*Color: Blue | ID: 1
                      Color: Green | ID: 2
                      Color: Purple | ID: 3
                      Color: Red | ID: 4
                      Color: Yellow | ID: 5
                      Color: Orange | ID: 6
                      Color: Turquoise | ID: 7
                      Color: Gray | ID: 8
                      Color: Bold Blue | ID: 9
                      Color: Bold Green | ID: 10
                      Color: bold red | ID: 11 */
  start: {
    dateTime: eventStartTime,
    timeZone: 'Europe/Madrid',
  },
  end: {
    dateTime: eventEndTime,
    timeZone: 'Europe/Madrid',
  },
}

// Check if we a busy and have an event on our calendar for the same time.
calendar.freebusy.query(
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
)


function AppSimo() 
{
  alert('hola Simo6')
} 

export default AppSimo;
