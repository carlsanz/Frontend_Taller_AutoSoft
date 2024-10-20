import React, { useEffect, useState } from 'react';
import './Clientes.css'; // Asegúrate de tener los estilos necesarios
import axios from 'axios';
import Modal from 'react-modal';

const Clientes = () => {
    const [identidad, setIdentidad] = useState('');
    const [cliente, setCliente] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isAddingMode, setIsAddingMode] = useState(false);
    const [colonias, setColonias] = useState([]);
    const [formData, setFormData] = useState({
        Identidad: '',
        Id_colonia: '',
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
        const fetchColonias = async ()=> {
            try {
                const response = await axios.get('http://localhost:5000/api/colonias');
                setColonias(response.data);
                } catch (error) {
                    console.error('Error al obtener colonias', error);
        }
};
fetchColonias();
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
            Id_colonia: '',
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
        <div>
            <h2>Administrar Clientes</h2>
            <input
                type="text"
                placeholder="Buscar por número de identidad"
                value={identidad}
                onChange={(e) => setIdentidad(e.target.value)}
            />
            <button onClick={handleSearch}>Buscar</button>

            <button onClick={handleAdd} disabled={role !== 'Administrador' && !cliente}>
                Agregar Cliente
            </button>
            

<Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)}>
<h2>{isAddingMode ? 'Agregar Cliente' : 'Detalles del Cliente'}</h2>
    <form onSubmit={handleSubmit}>
        <label>Identidad</label>
        <input
            type="text"
            name="Identidad"
            value={formData.Identidad}
            onChange={handleInputChange}
            readOnly={!isEditMode && !isAddingMode} // Solo editable si estamos en modo edición
        />

        <label>Colonia</label>
        <select
            name="Id_colonia"
            value={formData.Id_colonia}
            onChange={handleInputChange}
            disabled={!isEditMode && !isAddingMode}
        >
            <option value="">--Selecciona una colonia--</option>
            {colonias.map((colonia) => (
                <option key={colonia.Id_colonia} value={colonia.Id_colonia}>
                    {colonia.Nombre}
                </option>
            ))}
        </select>

        <label>Primer Nombre</label>
        <input
            type="text"
            name="P_nombre"
            value={formData.P_nombre}
            onChange={handleInputChange}
            readOnly={!isEditMode && !isAddingMode}
        />

        <label>Segundo Nombre</label>
        <input
            type="text"
            name="S_nombre"
            value={formData.S_nombre}
            onChange={handleInputChange}
            readOnly={!isEditMode && !isAddingMode}
        />

        <label>Primer Apellido</label>
        <input
            type="text"
            name="P_apellido"
            value={formData.P_apellido}
            onChange={handleInputChange}
            readOnly={!isEditMode && !isAddingMode}
        />

        <label>Segundo Apellido</label>
        <input
            type="text"
            name="S_apellido"
            value={formData.S_apellido}
            onChange={handleInputChange}
            readOnly={!isEditMode && !isAddingMode}
        />

        <label>Dirección</label>
        <input
            type="text"
            name="Direccion"
            value={formData.Direccion}
            onChange={handleInputChange}
            readOnly={!isEditMode && !isAddingMode}
        />

        <label>Teléfono</label>
        <input
            type="text"
            name="Telefono"
            value={formData.Telefono}
            onChange={handleInputChange}
            readOnly={!isEditMode && !isAddingMode}
        />

        <label>Fecha de Nacimiento</label>
        <input
            type="date"
            name="Fecha_nac"
            value={formData.Fecha_nac}
            onChange={handleInputChange}
            readOnly={!isEditMode && !isAddingMode}
        />

        <label>Correo</label>
        <input
            type="email"
            name="correo"
            value={formData.correo}
            onChange={handleInputChange}
            readOnly={!isEditMode && !isAddingMode}
        />

        <label>Género</label>
        <select
            name="Genero"
            value={formData.Genero}
            onChange={handleInputChange}
            disabled={!isEditMode && !isAddingMode}
        >
            <option value="Femenino">Femenino</option>
            <option value="Masculino">Masculino</option>
        </select>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                        {isAddingMode ? (
                            <>
                                <button type="button" onClick={() => setIsModalOpen(false)}>
            Cancelar
        </button>
        <button type="submit">Aceptar</button>  {/* Llama a handleSubmit en agregar */}
                            </>
                        ) : (
                            <>
                                <button type="submit">Aceptar</button>  {/* Llama a handleSubmit en editar */}
        {role === 'Administrador' && (
            <>
                <button type="button" onClick={handleEdit} disabled={!cliente}>
                    Actualizar
                </button>
                <button type="button" onClick={handleDelete} disabled={!cliente}>
                    Eliminar
                </button>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Clientes;
