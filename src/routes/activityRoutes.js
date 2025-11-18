const express = require('express');

const router = express.Router();

const {createActivity, getMyActivities} = require('../controllers/activityController');

const upload = require('../middleware/upload');

const {checkAuth} = require('../middleware/authMiddleware');
const { get } = require('./contractRoutes');

//cliente ve sus actividades
router.get('/my-activities', checkAuth, getMyActivities);

//aplico middleware a la ruta post, me difjo si paso por autenticaccion, si tiene un pdf y guardo la actividad
router.post('/',checkAuth ,upload.single('pdfFile'), createActivity);

module.exports = router;