const { Router } = require('express');
const { check } = require('express-validator');
const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require('../controllers/categorias');
const { validarJWT, validarCampos, esAdminRole } = require('../middlewares/');
const { existeCategoria } = require('../helpers/db-validators');

const router = Router();

/*
    {{url}}/api/categorias
*/

// Obtener todas las categorias - publico
router.get('/', obtenerCategorias);

// Obtener una categoría por id - publico
router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeCategoria ),
    validarCampos
],obtenerCategoria);

// Crear categoria - privado - cualquier persona con un token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
],crearCategoria);

// Actualizar - privado - cualquier persona con un token valido
router.put('/:id', [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeCategoria ),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
],actualizarCategoria);

// Borrar una categoria - Admin
router.delete('/:id', [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeCategoria ),
    // check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE']),
    esAdminRole,
    validarCampos
],borrarCategoria);

module.exports = router;