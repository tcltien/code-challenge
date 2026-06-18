import { BookRepository } from '../repository/book.repository';
import { CreateBookDTO, UpdateBookDTO, BookFilterDTO } from '../dtos/book.dto';

export class BookService {
    constructor(private repo: BookRepository) { }

    createBook(data: CreateBookDTO) {
        return this.repo.create(data);
    }

    listBooks(dto: BookFilterDTO) {
        const { page = 1, limit = 10, ...filters } = dto;
        const offset = (page - 1) * limit;

        return this.repo.findAll({
            filters,
            limit,
            offset,
        });
    }

    getBookById(id: number) {
        return this.repo.findById(id);
    }

    updateBook(id: number, data: UpdateBookDTO) {
        return this.repo.update(id, data);
    }

    deleteBook(id: number) {
        return this.repo.delete(id);
    }
}