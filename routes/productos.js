const { Router } = require('express');
const { check } = require('express-validator');
const { crearProducto, obtenerProductos, obtenerProducto, actualizarProducto, borrarProducto } = require('../controllers/productos');
const { existeProducto, existeCategoria } = require('../helpers/db-validators');

const { validarCampos, validarJWT, esAdminRole } = require('../middlewares');

const router = Router();

/*
    {{url}}/api/productos
*/

// Obtener todas los Productos - publico
router.get('/', obtenerProductos);

// Obtener un producto por id - publico
router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeProducto ),
    validarCampos
],obtenerProducto);

// Crear producto - privado - cualquier persona con un token valido
router.post('/', [
    validarJWT,
    check('categoria', 'No es un ID válido').isMongoId(),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria').custom(existeCategoria),
    validarCampos
],crearProducto);

// Actualizar producto - privado - cualquier persona con un token valido
router.put('/:id', [
    validarJWT,
    check('categoria', 'No es un ID válido').isMongoId(),
    check('id').custom( existeProducto ),
    validarCampos
],actualizarProducto);

// Borrar una categoria - Admin
router.delete('/:id', [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeProducto ),
    // check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE']),
    esAdminRole,
    validarCampos
],borrarProducto);

module.exports = router;