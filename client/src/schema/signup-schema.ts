import { z } from "zod";

const regex = {
    password: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]).{8,}$/,
};

export const SignUpSchema = z.object({
    name: z
        .string()
        .min(2, { message: "Name must be at least 2 characters long" })
        .max(50, { message: "Name must be at most 50 characters long" }),
    
    email: z
        .string()
        .email({ message: "Invalid email address" }),

    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .max(12, { message: "Password must be at most 12 characters long" })
        .regex(regex.password, { message: "Password must contain at least one letter, one number, and one special character" }),

    confirmPassword: z
        .string()

}).refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password and Confirm Password do not match",
});

export type SignUpSchemaType = z.infer<typeof SignUpSchema>;
