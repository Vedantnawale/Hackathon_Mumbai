import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

function Navbar() {
  const [activeBox, setActiveBox] = useState(null);

  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user session (e.g., remove token)
    localStorage.removeItem("authToken");

    // Optionally clear other user data or state
    // Navigate to the login page
    navigate("/");
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="border-b border-gray-800 bg-gray-900/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <button className="btn btn-ghost btn-square">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </button>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 text-transparent bg-clip-text">
                Dashboard
              </span>
            </div>

            {/* Right section */}
            <div className="flex items-center space-x-6">
              {/* Notification Button */}
              <button className="btn btn-ghost btn-circle relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 hover:text-gray-100 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full" />
              </button>

              {/* User Profile */}
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                  <div className="w-10 rounded-full ring ring-indigo-500 ring-offset-base-100">
                    <img
                      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop"
                      alt="User Profile"
                    />
                  </div>
                </label>
                <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-gray-800 rounded-box w-52">
                  <li><a href="#">Profile</a></li>
                  <li><a href="#">Settings</a></li>
                  <li><a href="#">Support</a></li>
                  <button
                      onClick={handleLogout}
                      className="text-red-500"
                    >
                      Log out
                    </button>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Analytics Box */}
          <NavLink
            to="/navbar/blog-list"
            className={`p-6 rounded-xl transition-all duration-500 ${
              activeBox === "analytics"
                ? "bg-gradient-to-br from-indigo-900 via-purple-900 to-purple-700 scale-[1.02]"
                : "bg-gray-800"
            }`}
            onMouseEnter={() => setActiveBox("analytics")}
            onMouseLeave={() => setActiveBox(null)}
          >
            <h3 className="text-xl font-semibold text-gray-100 mb-2">Analytics Dashboard</h3>
            <p className="text-gray-400">
              Track your performance metrics and insights with our advanced analytics tools.
            </p>
            <div className="mt-4 flex justify-end">
              <span className="text-indigo-400 text-sm">View Details →</span>
            </div>
          </NavLink>

          {/* Reports Box */}
          <NavLink
            to="/blog-portal"
            className={`p-6 rounded-xl transition-all duration-500 ${
              activeBox === "reports"
                ? "bg-gradient-to-br from-purple-900 via-pink-900 to-pink-700 scale-[1.02]"
                : "bg-gray-800"
            }`}
            onMouseEnter={() => setActiveBox("reports")}
            onMouseLeave={() => setActiveBox(null)}
          >
            <h3 className="text-xl font-semibold text-gray-100 mb-2">Generated Reports</h3>
            <p className="text-gray-400">
              Access and download comprehensive reports for your business needs.
            </p>
            <div className="mt-4 flex justify-end">
              <span className="text-purple-400 text-sm">View Details →</span>
            </div>
          </NavLink>
        </div>

        {/* Render child routes */}
        <Outlet />
      </div>
    </div>
  );
}

export default Navbar;
