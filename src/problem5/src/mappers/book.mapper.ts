import { CreateBookDTO, UpdateBookDTO, BookFilterDTO } from '../dtos/book.dto';

export class BookMapper {
    static toCreateDTO(body: any): CreateBookDTO {
        return {
            title: body.title,
            author: body.author,
            publishedYear: body.publishedYear,
            genre: body.genre,
        };
    }

    static toUpdateDTO(body: any): UpdateBookDTO {
        return {
            title: body.title,
            author: body.author,
            publishedYear: body.publishedYear,
            genre: body.genre,
        };
    }

    static toFilterDTO(query: any): BookFilterDTO {
        return {
            title: query.title,
            author: query.author,
            genre: query.genre,
            page: query.page ? Number(query.page) : 1,
            limit: query.limit ? Number(query.limit) : 10,
        };
    }
}