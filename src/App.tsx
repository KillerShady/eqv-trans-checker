import './App.css'
import LanguageComponent from "./features/language/LanguageComponent.tsx";
import TaskComponent from "./features/mainTask/TaskComponent.tsx";
import {Container} from "react-bootstrap";
import ImportExportComponent from "./features/import/ImportExportComponent.tsx";

export default function App({ viewOnly }: { viewOnly: boolean }) {
    return (
        <div className="eqv-trans-checker">
            <Container fluid className={viewOnly ? "view-mode" : ""}>
                <ImportExportComponent />
                <LanguageComponent />
                <TaskComponent />
            </Container>
        </div>
    )
}
