import {z} from "zod";
import {symbolWithAritySchema} from "../language/languageValidationSchema.ts";

const transformationStateSchema = z.object({
    id: z.number(),
    formulas: z.array(z.number()),
});
const formulaStateSchema = z.object({
    id: z.number(),
    formula: z.string(),
    operation: z.string(),
    prevFormula: z.number().optional(),
    name: z.string().optional(),
});
const skolemSymbolsStateSchema = z.object({
    text: z.string(),
    constants: z.array(z.string()),
    functions: z.array(symbolWithAritySchema),
})

export const serializedTransformationsStateSchema = z.object({
    transSequences: z.array(z.number()),
    transSequenceKey: z.number(),
    transformations: z.record(z.number(), transformationStateSchema),
    formulas: z.record(z.number(), formulaStateSchema),
    formulasKey: z.number(),
    skolemSymbols: z.record(z.number(), skolemSymbolsStateSchema),
    contextFormulaNames: z.array(z.string()),
}).superRefine((transformations, context) => {
    for (const sequence of transformations.transSequences) {
        if (! (sequence in transformations.transformations)) {
            context.addIssue({
                code: "custom",
                message: `Found invalid key ${sequence} for transformations.`,
                input: transformations.transSequences,
            });
        }
    }
    const seenFormulas = new Set<number>();
    for (const transformation of Object.values(transformations.transformations)) {
        for (const formula of transformation.formulas) {
            if (! (formula in transformations.formulas)) {
                context.addIssue({
                    code: "custom",
                    message: `Found invalid key ${formula} for formulas.`,
                    input: transformations.transformations,
                });
            }
            if (formula in seenFormulas) {
                context.addIssue({
                    code: "custom",
                    message: `Formula ${formula} used more than once.`,
                    input: transformations.transformations,
                });
            }
            seenFormulas.add(formula);
        }
    }

});