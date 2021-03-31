const { response } = require('express');
const { Categoria } = require('../models');


// obtenerCategorias - paginado - total - populate

const obtenerCategorias = async (req, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true }

    // const categorias = await Categoria.find();
    const [ total, categorias ] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .populate('usuario', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        msg: 'Todo ok! Traigo categorias',
        total,
        categorias
    });
}

// obtenerCategoria - populate {}

const obtenerCategoria = async (req, res = response) => {

    const { id } = req.params;

    try {
        const categoria = await Categoria.findById(id).populate('usuario','nombre');
        if( !categoria ){
            return res.status(400).json({
                msg: 'No existe esa categoría con ese id'
            });
        }

        // Si el categoria está activo
        if( !categoria.estado ){
            return res.status(400).json({
                msg: 'categoria deshabilitado'
            });
        }

        res.json({
            msg: 'categoria ok',
            categoria
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
    
}


// Crear categoróa
const crearCategoria = async (req, res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre });

    if( categoriaDB ){
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre}, ya existe`
        });
    }

    // Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria( data );

    // Guardar DB
    await categoria.save();

    res.status(201).json(categoria);
}

// actualizarCategoria
const actualizarCategoria = async (req, res = response) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    // const categoria = await Categoria.findByIdAndUpdate(id, {nombre: nombre});
    const categoria = await Categoria.findByIdAndUpdate(id, data, {new: true});

    res.json({
        msg: 'categoria API - actualizada',
        id,
        nombre,
        categoria
    });

}

// borrarCategoria - estado: false
const borrarCategoria = async (req, res = response) => {
    
    const { id } = req.params;

    try {

        const categoria = await Categoria.findByIdAndUpdate(id, {estado: false}, {new: true});

        res.json({
            msg: 'delete categoria API - controlador',
            id,
            categoria
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }

    
}

module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}