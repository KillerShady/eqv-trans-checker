import {z} from "zod";

export const symbolWithAritySchema = z.object({
    name: z.string(),
    arity: z.number(),
})

export const serializedLanguageStateSchema = z.object({
    constants: z.string(),
    predicates: z.string(),
    functions: z.string(),
    parsedConstants: z.array(z.string()),
    parsedPredicates: z.array(symbolWithAritySchema),
    parsedFunctions: z.array(symbolWithAritySchema),
});