import React, { Component } from 'react'

export class failedPayment extends Component {
    render() {
        return (
            <div class="alert">
                <div class="d-flex justify-content-center">
                    <div class="alert alert-danger" role="alert">
                        <h4 class="alert-heading">¡Ups, algo ha ido mal!</h4>
                        <p>No se ha podido realizar correctamente el pago de tu reserva!</p>
                        <hr />
                        <p class="mb-0">Por favor, vuelte a intentarlo en unos minutos.</p>
                    </div>
                </div>
            </div>
        )
    }
}

export default failedPayment