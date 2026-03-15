import '../App.css'
import LanguageComponent from "./LanguageComponent.tsx";
import TaskComponent from "./TaskComponent.tsx";
import {Container} from "react-bootstrap";
import ImportExportComponent from "./ImportExportComponent.tsx";

export default function App() {
    return (
        <Container fluid>
            <ImportExportComponent />
            <LanguageComponent />
            <TaskComponent />
        </Container>
    )
}
