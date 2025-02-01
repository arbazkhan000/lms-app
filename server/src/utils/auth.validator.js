import { z } from 'zod';

 const RegisterValidationSchema = z.object({
    firstname: z.string().regex(/^[a-zA-Z]{3,20}$/, {
        message: 'Firstname must be between 3-20 letters and contain only alphabets.',
    }),
    lastname: z.string().regex(/^[a-zA-Z]{3,20}$/, {
        message: 'Lastname must be between 3-20 letters and contain only alphabets.',
    }),
    email: z.string().email({ message: 'Please enter a valid email address.' }),
    password: z
        .string()
        .min(8, { message: 'Password must be at least 8 characters long.' })
        .max(20, { message: 'Password must not exceed 20 characters.' }),
});

// Separate schema for login
 const LoginValidationSchema = z.object({
    email: z.string().email({ message: 'Please enter a valid email address.' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters long.' }),
});



export { LoginValidationSchema, RegisterValidationSchema };