import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo2 from './styles/pictures/logo2-removebg-preview.png';
import taller3 from './styles/pictures/taller3.jpg';

const ChangePassword = () => {
  const [email, setEmail] = useState(localStorage.getItem('email') || '');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();
  let alertParam = false;

  // Recibe query parameter alert
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    alertParam = urlParams.get('alert');

    if (alertParam === 'true') {
      alert('Debes cambiar tu contraseña para continuar');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://169.254.5.241:5000/api/password/mecanico', {
        email,
        oldPassword,
        newPassword
      });
      alert(response.data.message);
      navigate('/home');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al cambiar la contraseña';
      alert(errorMessage);
    }
  };

  return (
    <div
    style={{  width: '100vw', overflowX: 'visible',  backgroundSize: 'cover', backgroundPosition: ' top', backgroundImage: `url(${taller3})` }}
    className="relative min-h-full flex items-center justify-center"
    >
      <div className="bg-opacity-70 rounded-lg shadow-lg p-8 sm:max-w-md w-full max-w-md mx-auto my-10"
           style={{ backgroundColor: '#1F1F1F', opacity: 0.9 }}>
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
                Correo electrónico
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#F6B51B] text-base"
                />
              </div>
            </div>

            <div>
              <label htmlFor="oldPassword" className="block text-sm font-medium text-white">
                Contraseña Anterior
              </label>
              <div className="mt-2">
                <input
                  id="oldPassword"
                  name="oldPassword"
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                  placeholder="Contraseña Anterior"
                  className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#F6B51B] text-base"
                />
              </div>
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-white">
                Nueva Contraseña
              </label>
              <div className="mt-2">
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="Nueva Contraseña"
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
                Cambiar Contraseña
              </button>
            </div>

            <div>
              <button
                type="button"
                className="w-full justify-center rounded-md px-3 py-2 mt-1 text-sm font-semibold text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{ backgroundColor: '#F6B51B' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#D99A17'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#F6B51B'}
                onClick={() => navigate('/home')}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;