import React, { useState } from 'react';
import axios from 'axios';
import './AgregarUsuarios.css';

const AgregarUsuario = () => {
    const [nombre, setNombre] = useState('');
    const [nombreError, setnombreError] = useState('');
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [password, setPassword] = useState('');
    const [firstLogin, setFirstLogin] = useState(true); // Campo para primer inicio de sesión

    //Expresiones regulares 
    //validacion nombre
    const validateName = (value)=>{
        const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ' ]{2,50}$/;

        if (!nameRegex.test(nombre)){
            setnombreError('El nombre es demasiado corto');
            }else{
                setnombreError('');
            }
        };
    

    //validacion email
    const validateEmail = (value) =>{
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)){
          setEmailError('Por favor introduce un correo valido');
        }else{
          setEmailError('');
        }
      };



    const handleSubmit = async (e) => {
        e.preventDefault();

        if (nombreError | emailError) return;

        try {
            const response = await axios.post('http://localhost:5000/usuarios/agregar', { 
                nombre, 
                email, 
                contraseña: password,
                firstLogin // Se envía el campo firstLogin en la solicitud
            });
            alert(response.data.message);
        } catch (error) {
            alert(error.response?.data?.message || 'Error desconocido');
        }
    };

    return (
        <div className="form-container">
            <div className="form-header">
                <h2 className="form-title"> Creando usuario</h2>
                <button className="cancel-button" onClick={() => {/* lógica para cancelar */}}>
                    Cancelar
                </button>
            </div>
            <form className="user-form" onSubmit={handleSubmit}>
                <input
                    className="form-input"
                    type="text"
                    value={nombre}
                    onChange={(e) => {setNombre(e.target.value)
                                validateName(e.target.value);}}
                    onBlur={(e)=> validateName(e.target.value)}            
                    placeholder="Nombre"
                    required
                />
                {nombreError && <p id="MsjError" className="error.message">{nombreError}</p>}
                <input
                    className="form-input"
                    type="email"
                    value={email}
                    onChange={(e) => {setEmail(e.target.value)
                        validateEmail(e.target.value);}}
                    onBlur={(e)=> validateEmail(e.target.value)}
                    placeholder="Email"
                    required
                />
                {emailError && <p id="MsjError" className="error.message">{emailError}</p>}
                <input
                    className="form-input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Contraseña"
                    required
                />
                <label>
                    Primer inicio de sesión:
                    <input
                        type="checkbox"
                        checked={firstLogin}
                        onChange={(e) => setFirstLogin(e.target.checked)}
                    />
                </label>
                <button className="submit-button" type="submit">Agregar Usuario</button>
            </form>
        </div>
    );
};

export default AgregarUsuario;

