import React, { useEffect, useState } from 'react'
import logo from "../images/logo.png"
import Avatar from 'react-avatar';
import { api_base_url } from '../Helper';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = () => {
  const [error, setError] = useState("");
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getUser = () => {
    fetch(api_base_url + "/getUser", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: localStorage.getItem("userId")
      })
    }).then(res => res.json()).then(data => {
      if (data.success == false) {
        setError(data.message)
      }
      else {
        setData(data.user)
      }
    })
  };

  const logout = () => {
    fetch(api_base_url + "/logout", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: localStorage.getItem("userId")
      })
    }).then(res => res.json()).then(data => {
      if (data.success == false) {
        setError(data.message)
      }
      else {
        localStorage.removeItem("userId");
        localStorage.removeItem("token");
        localStorage.removeItem("isLoggedIn");
        navigate("/login");
      }
    })

  }

  useEffect(() => {
    getUser();
  }, [])

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex-shrink-0">
            <img className="h-14 w-auto" src={logo} alt="Logo" />
          </Link>
          <div className="hidden md:flex items-center space-x-4">
            {data && (
              <span className="text-sm font-medium text-gray-700">{data.name}</span>
            )}
            <Link to="/account" className="relative">
              <Avatar 
                name={data ? data.name : ""} 
                className='cursor-pointer' 
                size="40" 
                round="50%" 
              />
            </Link>
            <button 
              onClick={logout} 
              className='px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-700'
            >
              Logout
            </button>
          </div>
          <div className="md:hidden flex items-center">
            <button 
              className="text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {data && (
              <span className="block text-sm font-medium text-gray-700">{data.name}</span>
            )}
            <Link to="/account" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">
              <Avatar 
                name={data ? data.name : ""} 
                className='cursor-pointer' 
                size="40" 
                round="50%" 
              />
            </Link>
            <button 
              onClick={logout} 
              className='block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-green-600 hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-700'
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar