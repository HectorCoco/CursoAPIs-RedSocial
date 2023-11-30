//Importar dependencias
const connection = require("./database/connection");
const express = require("express");
const cors = require("cors");

//Mensaje de bienvenida
console.log("API NODE para red social arancada");

//Conexion a db
connection();

//Crear servidor node
const app = express();
const puerto = 3900;

//Configurar cors
app.use(cors());

//Convertir datos del body a objetos js 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Configurar las rutas
//Ruta prueba
app.get("/ruta-prueba", (req, res) => {
    return res.status(200).json({
        "id": 1,
        "nombre": "Hector",
        "web": "ninguna",
    })
})
//Importar rutas útiles
const userRoutes = require("./routes/user");
const publicationRoutes = require("./routes/publication");
const followRoutes = require("./routes/follow");

app.use("/api/user", userRoutes);
app.use("/api/publication", publicationRoutes);
app.use("/api/follow", followRoutes);

//Poner servidor a escuchar peticiones http
app.listen(puerto, () => {
    console.log("Servidor de NODE corriendo en el puerto:  ", puerto)
});