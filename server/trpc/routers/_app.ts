import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';
import { PropertiesRouter } from './UserRouter';
export const appRouter = createTRPCRouter({
  Propertie:PropertiesRouter,

  hello: baseProcedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .query((opts) => {
      return {
        greeting: `hello ${opts.input.text}`,
      };
    }),


     // 2. Query: Add Two Numbers
  addNumbers: baseProcedure
    .input(z.object({ a: z.number(), b: z.number() }))
    .query(({ input }) => {
      return { result: input.a + input.b };
    }),

  // 3. Mutation: Reverse a String
  reverseString: baseProcedure
    .input(z.object({ value: z.string() }))
    .mutation(({ input }) => {
      return { reversed: input.value.split('').reverse().join('') };
    }),

  // 4. Mutation: Create a "User"
  createUser: baseProcedure
    .input(z.object({ name: z.string().min(2), age: z.number().min(0) }))
    .mutation(({ input }) => {
      // Dummy implementation; in real life, you'd store this in a DB
      return {
        id: Math.floor(Math.random() * 10000), // random id
        name: input.name,
        age: input.age,
      };
    }),
});
// export type definition of API
export type AppRouter = typeof appRouter;