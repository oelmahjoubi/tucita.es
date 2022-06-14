import React from 'react'
import "./Home.css"
import Navbar from "../Components/HomePage/Navbar"
import Cards from "../Components/HomePage/BusinessCards"

function Home() {
  return (
    <body>
      <header>
        < Navbar />
      </header>
    <section class="jumbotron text-center">
      <div class="container">
        <h1 class="jumbotron-heading">Escoge tu negocio favorito y programa una cita</h1>
       <p class="lead text-muted">Aquí podrás escoger tu negocio favorito y concretar cita para la hora que te interese, te apetece un corte de pelo? o quizá un Spa este fin de semana? Aquí encontrarás todo lo que necesitas!</p>
      </div>
    </section>

    <div class="album py-5 bg-light">
        <div class="container">
          <div class="row">
            <Cards />
          </div>
        </div>
      </div>
    </body>


  )
}

export default Home