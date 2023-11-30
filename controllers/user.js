//Importación de dependencias y módulos
const bcrypt = require("bcrypt");

//Importar modelos
const User = require("../models/user");

//Importar servicios
const jwt = require("../services/jwt");


//Acciones de prueba
const pruebaUser = (req, res) => {
    return res.status(200).send({
        message: "Mensaje enviado desde el controlador de prueba desde: controllers/user.js",
        usuario: req.user,
    });
}

//Registro de usuario
const register = (req, res) => {
    //Recoger datos de la peticion
    let params = req.body;
    //Comprobar que me llegan bien (+ validación)
    if (!params.name || !params.email || !params.password || !params.nick) {
        return res.status(400).json({
            status: "error",
            messge: "Faltan datos por enviar",
        });
    }

    //Control de usuarios duplicados
    User.find({
        $or: [
            { email: params.email.toLowerCase() },
            { nick: params.nick.toLowerCase() }
        ]
    }).then(async (users) => {
        if (users && users.length >= 1) {
            return res.status(200).send({
                status: "success",
                message: "El usuario ya existe"
            });
        }
        if (users) {
            //Cifrar la contraseña
            let pwd = await bcrypt.hash(params.password, 10)
            params.password = pwd;

            //Crear objeto de usuario con los datos validados
            let userToSave = new User(params);

            //Guardar usuario en la base de datos
            userToSave.save().then((userStored) => {
                if (!userStored) {
                    return res.status(500).send({
                        status: "error",
                        message: "Error al guardar usuario",
                        error: error,

                    })
                } if (userStored) {
                    //Devolver usuario
                    return res.status(200).json({
                        status: "success",
                        message: "Usuario registrado exitosamente",
                        user: userStored,
                    });
                }
            }).catch((error) => {
                return res.status(500).send({
                    status: "error",
                    message: "Error al guardar usuario",
                    error: error,

                })
            })
        }
    }).catch((error) => {
        return res.status(400).json({
            status: "error",
            message: "Error al guardar usuario",
            error,
        });
    });
}

const login = (req, res) => {
    //Recoger parametros del body
    let params = req.body;
    if (!params.email || !params.password) {
        return res.status(400).send({
            status: "error",
            message: "Faltan datos por enviar",
        });
    }
    //Buscar en la bbdd si existe
    User.findOne({ email: params.email })
        // .select({         "password": 0        })
        .then((user) => {
            if (!user) {
                return res.status(404).send({
                    status: "error",
                    message: "No existe el usuario",
                });
            }
            //Comprobar su contrasenia
            const pwd = bcrypt.compareSync(params.password, user.password)
            if (!pwd) {
                return res.status(400).send({
                    status: "error",
                    message: "Contrasenia incorrecta",
                });
            }
            //Conseguir Token
            const token = jwt.createToken(user);
            //Devolver datos de usuario

            return res.status(200).send({
                status: "success",
                message: "Te has identificado correctamente",
                user: {
                    id: user.id,
                    name: user.name,
                    nick: user.nick,
                },
                token,
            });
        }).catch((error) => {
            return res.status(404).send({
                status: "error",
                message: "No existe el usuario",
                error,
            });
        })
}
const profile = (req, res) => {
    //Recibir el parametro del id de usuario por la url
    const id = req.params.id;
    //consulta para sacar los datos del usuario
    User.findById(id).then((userProfile) => {
        if (!userProfile) {
            return res.status(404).send({
                status: "error",
                message: "No existe el usuario",
                error,
            });
        }
        //devolver resultado
        if (userProfile) {
            return res.status(200).send({
                status: "success",
                user: userProfile,
            });
        }
    }).catch((error) => {
        return res.status(404).send({
            status: "error",
            message: "Error de consulta",
            error,
        });
    });
}


//Exportar acciones
module.exports = {
    pruebaUser,
    register,
    login,
    profile,
}