import express from 'express';
import AppController from '../controllers/AppController.js';
import AuthController from '../controllers/AuthController.js';

const SECRET_KEY = '123456789';
const router = express.Router();

const auth = new AuthController();

/**
 * @swagger
 * /:
 *  get:
 *     summary: Brisk API Home
 *     description: Check API is up
 *     tags:
 *       - General
 *     responses:
 *         200:
 *             description: API Up and running
 */
router.get('/', (req, res) => {
    AppController.home(req, res);
})

/**
 * @swagger
 * /about:
 *  get:
 *      summary: About the API
 *      description: Get necesary about about the API
 *      tags:
 *        - General
 *      responses:
 *          200:
 *              description: Necessary information
 */
router.get('/about', (req, res) => {
    AppController.about(req, res);
});

/**
 * @swagger
 * /stats:
 *  get:
 *     summary: Get API stats
 *     description: This endpoints return the stats of the API
 *     tags:
 *       - General
 *     responses:
 *         200:
 *             description: Correct stats from DB
 *         401:
 *             description: User not authorized
 */
router.get('/stats', auth.authenticateSession, (req, res) => {
    AppController.getStat(req, res);
})

router.get('/bitcoin', (req, res) => {
    AppController.bitcoinprice(req, res);
})

export default router;
