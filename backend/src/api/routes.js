import { Router } from 'express';
import { startHandler } from './start.js';
import { judgeHandler } from './judge.js';

export const router = Router();

router.post('/start', startHandler);
router.post('/judge', judgeHandler);

