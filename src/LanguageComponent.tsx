import {
    selectConstantsError,
    selectConstantsText, selectFunctionsError, selectFunctionsText, selectPredicatesError,
    selectPredicatesText,
    updateConstants,
    updateFunctions,
    updatePredicates
} from "./state/slices/languageSlice.ts";
import {useDispatch, useSelector} from "react-redux";
import {Card} from "react-bootstrap";
import LanguageInput from "./LanguageInput.tsx";


export default function LanguageComponent() {
    const constantsText: string = useSelector(selectConstantsText);
    const predicatesText: string = useSelector(selectPredicatesText);
    const functionsText: string = useSelector(selectFunctionsText);
    const constantsError  = useSelector(selectConstantsError);
    const predicatesError = useSelector(selectPredicatesError);
    const functionsError = useSelector(selectFunctionsError);
    console.log(constantsError, predicatesError, functionsError);

    const dispatch = useDispatch();

    return (
        <Card>
            <Card.Body>
                <LanguageInput
                    label={"Individual constants"}
                    prefix={"𝓒𝓛 = {"}
                    suffix={"}"}
                    text={constantsText}
                    onChange={e =>
                        dispatch(updateConstants(e.target.value))
                    }
                    error={constantsError.error}
                />

                <LanguageInput
                    label={"Predicate symbols"}
                    prefix={"𝓟𝓛 = {"}
                    suffix={"}"}
                    text={predicatesText}
                    onChange={e =>
                        dispatch(updatePredicates(e.target.value))
                    }
                    error={predicatesError.error}
                />

                <LanguageInput
                    label={"Function symbols"}
                    prefix={"𝓕𝓛 = {"}
                    suffix={"}"}
                    text={functionsText}
                    onChange={e =>
                        dispatch(updateFunctions(e.target.value))
                    }
                    error={functionsError.error}
                />
            </Card.Body>
        </Card>
    )
}