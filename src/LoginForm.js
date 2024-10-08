import './login.css';
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post('http://localhost:5000/auth/login', { email, password });
        alert(response.data.message);
        const { role } = response.data; 
        localStorage.setItem('role', role); 
        console.log('Rol guardado:', role); 
        console.log('Rol recibido:', localStorage.getItem('role')); 
        navigate('/home'); 
      } catch (error) {
          alert(error.response?.data?.message || 'Error desconocido');
      }
  };

    return (
    <div id="container">
      <header id="header">
       
        <h1>AUTOSOFT</h1>
      </header>
      <div id="form-container">
        <form onSubmit={handleSubmit} id="form1">
            <h2>Login</h2>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                id="email"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                required
                id="password"
            />
            <a href='#'>¿Olvidaste tu contraseña?</a>
            <button type="submit">Iniciar sesión</button>
        </form>
        </div>
        </div>

    );
}; 

export default LoginForm;
