import { z } from "zod";

export const authValidation = z.object({
    name: z.string().regex(/^[a-zA-Z][a-zA-Z0-9_-]{2,19}$/, {
        message:
            "Name must start with a letter and be between 3-20 characters long, containing only letters, numbers, underscores, or hyphens.",
    }),
    email: z
        .string()
        .email({ message: "Please enter a valid email address." })
        .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
            message: "Please enter a valid email address.",
        }),
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters long." })
        .max(20, { message: "Password must not exceed 20 characters." }),
});
