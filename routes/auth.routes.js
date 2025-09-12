const express = require('express');
const { requireAuth } = require('@clerk/express');
const authController = require('../controllers/auth.controller');

const router = express.Router();

// Sau khi login ở FE, gọi API này để sync user vào DB
router.post('/sync', requireAuth(), authController.syncUser);

// Lấy thông tin user hiện tại
router.get('/me', requireAuth(), authController.getMe);

module.exports = router;
