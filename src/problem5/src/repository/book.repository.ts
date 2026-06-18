import { BookFilterDTO } from "../dtos/book.dto";
import { getDb } from "../config/db";

export class BookRepository {

    async create(book: any) {
        const db = await getDb();

        const result = await db.run(
            `INSERT INTO books (title, author, publishedYear, genre)
             VALUES (?, ?, ?, ?)`,
            [
                book.title,
                book.author,
                book.publishedYear ?? null,
                book.genre ?? null
            ]
        );

        return {
            id: result.lastID,
            ...book
        };
    }

    async findAll(params: {
        filters: BookFilterDTO;
        limit: number;
        offset: number;
    }) {
        const db = await getDb();
        let whereClause = ` WHERE 1=1`;
        const filterValues: any[] = [];

        // filters
        if (params.filters.title) {
            whereClause += ` AND title LIKE ?`;
            filterValues.push(`%${params.filters.title}%`);
        }
        if (params.filters.author) {
            whereClause += ` AND author LIKE ?`;
            filterValues.push(`%${params.filters.author}%`);
        }
        if (params.filters.genre) {
            whereClause += ` AND genre = ?`;
            filterValues.push(params.filters.genre);
        }

        // Data query
        const dataQuery = `SELECT * FROM books ${whereClause} ORDER BY createdAt DESC LIMIT ? OFFSET ?`;
        const data = await db.all(dataQuery, [...filterValues, params.limit, params.offset]);

        // total count (for pagination metadata)
        const countQuery = `SELECT COUNT(*) as total FROM books ${whereClause}`;
        const countResult = await db.get(countQuery, filterValues);

        return {
            data,
            pagination: {
                total: countResult.total,
                limit: params.limit,
                offset: params.offset
            }
        };
    }

    async findById(id: number) {
        const db = await getDb();
        return db.get(
            `SELECT * FROM books WHERE id = ?`,
            [id]
        );
    }

    async update(id: number, updates: any) {
        const db = await getDb();
        const fields: string[] = [];
        const values: any[] = [];

        if (updates.title !== undefined) {
            fields.push("title = ?");
            values.push(updates.title);
        }

        if (updates.author !== undefined) {
            fields.push("author = ?");
            values.push(updates.author);
        }

        if (updates.publishedYear !== undefined) {
            fields.push("publishedYear = ?");
            values.push(updates.publishedYear);
        }

        if (updates.genre !== undefined) {
            fields.push("genre = ?");
            values.push(updates.genre);
        }

        if (fields.length === 0) return null;
        values.push(id);
        await db.run(
            `UPDATE books SET ${fields.join(", ")} WHERE id = ?`,
            values
        );
        return this.findById(id);
    }

    async delete(id: number) {
        const db = await getDb();
        const result = await db.run(
            `DELETE FROM books WHERE id = ?`,
            [id]
        );
        return (result?.changes ?? 0) > 0;
    }
}