import React, {useEffect, useState } from 'react';
import axios from 'axios';
import './Formularios.css'; // Asegúrate de tener los estilos necesarios
import Modal from 'react-modal'; // Asegúrate de tener react-modal instalado
import { useNavigate } from 'react-router-dom';
Modal.setAppElement('#root'); // Cambia '#root' por el ID de tu elemento raíz


const AgregarUsuario = () => {
    const navigate = useNavigate();
    
    const [empleados, setEmpleados] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [departamentos, setDepartamentos] = useState([]);
    const [formData, setFormData] = useState({
        Nombre: '',
        Email: '', // Este es el único campo de correo
        Contraseña: '',
        Rol: '',
        Identidad: '',
        Id_departamento: '',
        P_nombre: '',
        S_nombre: '',
        P_apellido: '',
        S_apellido: '',
        Direccion: '',
        Telefono: '',
        Fecha_nac: '',
        Genero: '',
        Ocupacion: '',
        Salario: '',
        Fecha_contratacion: '',
        Primer_ingreso:''
    });
    const [isEditMode, setIsEditMode] = useState(false);
    const [identidadABuscar, setIdentidadABuscar] = useState('');

    //obetener los departamentos
    useEffect(()=>{
        const fetchDepartamentos = async ()=> {
            try {
                const response = await axios.get('http://localhost:5000/api/departamentos');
                setDepartamentos(response.data);
                } catch (error) {
                    console.error('Error al obtener los departamentos', error);
        }
};
fetchDepartamentos();
}, []);

//manejo de fechas 
const formatDate = (dateString) => {
    if (!dateString) return ''; // Verifica si la fecha es nula o vacía
    const date = new Date(dateString); // Convierte la cadena en un objeto Date
    const day = String(date.getUTCDate()).padStart(2, '0'); // Ajustar para obtener el día correcto
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Ajustar mes
    const year = date.getUTCFullYear();
    return `${year}-${month}-${day}`; // Retornar en formato yyyy-mm-dd para que el input date lo entienda
};


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

//buscar usuarios 
const handleBuscarUsuario = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.get(`http://localhost:5000/usuarios-completo/empleados/${identidadABuscar}`);
        
        // Aplicamos el formato a las fechas antes de actualizar el estado
        const usuario = response.data;
        usuario.Fecha_nac = formatDate(usuario.Fecha_nac);
        usuario.Fecha_contratacion = formatDate(usuario.Fecha_contratacion);
        
        setFormData(usuario);
        setIsEditMode(true);
        setIsModalOpen(true);
    } catch (error) {
        console.error('Error al buscar usuario:', error);
        alert('Usuario no encontrado.');
    }
};

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const method = isEditMode ? 'PUT' : 'POST';
        const url = isEditMode ? `http://localhost:5000/usuarios-completo/${formData.Identidad}` : 'http://localhost:5000/usuarios-completo';
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error al guardar usuario:', errorData);
            throw new Error('Error al guardar usuario');
        }

        alert(isEditMode ? 'Usuario actualizado exitosamente' : 'Datos agregados exitosamente');
        setIsModalOpen(false);
        resetForm();
    } catch (error) {
        alert('Error al guardar los datos');
        console.error('Error:', error);
    }
};

// eliminar usuario
const handleEliminarUsuario = async () => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
        return;
    }
    try {
        const response = await axios.delete(`http://localhost:5000/usuarios-completo/${formData.Identidad }/${formData.Email}`);
        if (response.status === 200) {
            alert('Usuario eliminado exitosamente');
            setIsModalOpen(false);
            resetForm();
        } else {
            alert('Error al eliminar el usuario');
        }
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        alert('Error al eliminar el usuario');
    }
};

const resetForm = () => {
    setFormData({
        Nombre: '',
        Email: '',
        Contraseña: '',
        Rol: '',
        Primer_ingreso:'',
        Identidad: '',
        Id_departamento: '',
        P_nombre: '',
        S_nombre: '',
        P_apellido: '',
        S_apellido: '',
        Direccion: '',
        Telefono: '',
        Fecha_nac: '',
        Genero: '',
        Ocupacion: '',
        Salario: '',
        Fecha_contratacion: ''
    });
    setIsEditMode(false);
};

useEffect(() => {
    // Llamada al backend para obtener los datos de los empleados
    fetch('http://localhost:5000/usuarios-completo/empleados')  // Cambia el puerto y la ruta si es necesario
        .then((response) => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            return response.json();
        })
        .then((data) => setEmpleados(data))
        .catch((error) => console.error('Error al obtener empleados:', error));
}, []);





    return (
        <div className='container'>
           <div className='form-header'>
                <h2 className="form-title" >..Agregando Usuario y Empleado</h2>
                <button className="cancel-button" onClick={() => {navigate('/home')}}>
                        Cancelar
                    </button>
            </div>
            <form onSubmit={handleBuscarUsuario}>
                <input
                    type="text"
                    placeholder="Buscar por Identidad"
                    value={identidadABuscar}
                    onChange={(e) => setIdentidadABuscar(e.target.value)}
                    required
                    />
                    <button type="submit" className='submit-button'>Buscar</button>
            </form>
            <button className='submit-button' onClick={() => { setIsModalOpen(true); resetForm(); }}>Agregar</button>

            <table>
            <thead>
                <tr>
                    <th>Identidad</th>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>Genero</th>
                    <th>Direccion</th>
                </tr>
            </thead>
            <tbody>
                {empleados.length === 0 ? (
                    <tr>
                        <td colSpan="5">No hay empleados registrados</td>
                    </tr>
                ) : (
                    empleados.map((empleado) => (
                        <tr key={empleado.Identidad}>
                            <td>{empleado.Identidad}</td>
                            <td>{empleado.Nombre}</td>
                            <td>{empleado.Apellido}</td>
                            <td>{empleado.Genero}</td>
                            <td>{empleado.Direccion}</td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>





            <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)}>
             <h2>{isEditMode ? 'Actualizar Usuario' : 'Formulario de Registro'}</h2>
             <form className='form-container' onSubmit={handleSubmit}>
                {/* Campos de Personas */}
                <div className='cont-externo'>
                        <div className='cont-interno'>
                            <h3>Datos de Persona</h3>
                            <label>Identidad</label>
                            <input className='form-input' type="text" name="Identidad" value={formData.Identidad} onChange={handleInputChange} required />

                            <label>Departamento</label>
                            <select
                                className='form-input'
                                name="Id_departamento"
                                value={formData.Id_departamento}
                                onChange={handleInputChange}
                                //disabled={!isEditMode}
                            >
                            <option value="">--Selecciona un departamento--</option>
                                {departamentos.map((departamento) => (
                                    <option key={departamento.Id_departamento} value={departamento.Id_departamento}>
                                    {departamento.Nombre}
                                    </option>
                                ))}
                            </select>

                            <label>Primer Nombre</label>
                            <input className='form-input'  type="text" name="P_nombre" value={formData.P_nombre} onChange={handleInputChange} required />

                            <label>Segundo Nombre</label>
                            <input className='form-input'  type="text" name="S_nombre" value={formData.S_nombre} onChange={handleInputChange} />

                            <label>Primer Apellido</label>
                            <input className='form-input'  type="text" name="P_apellido" value={formData.P_apellido} onChange={handleInputChange} required />

                            <label>Segundo Apellido</label>
                            <input className='form-input'  type="text" name="S_apellido" value={formData.S_apellido} onChange={handleInputChange} />

                            <label>Dirección</label>
                            <input className='form-input'  type="text" name="Direccion" value={formData.Direccion} onChange={handleInputChange} />

                            <label>Teléfono</label>
                            <input className='form-input'  type="text" name="Telefono" value={formData.Telefono} onChange={handleInputChange} />

                            <label>Fecha de Nacimiento</label>
                            <input 
                                className='form-input' 
                                type="date" 
                                name="Fecha_nac" 
                                value={formData.Fecha_nac} 
                                onChange={handleInputChange} 
                                required 
                            />
                            <label>Género</label>
                            <input className='form-input'  type="text" name="Genero" value={formData.Genero} onChange={handleInputChange} required />
                        </div>
                </div>

                {/* Campos de Usuarios */}
                <div className='cont-externo'>
                        <div className='cont-interno'>
                            <h3>Datos de Usuario</h3>
                            <label>Nombre</label>
                            <input className='form-input' type="text" name="Nombre" value={formData.Nombre} onChange={handleInputChange} required />

                            <label>Email</label>
                            <input className='form-input' type="email" name="Email" value={formData.Email} onChange={handleInputChange} required />

                            <label>Contraseña</label>
                            <input className='form-input' type="password" name="Contraseña" value={formData.Contraseña} onChange={handleInputChange} required />

                            <label>Rol</label>
                            <input className='form-input' type="text" name="Rol" value={formData.Rol} onChange={handleInputChange} required />

                            <label> Primer inicio de sesión:</label>
                            <input
                                className='form-input'
                                type="checkbox"
                                name='Primer_ingreso'
                                value={formData.Primer_ingreso}
                                
                            />
                        
                        </div>
                            {/* Campos de Empleados */}
                        <div className='cont-interno'>
                            <h3>Datos de Empleado</h3>
                            <label>Ocupación</label>
                            <input className='form-input'  type="text" name="Ocupacion" value={formData.Ocupacion} onChange={handleInputChange} required />

                            <label>Salario</label>
                            <input className='form-input'  type="number" name="Salario" value={formData.Salario} onChange={handleInputChange} required />

                            <label>Fecha de Contratación</label>
                            <input 
                                className='form-input' 
                                type="date" 
                                name="Fecha_contratacion" 
                                value={formData.Fecha_contratacion} 
                                onChange={handleInputChange} 
                                required 
                            />
                        </div>
                            <button className='submit-button' type="submit">{isEditMode ? 'Actualizar' : 'Guardar'}</button>
                            {isEditMode && (
                                <button className='submit-button' type="button" onClick={handleEliminarUsuario} style={{ backgroundColor: 'red', color: 'white' }}>
                                    Eliminar
                                </button>
                            )}
                            <button className='submit-button' type="button" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default AgregarUsuario;