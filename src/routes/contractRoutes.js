const express = require('express');

const router = express.Router();

const {createContract, getAllContracts, getMyContracts} = require('../controllers/contractController');

const {checkAuth} = require('../middleware/authMiddleware');


//para que un usuario con sesion iniciada vea la lista de contratos
router.get('/', checkAuth ,getAllContracts);
router.get('/my-contracts', checkAuth ,getMyContracts);
router.post('/',checkAuth,createContract);




module.exports = router;