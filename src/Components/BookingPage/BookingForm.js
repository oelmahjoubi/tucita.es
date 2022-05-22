import React, { useState } from 'react';
import "./BookingForm.css";
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css";

function BookingForm() {
    const [selectedDate, setSelectedDate] = useState(null)
  return (
    <div className='bookingForm'>
        <form>
            <div class="form-group">
                <label for="formGroupExampleInput">Example label</label>
                <input type="text" class="form-control" id="formGroupExampleInput" placeholder="Example input"/>
            </div>
            <div class="form-group">
                <label for="formGroupExampleInput2">Another label</label>
                <input type="text" class="form-control" id="formGroupExampleInput2" placeholder="Another input"/>
            </div>
        </form>
        <DatePicker selected={selectedDate} onChange={setSelectedDate}/>
    </div>
  )
}

export default BookingForm