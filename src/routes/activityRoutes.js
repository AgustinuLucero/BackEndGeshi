const express = require('express');

const router = express.Router();

const {createActivity, getActivitiesByContract} = require('../controllers/activityController');

const upload = require('../middleware/upload');

const {checkAuth} = require('../middleware/authMiddleware');


//aplico middleware a la ruta post, me difjo si paso por autenticaccion, si tiene un pdf y guardo la actividad
router.post('/',checkAuth ,upload.single('pdfFile'), createActivity);
router.get('/contract/:contractId', checkAuth,getActivitiesByContract)

module.exports = router;