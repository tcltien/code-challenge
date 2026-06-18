import { Router } from 'express';
import { BookController } from '../controllers/book.controller';
import { BookService } from '../services/book.service';
import { BookRepository } from '../repository/book.repository';
import { validate } from '../middleware/validation.middleware';
import { z } from 'zod';
import { CreateBookSchema, UpdateBookSchema, FilterBookSchema, BookIdSchema } from '../schemas/book.schema';

const router = Router();
const bookRepository = new BookRepository(); // Instantiate repository
const bookService = new BookService(bookRepository); // Inject repository into service
const bookController = new BookController(bookService); // Inject service into controller

router.post('/', validate(CreateBookSchema), bookController.create);
router.get('/', validate(FilterBookSchema), bookController.list);
router.get('/:id', validate(z.object({ params: BookIdSchema })), bookController.getDetails);
router.put('/:id', validate(UpdateBookSchema), bookController.update);
router.delete('/:id', validate(z.object({ params: BookIdSchema })), bookController.delete);
export default router;