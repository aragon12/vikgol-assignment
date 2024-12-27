import { Router } from "express";
import bookController from '../books.js';

const router = Router();
router.get('/', bookController.getBooks);
router.post('/', bookController.createBook);
router.get('/:id', bookController.getBookById);
router.delete('/:id', bookController.deleteBookById);

export default router;