const express = require('express');
const { 
        addUser, 
        loginUser, 
        logoutUser, 
        getCurrentUser, 
        forgotPassword, 
        updateUser, 
        updateUserPassword 
} = require('../controllers/authentication');
const { protect } = require('../middleware/auth');

const router = express.Router()

router.post('/register', addUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/who', protect,  getCurrentUser);
router.put('/update', protect,  updateUser);
router.put('/updatePassword', protect,  updateUserPassword);
router.put('/reset',  forgotPassword);

module.exports = router;