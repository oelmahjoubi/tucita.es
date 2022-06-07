import React from "react";
import PropTypes from "prop-types";

function AvailableHours({ hours, userSelectedHour }) {

    let hoursToShow = []
    hoursToShow = hours.split(",")
    if (hoursToShow.length === 1)
    {
        hoursToShow = []
        hoursToShow.push("No hay disponibilidad")
    }

  return (
    <div>
        <label for="exampleFormControlSelect1">Escoge una hora</label>
        <select value={userSelectedHour} class="form-control" id="exampleFormControlSelect1">
        {
            hoursToShow.map( (x,y) => 
            <option key={y}>{x.replace(/[\[\]'"]+/g,'')}</option> )
        }
        </select>
    </div>
  );
}

AvailableHours.propTypes = {

};

export default AvailableHours;
 