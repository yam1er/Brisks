import express from 'express';
import TransactionController from '../controllers/TransactionController';
import AuthController from '../controllers/AuthController';

const auth = new AuthController();
const transactionsRouter = express.Router();

/**
 * @swagger
 * /transactions:
 *  get:
 *     summary: Get list of transactions
 *     description: Provide list of transaction available on the platform
 *     tags:
 *       - Transactions
 *     responses:
 *         200:
 *             description: Correct list of transactions
 *         401:
 *             description: Not authorized
 */
transactionsRouter.get('/transactions', auth.authenticateSession, (req, res) => {
    TransactionController.getTransactions(req, res);
})

/**
 * @swagger
 * /transactions/:id:
 *  get:
 *     summary: get a transaction with id
 *     description: Get the details of a transaction with id
 *     tags:
 *       - Transactions
 *     parameters:
 *          - name: id
 *            in: path
 *            required: true
 *            description: transaction id
 *            schema:
 *              type: string
 *     responses:
 *         200:
 *             description: The transaction
 *         401:
 *             description: Transaction not found
 */
transactionsRouter.get('/transactions/:id', auth.authenticateSession, (req, res) => {
    TransactionController.getTransaction(req, res);
})

/**
 * @swagger
 * /transactions:
 *  post:
 *     summary: Add new transaction
 *     description: create new transaction
 *     tags:
 *       - Transactions
 *     responses:
 *         201:
 *             description: Transaction added successful
 *         400:
 *             description: Transaction
 */
transactionsRouter.post('/transactions', (req, res) => {
    TransactionController.postNew(req, res);
})

export default transactionsRouter;