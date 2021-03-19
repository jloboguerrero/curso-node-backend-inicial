const { response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');


const usuariosGet = async (req, res = response) => {

    //const { nombre = 'No name', api, q, page = 1 } = req.query;
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true }

    // const usuarios = await Usuario.find(query)
    //     .skip(Number(desde))
    //     .limit(Number(limite));

    // const total = await Usuario.countDocuments(query);

    const [ total, usuarios ] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        total,
        usuarios
        // msg: 'get API - controlador',
        // nombre,
        // api,
        // q,
        // page
    });
}

const usuariosPut = async (req, res = response) => {

    const { id } = req.params;
    const { password, google, correo, _id, ...resto } = req.body;

    // TODO validar contra base de datos

    if(password) {
        // Encripar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );
    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto );

    res.json({
        msg: 'put API - controlador',
        //id
        usuario
    });
}

const usuariosPost = async (req, res = response) => {

    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });

    // Encripar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password, salt );

    await usuario.save();

    res.json({
        usuario
        // msg: 'post API - controlador',
        // nombre,
        // correo,
        // password,
        // rol
    });
}

const usuariosDelete = async(req, res = response) => {

    const { id } = req.params;

    // Fisicamente lo borramos
    //const usuario = await Usuario.findByIdAndDelete( id );

    // Desactivarlo mas bien
    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false});

    //const usuarioAutenticado = req.usuario;

    res.json({
        msg: 'delete API - controlador',
        id,
        usuario
        //usuarioAutenticado
    });
}


module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete
}