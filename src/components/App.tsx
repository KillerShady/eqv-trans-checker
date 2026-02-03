import '../App.css'
import LanguageComponent from "./LanguageComponent.tsx";
import TaskComponent from "./TaskComponent.tsx";

export default  function App() {
    return (
        <div className="app">
            <LanguageComponent />
            <TaskComponent />
        </div>
    )
}
