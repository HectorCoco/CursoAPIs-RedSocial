//Importar dependencias
const jwt = require("jwt-simple");
const moment = require("moment");

//Clave secreta
const secret = "CLAVE_SECRETA_DEL_PROYECTO_RED_SOCIAL_1029384756";

//Funcion para generar tokens
const createToken = (user) => {
    const payload = {
        id: user._id,
        name: user.name,
        surname: user.surname,
        nick: user.nick,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(),
        exp: moment().add(10, "days").unix()
    };
    //Devolver jwt token codificado
    return jwt.encode(payload, secret);
}
module.exports = {
    secret,
    createToken,
}
