import {z} from "zod";
import {serializedLanguageStateSchema} from "../language/languageValidationSchema.ts";
import {serializedTransformationsStateSchema} from "../transformations/transformationsValidationSchema.ts";

export const serializedAppStateSchema = z.object({
    language: serializedLanguageStateSchema,
    transformations: serializedTransformationsStateSchema,
});

export type serializedAppState = z.infer<typeof serializedAppStateSchema>;