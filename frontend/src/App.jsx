import { BrowserRouter, Routes, Route } from "react-router-dom"
import NotFound from "./components/NotFound"
import Home from "./components/Home"
import Register from "./components/Register"
import Login from "./components/Login"

function App() {
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path='/*' element={<NotFound />} />
                    <Route path='/register' element={<Register />} />
                    <Route path='/login' element={<Login/>}/>
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default App;
