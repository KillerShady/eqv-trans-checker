import {z} from "zod";

const transformationStateSchema = z.object({
    id: z.number(),
    formulas: z.array(z.number()),
});
const formulaStateSchema = z.object({
    id: z.number(),
    formula: z.string(),
    operation: z.string(),
    prevFormula: z.number().optional(),
});

export const serializedMainTaskStateSchema = z.object({
    transSequences: z.array(z.number()),
    transSequenceKey: z.number(),
    transformations: z.record(z.number(), transformationStateSchema),
    formulas: z.record(z.number(), formulaStateSchema),
    formulasKey: z.number(),
});