import React, { useEffect, useState } from 'react';
import './Formularios.css'; // Asegúrate de tener los estilos necesarios
import axios from 'axios';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';

const Clientes = () => {
    const navigate = useNavigate();
    const [identidad, setIdentidad] = useState('');
    const [cliente, setCliente] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isAddingMode, setIsAddingMode] = useState(false);
    const [departamentos, setDepartamentos] = useState([]);
    const [formData, setFormData] = useState({
        Identidad: '',
        Id_departamento: '',
        P_nombre: '',
        S_nombre: '',
        P_apellido: '',
        S_apellido: '',
        Direccion: '',
        Telefono: '',
        Fecha_nac: '',
        correo: '',
        Genero: 'Femenino', // Valor por defecto
    });
    const role = localStorage.getItem('role');

    //obtener las colonias al cargar componentes
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

// para la busqueda de los clientes mediante identidad
const handleSearch = async () => {
    try {
        const response = await axios.get(`http://localhost:5000/api/clientes/${identidad}`);
        let clienteData = response.data;
        if (clienteData.Fecha_nac) {
            clienteData.Fecha_nac = new Date(clienteData.Fecha_nac).toISOString().split('T')[0];
        }
        setCliente(response.data);
        setFormData(response.data);  // Cargar datos en el formulario
        setIsModalOpen(true);  // Abrir modal
        setIsEditMode(false);  // No edición al buscar
        setIsAddingMode(false);  // No agregar
    } catch (error) {
        alert('Cliente no encontrado');
        setCliente(null);
    }
};
//para agregar los nuevos clientes
    const handleAdd = () => {
        setIsModalOpen(true);
        setIsEditMode(false);
        setIsAddingMode(true); // Activar modo agregar
        setFormData({
            Identidad: '',
            Id_departamento: '',
            P_nombre: '',
            S_nombre: '',
            P_apellido: '',
            S_apellido: '',
            Direccion: '',
            Telefono: '',
            Fecha_nac: '',
            correo: '',
            Genero: 'Femenino',
        }); // Limpiar el formulario
    };
    // para manejo de la actualizacion de los clientes
    const handleEdit = () => {
        setIsEditMode(true); // Habilitar el modo edición
    };
    // para manejo de la eliminacion de los clientes
    const handleDelete = async () => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
            try {
                await axios.delete(`http://localhost:5000/api/clientes/${formData.Identidad}`);
                alert('Cliente eliminado');
                setCliente(null);
                setIdentidad('');
                setIsModalOpen(false);  // Cerrar modal al eliminar
            } catch (error) {
                alert('Error al eliminar el cliente');
            }
        }
    };
    // manejo de los cambios en los inputs del formulario
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();  // Evitar recarga de la página
    
        try {
            if (isAddingMode) {
                // Si estamos en modo de agregar, hacer POST
                await axios.post('http://localhost:5000/api/clientes', formData);
                alert('Cliente agregado exitosamente');
            } else if (isEditMode) {
                // Si estamos en modo de edición, hacer PUT para actualizar
                await axios.put(`http://localhost:5000/api/clientes/${formData.Identidad}`, formData);
                alert('Cliente actualizado exitosamente');
            }
            // Cerrar modal y limpiar estado
            setIsModalOpen(false);
            setCliente(null);
            setIdentidad('');  // Limpiar campo de identidad
        } catch (error) {
            alert('Error al agregar o actualizar el cliente');
            console.error(error);
        }
    };

    return (
        <div className='container'>
        <div className='form-header'>
                <h2 className="form-title" >Clientes</h2>
                <button className="cancel-button" onClick={() => {navigate('/home')}}>
                        Cancelar
                </button>
            </div> 

            <div className='gestiones'>
            <button className="btn-agregar" onClick={handleAdd} disabled={role !== 'Administrador' && !cliente}>
                Agregar Cliente
            </button>
              <input
                className='input-buscar'
                type="text"
                placeholder="Buscar por número de identidad"
                value={identidad}
                onChange={(e) => setIdentidad(e.target.value)}
            />
            <button className='btn-buscar' onClick={handleSearch}>Buscar</button>
            </div>

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
                    {Clientes.length === 0 ? (
                        <tr>
                            <td colSpan="5"></td>
                        </tr>
                    ) : (
                        Clientes.map((clientes) => (
                            <tr key={clientes.identidad}>
                                <td>{clientes.P_nombre}</td>
                                <td>{clientes.P_apellido}</td>
                                <td>{clientes.Genero}</td>
                                <td>{clientes.Direccion}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>




            

<Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)}>
<h2>{isAddingMode ? 'Agregar Cliente' : 'Detalles del Cliente'}</h2>
    <form className='form-container' onSubmit={handleSubmit}>
    <div className='cont-externo'>
    <div className='cont-cliente'>
        <div className='cont-cliente-interno'>
            <label>Identidad</label>
            <input
                className='form-input'
                type="text"
                name="Identidad"
                value={formData.Identidad}
                onChange={handleInputChange}
                readOnly={!isEditMode && !isAddingMode} // Solo editable si estamos en modo edición
            />

            <label>Departamento</label>
            <select
                className='form-input'
                name="Id_departamento"
                value={formData.Id_departamento}
                onChange={handleInputChange}
                disabled={!isEditMode && !isAddingMode}
            >
                <option value="">--Selecciona un departamento--</option>
                {departamentos.map((departamentos) => (
                    <option key={departamentos.Id_departamento} value={departamentos.Id_departamento}>
                        {departamentos.Nombre}
                    </option>
                ))}
            </select>

            <label>Primer Nombre</label>
            <input
                className='form-input'
                type="text"
                name="P_nombre"
                value={formData.P_nombre}
                onChange={handleInputChange}
                readOnly={!isEditMode && !isAddingMode}
            />

            <label>Segundo Nombre</label>
            <input
                className='form-input'
                type="text"
                name="S_nombre"
                value={formData.S_nombre}
                onChange={handleInputChange}
                readOnly={!isEditMode && !isAddingMode}
            />

            <label>Primer Apellido</label>
            <input
                className='form-input'
                type="text"
                name="P_apellido"
                value={formData.P_apellido}
                onChange={handleInputChange}
                readOnly={!isEditMode && !isAddingMode}
            />

            <label>Segundo Apellido</label>
            <input
                className='form-input'
                type="text"
                name="S_apellido"
                value={formData.S_apellido}
                onChange={handleInputChange}
                readOnly={!isEditMode && !isAddingMode}
            />
            </div>
            <div className='cont-cliente-interno'>
            <label>Dirección</label>
            <input
                className='form-input'
                type="text"
                name="Direccion"
                value={formData.Direccion}
                onChange={handleInputChange}
                readOnly={!isEditMode && !isAddingMode}
            />

            <label>Teléfono</label>
            <input
                className='form-input'
                type="text"
                name="Telefono"
                value={formData.Telefono}
                onChange={handleInputChange}
                readOnly={!isEditMode && !isAddingMode}
            />

            <label>Fecha de Nacimiento</label>
            <input
                className='form-input'
                type="date"
                name="Fecha_nac"
                value={formData.Fecha_nac}
                onChange={handleInputChange}
                readOnly={!isEditMode && !isAddingMode}
            />

            <label>Correo</label>
            <input
                className='form-input'
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleInputChange}
                readOnly={!isEditMode && !isAddingMode}
            />

            <label>Género</label>
            <select
                className='form-input'
                name="Genero"
                value={formData.Genero}
                onChange={handleInputChange}
                disabled={!isEditMode && !isAddingMode}
            >
                <option value="Femenino">Femenino</option>
                <option value="Masculino">Masculino</option>
            </select>
            </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        {isAddingMode ? (
                            <>
        <button className='submit-button' type="button" onClick={() => setIsModalOpen(false)}>
            Cancelar
        </button>
        <button className='submit-button' type="submit">Aceptar</button>  {/* Llama a handleSubmit en agregar */}
                            </>
                        ) : (
                            <>
        <button className='submit-button' type="submit">Aceptar</button>  {/* Llama a handleSubmit en editar */}
        {role === 'Administrador' && (
            <>
                <button className='submit-button' type="button" onClick={handleEdit} disabled={!cliente}>
                    Actualizar
                </button>
                <button className='submit-button' type="button" onClick={handleDelete} disabled={!cliente}>
                    Eliminar
                </button>
                                    </>
                                )}
                            </>
                        )}
            </div>
            </div>
                </form>
            </Modal>
        </div>
    );
};

export default Clientes;