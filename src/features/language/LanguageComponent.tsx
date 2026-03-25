import {
    selectConstantsError,
    selectConstantsText, selectFunctionsError, selectFunctionsText, selectPredicatesError,
    selectPredicatesText, selectSymbolsClash,
    updateConstants,
    updateFunctions,
    updatePredicates
} from "./languageSlice.ts";
import {useDispatch, useSelector} from "react-redux";
import { InlineMath } from "react-katex";
import LanguageInput from "./LanguageInput.tsx";


export default function LanguageComponent() {
    const constantsText: string = useSelector(selectConstantsText);
    const predicatesText: string = useSelector(selectPredicatesText);
    const functionsText: string = useSelector(selectFunctionsText);
    const constantsError  = useSelector(selectConstantsError);
    const predicatesError = useSelector(selectPredicatesError);
    const functionsError = useSelector(selectFunctionsError);
    const symbolsClash = useSelector(selectSymbolsClash);
    console.log("drawing language");

    const dispatch = useDispatch();

    return (
        <div>
            <h4>
                Language <InlineMath>{String.raw`\mathcal{L}`}</InlineMath>
            </h4>
            <LanguageInput
                label={"Individual constants"}
                prefix={<InlineMath>{String.raw`\mathcal{C_L} = \{`}</InlineMath>}
                suffix={<InlineMath>{String.raw`\}`}</InlineMath>}
                text={constantsText}
                onChange={e =>
                    dispatch(updateConstants(e.target.value))
                }
                error={constantsError.error ?? symbolsClash.constantsClash}
            />

            <LanguageInput
                label={"Predicate symbols"}
                prefix={<InlineMath>{String.raw`\mathcal{P_L} = \{`}</InlineMath>}
                suffix={<InlineMath>{String.raw`\}`}</InlineMath>}
                text={predicatesText}
                onChange={e =>
                    dispatch(updatePredicates(e.target.value))
                }
                error={predicatesError.error ?? symbolsClash.predicatesClash}
            />

            <LanguageInput
                label={"Function symbols"}
                prefix={<InlineMath>{String.raw`\mathcal{F_L} = \{`}</InlineMath>}
                suffix={<InlineMath>{String.raw`\}`}</InlineMath>}
                text={functionsText}
                onChange={e =>
                    dispatch(updateFunctions(e.target.value))
                }
                error={functionsError.error ?? symbolsClash.functionsClash}
            />
        </div>
    )
}