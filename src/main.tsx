import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import "katex/dist/katex.min.css";
import {AppComponent, prepare} from "./AppComponent.tsx";
import type {LogicContext} from "./LogicContext.ts";

const context: LogicContext = {
    constants: ["kitty"],
    predicates: [{name: "cat", arity:1},{name: "loves", arity:2}],
    functions: [],

    formulas: [{name:"F1", formula:"\\E x cat(x)"}],
    axioms: [{name:"A1", formula:"\\A z cat(z)"}],
    theorems: [],
}

const instance = prepare(null).instance;

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AppComponent instance={instance} isEdited={false} onStateChange={() => {}} context={undefined}/>
    </StrictMode>,
)