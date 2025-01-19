import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import LoginForm from "./users/LoginForm";
import ForgotPassword from "./users/ForgotPassword";
import CreateAccount from "./users/CreateAccount";
import Background from "./users/BackGround";

import Navbar from "./home/Navbar";
import BlogList from "./components/BlogList";
import BlogDashboard from "./components/BlogDashboard";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <ChakraProvider>
        <Router>
          <div className=" w-full">
            <Background />
            <Routes>
              {/* Login-related routes */}
              <Route path="/" element={<LoginForm />} />
              <Route path="/forgot" element={<ForgotPassword />} />
              <Route path="/create" element={<CreateAccount />} />
              <Route path="/login" element={<LoginForm />} />
            


              {/* Navbar and nested routes */}
              <Route path="/navbar" element={<Navbar />}>
                <Route path="blog-list" element={<BlogList />} />
                <Route path="blog-dashboard" element={<BlogDashboard />} />
              </Route>
            </Routes>
          </div>
        </Router>
      </ChakraProvider>
    </div>
  );
}

export default App;
