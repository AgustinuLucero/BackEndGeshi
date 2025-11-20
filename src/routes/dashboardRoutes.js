const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboardController');
const { checkAuth } = require('../middleware/authMiddleware');

router.get('/stats', checkAuth, getDashboardStats);

module.exports = router;