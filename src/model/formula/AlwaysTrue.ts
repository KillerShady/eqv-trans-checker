import type Structure from "../Structure.ts";
import type { Valuation } from "../Structure.ts";
import Formula, {SignedFormulaType, type SignedFormula} from "./Formula.ts";

class AlwaysTrue extends Formula {
    constructor() {
        super([], "", "");
    }
    toString(): string {
        return `⊤`;
    }
    eval(_structure: Structure, _e: Valuation): boolean {
        throw new Error("Method not implemented.");
    }
    getSignedType(_sign: boolean): SignedFormulaType {
        throw new Error("Method not implemented.");
    }
    getSignedSubFormulas(_: boolean): SignedFormula[] {
        throw [];
    }
}

export default AlwaysTrue;