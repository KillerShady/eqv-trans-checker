import './App.css'
import LanguageComponent from "./features/language/LanguageComponent.tsx";
import TaskComponent from "./features/mainTask/TaskComponent.tsx";
import {Container} from "react-bootstrap";
import ImportExportComponent from "./features/import/ImportExportComponent.tsx";

export default function App() {
    return (
        <Container fluid>
            <ImportExportComponent />
            <LanguageComponent />
            <TaskComponent />
        </Container>
    )
}
