const Categoria = require('../models/categoria');
const Role = require('../models/role');
const Usuario = require('../models/usuario');
const { Producto } = require('../models');

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

const existeCategoria = async (id) => {
    // Verificar si existe la categoria
    const siExisteCategoria = await Categoria.findById(id);
    if( !siExisteCategoria ){
        throw new Error( `Ese id: ${ id } de categoria no existe` );
    }
}

const existeProducto = async (id) => {
    // Verificar si existe el producto
    const siExisteProducto = await Producto.findById(id);
    if( !siExisteProducto ){
        throw new Error( `Ese id: ${ id } de Producto no existe` );
    }
}
/* 
    Validar colecciones permitidas
 */
const coleccionesPermitidas = ( coleccion = '', colecciones = [] ) => {

    const incluida = colecciones.includes( coleccion );
    if( !incluida ){
        throw new Error(`La colección ${coleccion} no es permitida, ${colecciones}`);
    }

    return true;
}

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoria,
    existeProducto,
    coleccionesPermitidas
}