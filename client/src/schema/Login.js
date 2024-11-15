import { z } from 'zod';


export const Password= z.string()
.min(8, { message: "Password must be at least 8 characters long" })
// .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
// .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
// .regex(/[0-9]/, { message: "Password must contain at least one number" })
// .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" })


export const LoginSchema = z.object({
    username: z.string()
        .regex(/^[a-zA-Z0-9]+$/, "Username can only contain letters and numbers")
        .min(4, "Username must be at least 4 characters"),
    password:Password
    
}).required();
