import {z} from "zod";
import {serializedLanguageStateSchema} from "../language/languageValidationSchema.ts";
import {serializedMainTaskStateSchema} from "../mainTask/mainTaskValidationSchema.ts";

export const serializedAppStateSchema = z.object({
    language: serializedLanguageStateSchema,
    mainTask: serializedMainTaskStateSchema,
});

export type serializedAppState = z.infer<typeof serializedAppStateSchema>;