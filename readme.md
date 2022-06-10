Para instalar el proyecto desde cero:
### npm install //en la carpeta App
### npm cache clean --force
### npm install -g create-react-app //en la carpeta App


### npm install http-errors //en la carpeta Api/api
### npm install cors //en la carpeta Api

### npm i -D nodemon //en la carpeta api/api

### npm i twix //en la carpeta api/api


Para arrancar el servidor:
### npm run watch //en lugar de npm start

Para configurar cuentas de negocios para Gmail seguir este manual (auth2):
https://www.labnol.org/google-api-service-account-220405

Para configurar cuentas de negocios para calendario seguir este manual (service account):
https://www.youtube.com/watch?v=dFaV95gS_0M


Anotaciones Simo:
en el formulario de selección hay que implementar control de errores de selección:
    - Si no lee el calendario, indicar que hay un error y que deben refrescar la página
    - si se selecciona un día anterior, indicar el error.
    - si se selecciona un día futuro que supera el límite de reservas (de momento he establecido 30 días)


    pago:
    https://pps.ecopaynet.com/Payment.aspx


Si sale error: Plugin "react" was conflicted between package.json eslint-config-react-app
Revisa la ruta con la que has iniciado la App en el terminal, verás que hay alguna mayúscula que está mal...ejemplo:
C:\Users\Simo\OneDrive\Escritorio\Proyectos\tucita.es\app>
C:\Users\Simo\OneDrive\Escritorio\Proyectos\tucita.es\App>
