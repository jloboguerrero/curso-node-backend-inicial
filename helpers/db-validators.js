const Role = require('../models/role');
const Usuario = require('../models/usuario');

const esRoleValido = async(rol = '') => {
    const existeRol = await Role.findOne({ rol });
    if( !existeRol ){
        throw new Error(`El rol ${ rol } no está registrado en la base de datos`);
    }
}

const emailExiste = async( correo = '' ) => {
    // Verificar si el correo existe
    const existeEmail = await Usuario.findOne({ correo });
    if( existeEmail ){
        throw new Error( `Ese correo: ${ correo } ya está registrado` );
    }
}

const existeUsuarioPorId = async( id ) => {
    // Verificar si el correo existe
    const existeUsuario = await Usuario.findById( id );
    if( !existeUsuario ){
        throw new Error( `Ese id: ${ id } no existe` );
    }
}

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId
}