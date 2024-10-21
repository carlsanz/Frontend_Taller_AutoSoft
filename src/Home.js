import './Home.css';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import botones from './botones.json';

const Home = () => {
  const role = localStorage.getItem('role');
  const nombre = localStorage.getItem('nombre');
  const primerIngreso = JSON.parse(localStorage.getItem('primerIngreso')); 
  const [showModal, setShowModal] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (role === 'Mecanico' && primerIngreso) {
      setShowModal(true); 
    }
    console.log(role, primerIngreso);

  }, [role, primerIngreso]);

  const handleChangePassword = () => {
    localStorage.setItem('primerIngreso', JSON.stringify(false)); // Actualizar primer ingreso
    setShowModal(false);
    navigate('/cambiar-contraseña'); // Redirigir a cambiar contraseña
  };

  const handleLogout = () => {
    localStorage.clear(); // Limpiar localStorage para cerrar sesión
    navigate('/'); // Redirigir al login
  };

  return (
    <div id="principal">
      <header className="head-home">
        <div id="personal-information">
          <button id="btn-menu">{nombre || 'Usuario'}</button>
          <div id='close'>
          <button 
              id="btn-perfil" 
              onClick={() => setShowLogout(!showLogout)} // Alternar visibilidad del botón de cerrar sesión
            >
              <img src="/image/perfil.png" alt="Perfil" />
            </button>

            {showLogout && (
              <button id="btn-logout" onClick={handleLogout}>
                Cerrar sesión
              </button>
            )}
        </div>
        </div>
        <div id="menu">
          {botones
            .filter((boton) => boton.visiblePara.includes(role))
            .map((boton, index) => (
              <div className="grid-item" key={index}>
                <button id={boton.id} onClick={() => navigate(boton.ruta)}>
                  <img
                    id="icon"
                    src={boton.imagen}
                    alt={boton.titulo}
                    className="circular-image"
                  />
                </button>
                <h4>{boton.titulo}</h4>
              </div>
            ))}
        </div>
      </header>

      <div id="target-citas">
        <div className="card">Cita 1</div>
        <div className="card">Cita 2</div>
        <div className="card">Cita 3</div>
        <div className="card">Cita 4</div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <img src="/image/advertencia.png" alt="Advertencia" />
            <h2>Debes cambiar tu contraseña</h2>
            <button className="bt-cambiar-pass" onClick={handleChangePassword}>
              Cambiar contraseña
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;