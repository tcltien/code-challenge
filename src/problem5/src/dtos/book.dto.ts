export interface CreateBookDTO {
    title: string;
    author: string;
    publishedYear?: number;
    genre?: string;
}

export interface UpdateBookDTO {
    title?: string;
    author?: string;
    publishedYear?: number;
    genre?: string;
}

export interface BookFilterDTO {
    title?: string;
    author?: string;
    genre?: string;
    page?: number;
    limit?: number;
}