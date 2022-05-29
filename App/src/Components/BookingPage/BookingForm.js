import React from 'react';

class BookingForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: '' };
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
      body: JSON.stringify({ title: this.state.value })
    };
    fetch("http://localhost:9029/calendarHandler/", requestOptions)
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
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

export default BookingForm;