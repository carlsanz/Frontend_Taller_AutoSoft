<<<<<<< HEAD
import React from 'react';
import { useNavigate } from 'react-router-dom';
=======
import './Home.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import botones from './botones.json'; 
>>>>>>> main

const Home = () => {
    const role = localStorage.getItem('role');
    const navigate = useNavigate();

    return (
<<<<<<< HEAD
        <div>
            <h1>Bienvenido al Home</h1>
            
            {role === 'Administrador' && (
               <button onClick={() => navigate('/agregar-usuario')}>
               Agregar Nuevo Usuario
             </button> // Solo se muestra para Administrador
            )}
=======
        <div id='principal'>
            <header>
                <button id='btn-menu'>
                    <img src='/image/menu.png' alt='Menu'/>
                </button>
                <button id='btn-perfil'>
                    <img src='/image/perfil.png' alt='Perfil'/>
                </button>
            </header>
            <div id='body'>
                <div className='grid-container'>
                    {botones
                        .filter(boton => boton.visiblePara.includes(role)) 
                        .map((boton, index) => (
                            <div className='grid-item' key={index}>
                                <button id={boton.id} onClick={() => navigate(boton.ruta)}>
                                    <img id='icon' src={boton.imagen} alt={boton.titulo} className="circular-image" />
                                </button>
                                <h2>{boton.titulo}</h2>
                            </div>
                        ))
                    }
                    <img id='logo' src="/image/logo.png" alt="Logo" />
                </div>
            </div>
>>>>>>> main
        </div>
    );
};

<<<<<<< HEAD
export default Home;
=======
export default Home;
>>>>>>> main
