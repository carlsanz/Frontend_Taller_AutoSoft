import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const role = localStorage.getItem('role');
    const navigate = useNavigate();

    return (
        <div>
            <h1>Bienvenido al Home</h1>
            
            {role === 'Administrador' && (
               <button onClick={() => navigate('/agregar-usuario')}>
               Agregar Nuevo Usuario
             </button> // Solo se muestra para Administrador
            )}
        </div>
    );
};

export default Home;