import React, { state } from "react";
import { Form } from 'react-bootstrap';
import "./BookingForm.css"
import "./AvailableHours"
import AvailableHours from "./AvailableHours";

class BookingForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { userName: '', userEmail: '', userSelectedDate: '', userSelectedHour: '', getHoursResponse: '' };

    this.handleUserNameChange = this.handleUserNameChange.bind(this);
    this.handleUserEmailChange = this.handleUserEmailChange.bind(this);
    this.handleUserSelectedDateChange = this.handleUserSelectedDateChange.bind(this);
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

  handleUseSelectedHourChange(event) {
    this.setState({userSelectedHour: event.target.value});
  }

  handleSubmit(event) {
    this.callAPI_POST()
    event.preventDefault();
  }

  componentDidMount(){
    fetch(`http://localhost:9000/calendarHandler/mount`)
      .then(res => res.text())
  }

  // Este metodo se usará para obtener datos del backend
  callAPI_GET(bookingDate) {
    fetch(`http://localhost:9000/calendarHandler/${bookingDate}`)
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
    fetch("http://localhost:9000/calendarHandler/", requestOptions)
      .then(response => response.json());

  }   

  render() {

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
                    <label for="formGroupExampleInput">Nombre</label>
                    <input type="text" value={this.state.userName} onChange={this.handleUserNameChange} class="form-control" id="formGroupExampleInput" placeholder="Simo Anaimi" />
                  </div>
                  <div class="form-group">
                    <label for="formGroupExampleInput2">Email</label>
                    <input type="text" value={this.state.userEmail} onChange={this.handleUserEmailChange} class="form-control" id="formGroupExampleInput2" placeholder="ejemplo@dominio.es" />
                  </div>
                  <div class="form-group">
                      <Form.Label>Escoge una fecha</Form.Label>
                      <Form.Control value={this.state.userSelectedDate} onChange={this.handleUserSelectedDateChange} type="date" name="dob" format="dd/mm/yyyy" placeholder="Fecha de la reserva" />
                  </div>
                
                  < AvailableHours hours={this.state.getHoursResponse} />

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