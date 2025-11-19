const express = require('express');
const router = express.Router();
const { globalSearch } = require('../controllers/searchController');
const { checkAuth, checkAdmin } = require('../middleware/authMiddleware');


router.get('/',checkAuth, globalSearch);

module.exports = router;