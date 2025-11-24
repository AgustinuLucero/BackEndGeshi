const express = require('express');

const router = express.Router();

const {createContract, getAllContracts, getMyContracts,uploadContractReport} = require('../controllers/contractController');

const {checkAuth} = require('../middleware/authMiddleware');

const upload = require('../middleware/upload');

//para que un usuario con sesion iniciada vea la lista de contratos
router.get('/', checkAuth ,getAllContracts);
router.get('/my-contracts', checkAuth ,getMyContracts);
router.post('/',checkAuth,createContract);
router.post('/upload-report', checkAuth, upload.single('pdfFile'), uploadReport);



module.exports = router;