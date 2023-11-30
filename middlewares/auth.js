//Imprtar modulos
const jwt = require("jwt-simple");
const moment = require("moment");

//Importar clave secreta
const libjwt = require("../services/jwt");
const secret = libjwt.secret;

//MIDDLEWARE de autenticacion
const auth = (req, res, next) => {
    //comprobar si llega la cabecera de autth
    if (!req.headers.authorization) {
        return res.status(403).send({
            status: "error",
            message: "La peticion no tiene la cabecera de autenticacion",
        });
    }
    //Limpiar el token
    let token = req.headers.authorization.replace(/['"]/g, '');

    //Decodificar el token
    try {
        let payload = jwt.decode(token, secret);

        //Comprobar expiracion del token
        if (payload.exp <= moment().unix()) {
            return res.status(401).send({
                status: "error",
                message: "Token expirado",
            });
        }
        //Agregar datos de usuario a request
        req.user = payload;
    }
    catch (error) {
        return res.status(404).send({
            status: "error",
            message: "Token invalido",
            error,
        });
    }

    //Pasar a ejecucuion de accion
    next();
}
module.exports = {
    auth,
}

