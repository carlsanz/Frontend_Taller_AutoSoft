import './login.css';
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();


  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailError(emailRegex.test(value) ? '' : 'Por favor introduce un correo válido');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (emailError) return;

    try {
      const response = await axios.post('http://localhost:5001/auth/login', { email, password });

      console.log('Respuesta del backend:', response.data);
      alert(response.data.message);

      const { role, primerIngreso, nombre } = response.data;

      // Guardar datos en localStorage como booleano
      localStorage.setItem('role', role);
      localStorage.setItem('email', email);
      localStorage.setItem('primerIngreso', JSON.stringify(primerIngreso));
      localStorage.setItem('nombre', nombre);

      navigate('/home'); // Redirigir al home
    } catch (error) {
      setLoginError(error.response?.data?.message || 'Error desconocido');
    }
  };

  return (
    <div id="container">
      <header className="head-form">
        <h1>AUTOSOFT</h1>
      </header>
      <div id="imgFondo"></div>
      <div id="form-container">
        <form onSubmit={handleSubmit} id="form1">
          <h2>Login</h2>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              validateEmail(e.target.value);
            }}
            placeholder="Email"
            required
            id="email"
          />
          {emailError && <p className="error-message">{emailError}</p>}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            required
            id="password"
          />
          <button type="submit">Iniciar sesión</button>
          {loginError && <p className="error-message">{loginError}</p>}
        </form>
      </div>
    </div>
  );
};

export default LoginForm;


