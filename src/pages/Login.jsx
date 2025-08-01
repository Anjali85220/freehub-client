// Login.js
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (res.ok) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        // Redirect based on role
        if (data.user.role === 'client') {
          navigate('/client')
        } else {
          navigate('/dashboard') // Freelancer dashboard
        }
      } else {
        setError(data.msg)
      }
    } catch (err) {
      setError('Login failed')
    }
  }
  return (
    <div
      className="h-screen w-full bg-cover bg-center flex items-center justify-center relative"
      style={{ backgroundImage: "url('/bg-home.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/40 z-0" />

      <div className="bg-white/10 backdrop-blur-md border border-white/30 rounded-xl shadow-lg p-8 w-80 text-white z-10">
        <h2 className="text-2xl font-bold mb-5 text-center">Login</h2>

        {error && <div className="text-red-300 mb-3 text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full px-3 py-2 rounded bg-white/20"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full px-3 py-2 rounded bg-white/20"
            required
          />
          <button className="w-full bg-white/30 py-2 rounded font-medium hover:bg-white/40">
            Login
          </button>
        </form>

        <p
          className="text-sm text-blue-300 mt-4 text-center cursor-pointer hover:underline"
          onClick={() => navigate('/forgot')}
        >
          Forgot Password?
        </p>

        <p className="text-sm text-center mt-2">
          Don't have an account?{' '}
          <span onClick={() => navigate('/register')} className="underline cursor-pointer text-green-300">
            Register
          </span>
        </p>
      </div>
    </div>
  )
}

export default Login
