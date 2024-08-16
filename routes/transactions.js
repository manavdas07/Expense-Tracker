const { addExpense, getExpense, deleteExpense } = require('../controllers/Expense');
const {addIncome, getIncomes, deleteIncome} = require('../controllers/Income');
const { loginUser, registerUser } = require('../controllers/userauth');
const { authMiddleWare } = require('../middleware/auth');
const router = require('express').Router();



router.post('/add-income', addIncome)
router.get('/get-incomes',getIncomes)
router.delete('/delete-income/:id',deleteIncome)
router.post('/add-expense', addExpense)
router.get('/get-expenses', getExpense)
router.delete('/delete-expense/:id', deleteExpense)
router.post('/loginUser',loginUser,authMiddleWare)
router.post('/registerUser',registerUser,authMiddleWare)


module.exports = router;