const express = require('express');
const router = express.Router();
const generateController = require('../controllers/generateController');

// ESG 보고서 생성 라우트
router.post('/generate', generateController.generateReport);

module.exports = router; 