import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import taller3 from './styles/pictures/taller3.jpg';
import logo2 from './styles/pictures/logo2-removebg-preview.png';

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
      const response = await axios.post('http://ec2-3-137-140-141.us-east-2.compute.amazonaws.com:5000/auth/login', { email, password });

      console.log('Respuesta del backend:', response.data);
      alert(response.data.message);

      const { role, primerIngreso, nombre } = response.data;

      localStorage.setItem('role', role);
      localStorage.setItem('email', email);
      localStorage.setItem('primerIngreso', JSON.stringify(primerIngreso));
      localStorage.setItem('nombre', nombre);

      navigate('/home');
    } catch (error) {
      setLoginError(error.response?.data?.message || 'Error desconocido');
    }
  };

  return (
    <div
      className="absolute inset-0 bg-cover bg-center"
      style={{ backgroundImage: `url(${taller3})` }}
    >
      <div className="place-self-center bg-opacity-70 rounded-lg shadow-lg p-8 sm:max-w-md w-full max-w-md mx-auto mt-10"
            style={{ backgroundColor: '#1F1F1F', opacity: 0.9}}>
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Your Company"
            src={logo2}
            className="mx-auto"
            style={{ height: '170px', width: 'auto' }}
          />
        </div>

        <div className="mt-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white">
                Correo
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    validateEmail(e.target.value);
                  }}
                  required
                  autoComplete="email"
                  placeholder="Email"
                  className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#F6B51B] text-base"
                />
                {emailError && <p className="text-sm text-red-600 mt-1">{emailError}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white">
                Contraseña
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="Contraseña"
                  className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#F6B51B] text-base"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{ backgroundColor: '#F6B51B' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#D99A17'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#F6B51B'}
              >
                Iniciar sesión
              </button>
              {loginError && <p className="text-sm text-red-600 mt-1">{loginError}</p>}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
