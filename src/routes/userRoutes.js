const express = require('express');
const router = express.Router();
const {createUser,getAllUsers ,deleteUser} = require('../controllers/userController');

const {checkAuth} = require('../middleware/authMiddleware');

//veo que sea un admin y ejecuto la funcion de crear un usuario y obtenerlos
router.post('/',checkAuth, createUser);

router.get('/',checkAuth, getAllUsers);

router.delete('/:userId', checkAuth, deleteUser);



module.exports = router;