import { z } from "zod";

const ZCreateBook = z.object({
  body: z.object({
    title: z.string({ required_error: "Title is required !!" }),
    author: z.string({ required_error: "Author is required !!" }),
    price: z.number({ required_error: "Price is required !!" }),
    genre: z.string({ required_error: "Genre is required !!" }),
    publicationDate: z.string({
      required_error: "Publication date is requied !!",
    }),
    categoryId: z.string({ required_error: "Category id is required !!" }),
  }),
});

const ZUpdateBook = z.object({
  body: z.object({
    title: z.string().optional(),
    author: z.string().optional(),
    price: z.number().optional(),
    genre: z.string().optional(),
    publicationDate: z.string().optional(),
    categoryId: z.string().optional(),
  }),
});

export { ZCreateBook, ZUpdateBook };
