import { Router } from 'express';
import { register, login, sendCode, verifyCode, resetPassword } from '../controllers/auth.controller';

const router = Router();

router.post('/register', register);
router.post('/login', login);

// Email verification (code-based)
router.post('/send-code', sendCode);
router.post('/verify-code', verifyCode);
router.post('/reset', resetPassword);

export default router;



