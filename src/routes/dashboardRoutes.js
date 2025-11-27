const express = require('express');
const router = express.Router();
const { getDashboardStats, getClientsStats } = require('../controllers/dashboardController');
const { checkAuth } = require('../middleware/authMiddleware');

router.get('/stats', checkAuth, getDashboardStats);
router.get('/client-stats', checkAuth, getClientsStats);

module.exports = router;