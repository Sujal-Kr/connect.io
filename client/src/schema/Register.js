import { z } from 'zod';
import { Password } from './Login';
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];
export const RegisterSchema = z.object({
    name: z.string()
        .min()
        .regex(/^[a-zA-Z\s]+$/, "Name contains invalid characters"),
    username: z.string()
        .regex(/^[a-zA-Z0-9]+$/, "Username can only contain letters and numbers")
        .min(4, "Username must be at least 4 characters"),
    bio: z.string().optional(),
    password: Password,
    avatar: z
        .instanceof(File,"Image not found")
        .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
            message: 'Only .jpg, .jpeg, and .png formats are allowed.',
        })
        .refine((file) => file.size <= MAX_FILE_SIZE, {
            message: 'File size should be less than 2MB.',
        }),
}).required();
