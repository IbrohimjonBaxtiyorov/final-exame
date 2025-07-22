import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider, useSelector } from "react-redux";
import { store } from "./lib/redux-tollkit/store";
import Home from "./pages/Home";
import { Login } from "./pages/Login";
import Register from "./pages/Register";
import Members from "./pages/Members";
import Roundes from "./pages/Roundes";
import Statistics from "./pages/Statistics";
import Settings from "./pages/Settings";
import { ThemeProvider } from "./components/ThemeProvider";

function PrivateRoutes({ children }) {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  return isLoggedIn ? children : <Login />;
}

function PublicRoutes({ children }) {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  return !isLoggedIn ? children : <Home />;
}

function AppContent() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoutes>
            <Login />
          </PublicRoutes>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoutes>
            <Register />
          </PublicRoutes>
        }
      />

      <Route
        path="/"
        element={
          <PrivateRoutes>
            <Home />
          </PrivateRoutes>
        }
      />

      <Route
        path="/members"
        element={
          <PrivateRoutes>
            <Members />
          </PrivateRoutes>
        }
      />

      <Route
        path="/rounds"
        element={
          <PrivateRoutes>
            <Roundes />
          </PrivateRoutes>
        }
      />

      <Route
        path="/statistics"
        element={
          <PrivateRoutes>
            <Statistics />
          </PrivateRoutes>
        }
      />
      <Route
        path="/settings"
        element={
          <PrivateRoutes>
            <Settings />
          </PrivateRoutes>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
