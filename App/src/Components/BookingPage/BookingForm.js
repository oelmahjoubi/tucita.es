import React, { state } from "react";
import { Form } from 'react-bootstrap';
import "./BookingForm.css"
import "./AvailableHours"
import "./PopUp"


class BookingForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { userName: '', userEmail: '', userSelectedDate: '', userSelectedHour: '', getHoursResponse: '' };

    this.handleUserNameChange = this.handleUserNameChange.bind(this);
    this.handleUserEmailChange = this.handleUserEmailChange.bind(this);
    this.handleUserSelectedDateChange = this.handleUserSelectedDateChange.bind(this);
    this.handleUserSelectedHourChange = this.handleUserSelectedHourChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleUserNameChange(event) {
    this.setState({userName: event.target.value});
  }

  handleUserEmailChange(event) {
    this.setState({userEmail: event.target.value});
  }

  handleUserSelectedDateChange(event) {
    this.setState({userSelectedDate: event.target.value});
    this.callAPI_GET(event.target.value)
  }
  
  handleUserSelectedHourChange(event) {
    this.setState({userSelectedHour: event.target.value});
  }

  handleSubmit() {
    this.callAPI_POST()    
  }

  componentDidMount(){
    fetch(`http://192.168.1.128:9000/calendarHandler/mount`)
      .then(res => res.text())
  }

  // Este metodo se usará para obtener datos del backend
  callAPI_GET(bookingDate) {
    fetch(`http://192.168.1.128:9000/calendarHandler/${bookingDate}`)
      .then(res => res.text())
      .then(res => this.setState({ getHoursResponse: res }));
  }

  // Este metodo se usará para pasar datos al backend
  callAPI_POST() {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userName: this.state.userName, 
                              userEmail: this.state.userEmail, 
                              userSelectedDate: this.state.userSelectedDate, 
                              userSelectedHour: this.state.userSelectedHour })
    };

    console.log(this.userSelectedDate)
    fetch("http://192.168.1.128:9000/calendarHandler/", requestOptions)
      .then(response => response.json());

  }   

  render() {
    let hoursToShow = []
    hoursToShow = this.state.getHoursResponse.split(",")
    if (hoursToShow.length === 1)
    {
        hoursToShow = []
        hoursToShow.push("No hay disponibilidad")
    }

    return (
      <main>
      <div class="container d-flex align-items-center p-3 my-3 text-white bg-secondary rounded shadow-sm">
        <div class="lh-1">
          <h1 class="h6 mb-0 text-white lh-1">Barber Shop Sultan</h1>
          <small>Since 2011</small>
        </div>
      </div>
        <div class="container my-5">
          <div class="bg-light p-5 rounded">
            <div class="col-sm-8 py-5 mx-auto">
              <h1 class="display-5 fw-normal">Reserva tu cita</h1>
              <div class="form-group">
                <form onSubmit={this.handleSubmit}>
                  <div class="form-group">
                    <label>Nombre</label>
                    <input type="text" value={this.state.userName} onChange={this.handleUserNameChange} class="form-control" placeholder="Simo Anaimi" />
                  </div>
                  <div class="form-group">
                    <label>Email</label>
                    <input type="text" value={this.state.userEmail} onChange={this.handleUserEmailChange} class="form-control" placeholder="ejemplo@dominio.es" />
                  </div>
                  <div class="form-group">
                      <label>Escoge una fecha</label>
                      <Form.Control value={this.state.userSelectedDate} onChange={this.handleUserSelectedDateChange} type="date" name="dob" format="dd/mm/yyyy" placeholder="Fecha de la reserva" />
                  </div>
                  <div>
                    <label>Escoge una hora</label>
                    <select value={this.state.userSelectedHour} onChange={this.handleUserSelectedHourChange} class="form-control" id="exampleFormControlSelect1">
                    {
                        hoursToShow.map( (x,y) => 
                        <option key={y}>{x.replace(/[\[\]'"]+/g,'')}</option> )
                    }
                    </select>
                  </div>
                  <button type= "submit" class="btn btn-outline-primary btn-space">Reservar</button>
                </form>
              </div>
          </div>
          </div>
        </div>
      </main>
    );
  }
}

export default BookingForm;