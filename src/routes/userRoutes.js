const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

const {checkAuth} = require('../middleware/authMiddleware');

//veo que sea un admin y ejecuto la funcion de crear un usuario y obtenerlos
router.post('/',checkAuth, userController.createUser);

router.get('/',checkAuth,userController.getAllUsers);

module.exports = router;