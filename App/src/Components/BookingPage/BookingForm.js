import React, { state } from "react";
import { Form } from 'react-bootstrap';
import "./BookingForm.css"
import { Collapse } from "bootstrap"

/* Declarando la clase 'BookingForm' */
class BookingForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '', userEmail: '', userSelectedDate: '', userSelectedHour: '', getHoursResponse: [],
      getAvailableAppointmentsResponse: '', paymentParameters: '', paymentSignature: ''
    };

    this.handleUserNameChange = this.handleUserNameChange.bind(this);
    this.handleUserEmailChange = this.handleUserEmailChange.bind(this);
    this.handleUserSelectedDateChange = this.handleUserSelectedDateChange.bind(this);
    this.handleUserSelectedHourChange = this.handleUserSelectedHourChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleUserNameChange(event) {
    this.setState({ userName: event.target.value });
  }

  /* Declarando la función 'handleUserEmailChange' */
  handleUserEmailChange(event) {
    this.setState({ userEmail: event.target.value });
  }

  /* Declarando la función 'handleUserSelectedDateChange' */
  handleUserSelectedDateChange(event) {
    this.setState({ userSelectedDate: event.target.value });

    let availableAppointmentsHours = []
    let userSelectedDateData = event.target.value.split("-")
    let userSelectedDate = userSelectedDateData[2] + "/" + userSelectedDateData[1] + "/" + userSelectedDateData[0]

    let availableAppointments = []
    availableAppointments = JSON.parse(this.state.getAvailableAppointmentsResponse)
    availableAppointments.forEach(function (element) {
      if (element.substring(0, 10) == userSelectedDate) {
        availableAppointmentsHours.push(element.substring(12, 17)) // Obtener las horas disponibles para la fecha selecionada
      }
    })
    this.setState({ getHoursResponse: availableAppointmentsHours })
  }

  /* Declarando la función 'handleUserSelectedHourChange' */
  handleUserSelectedHourChange(event) {
    this.setState({ userSelectedHour: event.target.value });
  }

  /* Declarando la función 'handleSubmit' */
  handleSubmit() {
    this.serverPOST()
  }

  /* Declarando la función 'serverPOST' */
  serverPOST() {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userName: this.state.userName,
        userEmail: this.state.userEmail,
        userSelectedDate: this.state.userSelectedDate,
        userSelectedHour: document.getElementById("exampleFormControlSelect1").value //this.state.userSelectedHour 
      })
    };
    //Hay que usar document.getElementById("exampleFormControlSelect1").value, pq no siempre se modifican las horas y se genera el evento

    fetch("http://localhost:9065/calendarHandler/", requestOptions)
      .then(response => response.json());

  }

  /* 
  Declarando la función 'serverPOST', se encarga de obtener los datos del backend en el momento de 
  construir este componente. 
  */
  componentDidMount() {
    fetch(`http://localhost:9065/calendarHandler/mount`)
      .then(res => res.json())
      .then(res => this.setState({
        paymentSignature: res.signature, paymentParameters: res.merchantParameters,
        getAvailableAppointmentsResponse: res.availableAppointments
      }))
  }

  render() {
    let hoursToShow = []
    hoursToShow = this.state.getHoursResponse
    if (hoursToShow.length === 0) {
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

        <div class="container">
          <div class="row">
            <div class="col-sm-8">
              <div id="myCarousel" class="carousel slide" data-bs-ride="carousel">
                <div class="carousel-indicators">
                  <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
                  <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
                  <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
                </div>
                <div class="carousel-inner">
                  <div class="carousel-item active">
                    <svg class="bd-placeholder-img" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" preserveAspectRatio="xMidYMid slice" focusable="false"><rect width="100%" height="100%" fill="#777" /></svg>

                    <div class="container">
                      <div class="carousel-caption text-start">
                        <h1>Example headline.</h1>
                        <p>Some representative placeholder content for the first slide of the carousel.</p>
                        <p><a class="btn btn-lg btn-primary" href="#">Sign up today</a></p>
                      </div>
                    </div>
                  </div>
                  <div class="carousel-item">
                    <svg class="bd-placeholder-img" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" preserveAspectRatio="xMidYMid slice" focusable="false"><rect width="100%" height="100%" fill="#777" /></svg>

                    <div class="container">
                      <div class="carousel-caption">
                        <h1>Another example headline.</h1>
                        <p>Some representative placeholder content for the second slide of the carousel.</p>
                        <p><a class="btn btn-lg btn-primary" href="#">Learn more</a></p>
                      </div>
                    </div>
                  </div>
                  <div class="carousel-item">
                    <svg class="bd-placeholder-img" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" preserveAspectRatio="xMidYMid slice" focusable="false"><rect width="100%" height="100%" fill="#777" /></svg>
                    <div class="container">
                      <div class="carousel-caption text-end">
                        <h1>One more for good measure.</h1>
                        <p>Some representative placeholder content for the third slide of this carousel.</p>
                        <p><a class="btn btn-lg btn-primary" href="#">Browse gallery</a></p>
                      </div>
                    </div>
                  </div>
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#myCarousel" data-bs-slide="prev">
                  <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#myCarousel" data-bs-slide="next">
                  <span class="carousel-control-next-icon" aria-hidden="true"></span>
                  <span class="visually-hidden">Next</span>
                </button>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="card">
                <div class="shadow p-5">
                  <h3>Reserva tu cita</h3>
                  <div class="form-group">
                    <form onSubmit={this.handleSubmit} action="https://sis-t.redsys.es:25443/sis/realizarPago" method="POST" >
                      <input type="hidden" name="Ds_SignatureVersion" value="HMAC_SHA256_V1" />
                      <input type="hidden" name="Ds_MerchantParameters" value={this.state.paymentParameters} />
                      <input type="hidden" name="Ds_Signature" value={this.state.paymentSignature} />
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
                            hoursToShow.map((x, y) =>
                              <option key={y}>{x.replace(/[\[\]'"]+/g, '')}</option>)
                          }
                        </select>
                      </div>
                      <button type="submit" class="btn btn-outline-primary btn-space">Reservar</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
}

export default BookingForm;