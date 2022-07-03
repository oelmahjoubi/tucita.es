import React, { Component } from 'react'

export class successfulPayment extends Component {
    render() {
        return (
            <div class="alert">
                <div class="d-flex justify-content-center">
                    <div class="alert alert-success" role="alert">
                        <h4 class="alert-heading">¡Genial, tu pago se ha processado correctamente!</h4>
                        <div class="entry-content">
                            <ul>
                                <li>Identificador de tu reserva: RS767398</li>
                                <li>Dia y hora: 12/07/2022 a las 18h30</li>
                                <li>Nuestra dirección: Calle Jaume Vidal I Alcover, numero 12.</li>
                            </ul>
                        </div>
                        <hr />
                        <p class="mb-0">En breve recibrás un correco electrónico con los detalles de tu reserva.</p>
                    </div>
                </div>
            </div>
        )
    }
}

export default successfulPayment