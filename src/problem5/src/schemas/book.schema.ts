import { z } from 'zod';

export const CreateBookSchema = z.object({
    body: z.object({
        title: z.string().min(1, "Title is required"),
        author: z.string().min(1, "Author is required"),
        publishedYear: z.number().int().optional(),
        genre: z.string().optional(),
    }),
});

export const UpdateBookSchema = z.object({
    params: z.object({
        id: z.coerce.number().int().positive(),
    }),
    body: z.object({
        title: z.string().min(1).optional(),
        author: z.string().min(1).optional(),
        publishedYear: z.number().int().optional(),
        genre: z.string().optional(),
    }).refine(data => Object.keys(data).length > 0, {
        message: "At least one field must be provided for update",
    }),
});

export const FilterBookSchema = z.object({
    query: z.object({
        title: z.string().optional(),
        author: z.string().optional(),
        genre: z.string().optional(),
        // pagination
        page: z.string().optional(),
        limit: z.string().optional(),
    }),
});

export const BookIdSchema = z.object({
    id: z.coerce.number().int().positive({ message: 'Invalid ID' }),
});