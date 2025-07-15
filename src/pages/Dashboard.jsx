// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    } else {
      navigate('/login') // redirect if not logged in
    }
  }, [navigate])

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center px-4">
      <h1 className="text-3xl text-green-700 font-bold mb-4">Welcome to Freehub</h1>
      {user && (
        <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-sm text-center">
          <h2 className="text-xl font-semibold text-gray-800">👋 {user.name}</h2>
          <p className="text-gray-600 mt-1">Role: {user.role}</p>
          <p className="text-gray-600 mt-1">Email: {user.email}</p>
        </div>
      )}
    </div>
  )
}

export default Dashboard
