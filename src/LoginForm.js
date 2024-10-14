import './login.css';
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const navigate = useNavigate();

  //Expresiones regualares 
  const validateEmail = (value) =>{
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //validar email
    if (!emailRegex.test(email)){
      setEmailError('Por favor introduce un correo valido');
    }else{
      setEmailError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

  
    if (emailError) return;

    try {
      const response = await axios.post('http://localhost:5000/auth/login', { email, password });
      alert(response.data.message);

      const { role, primerIngreso } = response.data; // Recibir primerIngreso
      localStorage.setItem('role', role); 
      console.log('Rol guardado:', role);

      if (primerIngreso) {
        // Si es el primer ingreso, redirigir a la página de cambio de contraseña
        navigate('/cambiar-contraseña');
      } else {
        // Si no es el primer ingreso, redirigir al home
        navigate('/home');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Error desconocido');
    }
  };

  return (
    <div id="container">
      <header id="header">
        <h1>AUTOSOFT</h1>
      </header>
      <div id="imgFondo"></div>
      <div id="form-container">
        <form onSubmit={handleSubmit} id="form1">
          <h2>Login</h2>
          <input
            type="email"
            value={email}
            onChange={(e) => {setEmail(e.target.value)
            validateEmail(e.target.value);}}
            onBlur={(e)=> validateEmail(e.target.value)}
            placeholder="Email"
            required
            id="email"
          />
          {emailError && <p id="MsjError" className="error.message">{emailError}</p>}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            required
            id="password"
          />
          <button type="submit">Iniciar sesión</button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;


