import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo2 from './styles/pictures/logo2-removebg-preview.png';
import taller3 from './styles/pictures/taller3.jpg';
import Mensaje from './Mensaje';

const ChangePassword = () => {
  const [email, setEmail] = useState(localStorage.getItem('email') || '');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();
  let alertParam = false;

  const [mensaje, setMensaje] = useState(''); // Mensaje a mostrar
  const [tipoMensaje, setTipoMensaje] = useState(''); // Tipo de mensaje

  const mostrarMensaje = (msg, tipo) => {
  setMensaje(msg);
  setTipoMensaje(tipo);
  };

  // Recibe query parameter alert
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    alertParam = urlParams.get('alert');

    if (alertParam === 'true') {
      mostrarMensaje('Debes cambiar tu contraseña para continuar', 'alert');
    }
  }, []);



  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/password/mecanico', {
        email,
        oldPassword,
        newPassword
      });
      mostrarMensaje(response.data.message, 'success');
      navigate('/home');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al cambiar la contraseña';
      mostrarMensaje(errorMessage, 'error');
    }
  };

  return (
    <div
  className="absolute inset-0 bg-cover bg-center p-0 h-screen flex justify-center items-center"
  style={{
    width: '100vw',
    backgroundSize: 'cover',
    backgroundPosition: 'top',
    backgroundImage: `url(${taller3})`,
  }}
>
 
 <div
    className="bg-opacity-70 rounded-lg shadow-lg p-8 sm:max-w-md w-[90%] sm:h-[90%] max-w-md "
    style={{ backgroundColor: '#1F1F1F', opacity: 0.9 }}
  >
        <div className="sm:mx-auto sm:w-full sm:max-w-sm  ">
          <img
            alt="Your Company"
            src={logo2}
            className="mx-auto"
            style={{ height: '170px', width: 'auto' }}
          />
        </div>
        <Mensaje
            mensaje={mensaje}
            tipo={tipoMensaje}
            onClose={() => setMensaje(null)} // Cierra el mensaje
          />

        <div className="mt-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
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