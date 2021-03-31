const { response } = require('express');
const { body } = require('express-validator');
const { Producto } = require('../models');

// obtenerProductos - paginado - total - populate
const obtenerProductos = async (req, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true }

    const [ total, productos ] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .populate('usuario', 'nombre')
            .populate('categoria','nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        msg: 'Todo ok! Traigo productos',
        total,
        productos
    });
}

// obtenerProducto - populate {}
const obtenerProducto = async (req, res = response) => {

    const { id } = req.params;

    try {
        const producto = await Producto.findById(id)
            .populate('usuario','nombre')
            .populate('categoria','nombre');

        if( !producto ){
            return res.status(400).json({
                msg: 'No existe ese producto con ese id'
            });
        }

        // Si el producto está activo
        if( !producto.estado ){
            return res.status(400).json({
                msg: 'producto deshabilitado'
            });
        }

        res.json({
            msg: 'producto ok',
            producto
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
    
}

// Crear Producto
const crearProducto = async (req, res = response) => {

    const { estado, usuario, ...body } = req.body;

    const ProductoDB = await Producto.findOne({ nombre: body.nombre });

    if( ProductoDB ){
        return res.status(400).json({
            msg: `El Producto ${ProductoDB.nombre}, ya existe`
        });
    }

    // Generar la data a guardar
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id,
        //categoria: req.categoria._id
    }

    const producto = new Producto( data );

    // Guardar DB
    await producto.save();

    res.status(201).json(producto);
}

// actualizarProducto
const actualizarProducto = async (req, res = response) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    if( data.nombre ){
        data.nombre = data.nombre.toUpperCase();
    }
    
    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id, data, {new: true});

    res.json({
        msg: 'Producto API - actualizada',
        id,
        producto
    });

}

// borrarProducto - estado: false
const borrarProducto = async (req, res = response) => {
    
    const { id } = req.params;

    try {

        const productoBorrado = await Producto.findByIdAndUpdate(id, {estado: false}, {new: true});

        res.json({
            msg: 'delete producto API - controlador',
            id,
            productoBorrado
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }

    
}

module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
}