import {
    selectConstantsText, selectFunctionsText,
    selectPredicatesText,
    updateConstants,
    updateFunctions,
    updatePredicates
} from "./state/slices/languageSlice.ts";
import {useDispatch, useSelector} from "react-redux";


export default function LanguageComponent() {
    const constantsText: string = useSelector(selectConstantsText);
    const predicatesText: string = useSelector(selectPredicatesText);
    const functionsText: string = useSelector(selectFunctionsText);

    const dispatch = useDispatch();

    return (
        <>
            <div className="language">
                <h3>Language ℒ</h3>
                <div className="row">
                    <div className="form-group">
                        <div className="preprend">
                            <div className="input-group-text">𝓒<sub>𝓛</sub> = {"{"}</div>
                        </div>
                        <input type="text"
                               id="input-constants"
                               value={constantsText}
                               onChange={e => dispatch(updateConstants(e.target.value))}></input>
                        <div className="append">
                            <div className="input-group-text">{"}"}</div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="form-group">
                        <div className="preprend">
                            <div className="input-group-text">𝓟<sub>𝓛</sub> = {"{"}</div>
                        </div>
                        <input type="text"
                               id="input-predicates"
                               value={predicatesText}
                               onChange={e => dispatch(updatePredicates(e.target.value))}></input>
                        <div className="append">
                            <div className="input-group-text">{"}"}</div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="form-group">
                        <div className="preprend">
                            <div className="input-group-text">𝓕<sub>𝓛</sub> = {"{"}</div>
                        </div>
                        <input type="text"
                               id="input-functions"
                               value={functionsText}
                               onChange={e => dispatch(updateFunctions(e.target.value))}></input>
                        <div className="append">
                            <div className="input-group-text">{"}"}</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}