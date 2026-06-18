import { Request, Response, NextFunction } from 'express';
import { BookService } from '../services/book.service';
import { BookMapper } from '../mappers/book.mapper';

export class BookController {
    constructor(private service: BookService) { }

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = BookMapper.toCreateDTO(req.body);
            const result = await this.service.createBook(dto);
            res.status(201).json(result);
        } catch (e) {
            next(e);
        }
    };

    list = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = BookMapper.toFilterDTO(req.query);
            const result = await this.service.listBooks(dto);
            res.status(200).json(result);
        } catch (e) {
            next(e);
        }
    };

    getDetails = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = Number(req.params.id);
            const result = await this.service.getBookById(id);
            if (!result) return res.status(404).json({ error: 'Book not found' });
            res.json(result);
        } catch (e) {
            next(e);
        }
    };

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = Number(req.params.id);
            const dto = BookMapper.toUpdateDTO(req.body);
            const result = await this.service.updateBook(id, dto);
            if (!result) return res.status(404).json({ error: 'Book not found' });
            res.json(result);
        } catch (e) {
            next(e);
        }
    };

    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = Number(req.params.id);
            const result = await this.service.deleteBook(id);
            if (!result) return res.status(404).json({ error: 'Book not found' });
            res.json({ message: 'Book deleted successfully' });
        } catch (e) {
            next(e);
        }
    };
}