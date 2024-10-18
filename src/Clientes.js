import React, { useEffect, useState } from 'react';
import './Clientes.css'; // Asegúrate de tener los estilos necesarios
import axios from 'axios';
import Modal from 'react-modal';

const Clientes = () => {
    const [identidad, setIdentidad] = useState('');
    const [cliente, setCliente] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
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

    const handleSearch = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/clientes/${identidad}`);

            let clienteData = response.data;

            if (clienteData.Fecha_nac){
                clienteData.Fecha_nac = new Date(clienteData.Fecha_nac).toISOString().split('T')[0];
            }
            setCliente(response.data);
            setFormData(response.data); // Cargar los datos en el formulario
            setIsModalOpen(true); // Abrir modal al encontrar el cliente
            setIsEditMode(false); // No modo edición al buscar
        } catch (error) {
            alert('Cliente no encontrado');
            setCliente(null);
        }
    };

    const handleAdd = () => {
        setIsModalOpen(true);
        setIsEditMode(false);
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

    const handleEdit = () => {
        setIsEditMode(true); // Habilitar el modo edición
    };

    const handleDelete = async () => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
            try {
                await axios.delete(`http://localhost:5000/api/clientes/${formData.Identidad}`);
                alert('Cliente eliminado');
                setCliente(null);
                setIdentidad('');
                setIsModalOpen(false); // Cerrar modal al eliminar
            } catch (error) {
                alert('Error al eliminar el cliente');
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            if (isEditMode) {
                await axios.put(`http://localhost:5000/api/clientes/${formData.Identidad}`, formData);
                alert('Cliente actualizado');
            } else {
                await axios.post('http://localhost:5000/api/clientes', formData);
                alert('Cliente agregado');
            }
    
            setIsModalOpen(false); // Cerrar modal después de agregar o actualizar
            setCliente(null); // Limpiar datos del cliente después de la operación
            setIdentidad(''); // Limpiar identidad para nueva búsqueda
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
            {role === 'Administrador' && (
                <>
                    <button onClick={handleEdit} disabled={!cliente}>Actualizar Cliente</button>
                    <button onClick={handleDelete} disabled={!cliente}>Eliminar Cliente</button>
                </>
            )}

<Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)}>
    <h2>{isEditMode ? 'Editar Cliente' : 'Detalles del Cliente'}</h2>
    <form onSubmit={handleSubmit}>
        <label>Identidad</label>
        <input
            type="text"
            name="Identidad"
            value={formData.Identidad}
            onChange={handleInputChange}
            readOnly={!isEditMode} // Solo editable si estamos en modo edición
        />

        <label>Colonia</label>
        <select
            name="Id_colonia"
            value={formData.Id_colonia}
            onChange={handleInputChange}
            disabled={!isEditMode} // Solo editable si estamos en modo edición
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
            readOnly={!isEditMode}
        />

        <label>Segundo Nombre</label>
        <input
            type="text"
            name="S_nombre"
            value={formData.S_nombre}
            onChange={handleInputChange}
            readOnly={!isEditMode}
        />

        <label>Primer Apellido</label>
        <input
            type="text"
            name="P_apellido"
            value={formData.P_apellido}
            onChange={handleInputChange}
            readOnly={!isEditMode}
        />

        <label>Segundo Apellido</label>
        <input
            type="text"
            name="S_apellido"
            value={formData.S_apellido}
            onChange={handleInputChange}
            readOnly={!isEditMode}
        />

        <label>Dirección</label>
        <input
            type="text"
            name="Direccion"
            value={formData.Direccion}
            onChange={handleInputChange}
            readOnly={!isEditMode}
        />

        <label>Teléfono</label>
        <input
            type="text"
            name="Telefono"
            value={formData.Telefono}
            onChange={handleInputChange}
            readOnly={!isEditMode}
        />

        <label>Fecha de Nacimiento</label>
        <input
            type="date"
            name="Fecha_nac"
            value={formData.Fecha_nac}
            onChange={handleInputChange}
            readOnly={!isEditMode}
        />

        <label>Correo</label>
        <input
            type="email"
            name="correo"
            value={formData.correo}
            onChange={handleInputChange}
            readOnly={!isEditMode}
        />

        <label>Género</label>
        <select
            name="Genero"
            value={formData.Genero}
            onChange={handleInputChange}
            disabled={!isEditMode}
        >
            <option value="Femenino">Femenino</option>
            <option value="Masculino">Masculino</option>
        </select>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
            <button type="button" onClick={() => setIsModalOpen(false)}>
                Aceptar
            </button>
            {role === 'Administrador' && (
                <>
                    <button type="button" onClick={handleEdit}>
                        Actualizar
                    </button>
                    <button type="button" onClick={handleSubmit}>
                        Guardar
                    </button>
                    <button type="button" onClick={handleDelete}>
                        Eliminar
                    </button>
                </>
            )}
        </div>
    </form>
</Modal>
        </div>
    );
};

export default Clientes;
