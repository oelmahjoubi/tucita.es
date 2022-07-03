import React from 'react';
import "./Footer.css"

function Footer() {
  return (
    <div class="panel panel-primary">
      <footer class="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top fixed-bottom ">
        <div class="container">
          <p class="float-end">
            <a href="#">Subir</a>
          </p>
          <p>TuCITA.ES todos los derechos reservados &copy;</p>
          <p>Para más información puedes seguirnos en nuestras redes sociales <a href="../../">Instagram</a> o <a href="../../getting-started/">Facebook</a>.</p>
        </div>
      </footer>
    </div>
  )
}

export default Footer;