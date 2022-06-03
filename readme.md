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


Anotaciones Simo:
en el formulario de selección hay que implementar control de errores de selección:
    - Si no lee el calendario, indicar que hay un error y que deben refrescar la página
    - si se selecciona un día anterior, indicar el error.
    - si se selecciona un día futuro que supera el límite de reservas (de momento he establecido 30 días)