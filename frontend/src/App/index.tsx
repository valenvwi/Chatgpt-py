import { Route, Routes, BrowserRouter } from "react-router-dom";
import Chats from "./Chats";
import Login from "./Login";
import Signup from "./Signup";
import ProtectedRoute from "../service/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Chats />{" "}
            </ProtectedRoute>
          }
        />

        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
