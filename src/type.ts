import z from 'zod';

export const CreateUserSchema=z.object({
    username:z.string(),
    password:z.string()
})


// export const todoSchema=z.object({
//     title:z.string(),
//     description:z.string(),

// })