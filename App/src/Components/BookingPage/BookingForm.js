import React from 'react';
import { Form } from 'react-bootstrap';
import "./BookingForm.css"

class BookingForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { userName: '', userEmail: '', userSelectedDate: '', userSelectedHour: '' };
    this.state = { apiResponse: "" };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // Este metodo se usará para obtener datos del backend
  callAPI_GET() {
    fetch("http://localhost:9025/calendarHandler")
      .then(res => res.text())
      .then(res => this.setState({ apiResponse: res }));
  }

  // Este metodo se usará para pasar datos al backend
  callAPI_POST() {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userName: this.state.userName, 
                              userEmail: this.state.userEmail, 
                              userSelectedDate: this.state.userSelectedDate })
    };
    fetch("http://localhost:9030/calendarHandler/", requestOptions)
      .then(response => response.json());
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    this.callAPI_POST();
    event.preventDefault();
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
                    <input type="text" value={this.state.userName} onChange={this.handleChange} class="form-control" id="formGroupExampleInput" placeholder="Simo Anaimi" />
                  </div>
                  <div class="form-group">
                    <label for="formGroupExampleInput2">Email</label>
                    <input type="text" value={this.state.userEmail} class="form-control" id="formGroupExampleInput2" placeholder="ejemplo@dominio.es" />
                  </div>
                  <div class="form-group">
                      <Form.Label>Escoge una fecha</Form.Label>
                      <Form.Control value={this.state.userSelectedDate} type="date" name="dob" placeholder="Fecha de la reserva" />
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