import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Autos.css';
import Modal from 'react-modal';

const Autos = () => {
    const [placa, setPlaca] = useState('');
    const [autos, setAutos] = useState([]);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [autoSeleccionado, setAutoSeleccionado] = useState(null);
    const [identidad, setIdentidad] = useState('');
    const [modelos, setModelos] = useState([]);
    const [tipos, setTipos] = useState([]);
    const [colores, setColores] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isAddingMode, setIsAddingMode] = useState(false);

    const role = localStorage.getItem('role');

    // Función para obtener todos los autos y datos de desplegables
    const fetchAutos = async () => {
        try {
            const [respuestaAutos, respuestaModelos, respuestaTipos, respuestaColores] = await Promise.all([
                axios.get('http://localhost:5000/autos/obtener'),
                axios.get('http://localhost:5000/autos/modelos'),
                axios.get('http://localhost:5000/autos/tipos'),
                axios.get('http://localhost:5000/autos/colores')
            ]);

            setModelos(respuestaModelos.data);
            setTipos(respuestaTipos.data);
            setColores(respuestaColores.data);

            const autosConNombres = respuestaAutos.data.map((auto) => {
                const modeloNombre = respuestaModelos.data.find(m => m.Id_modelo === auto.Id_modelo)?.Nombre || 'Desconocido';
                const tipoNombre = respuestaTipos.data.find(t => t.Id_tipo === auto.Id_tipo)?.Nombre || 'Desconocido';
                const colorNombre = respuestaColores.data.find(c => c.Id_color === auto.Id_color)?.Nombre || 'Desconocido';

                return {
                    ...auto,
                    Modelo: modeloNombre,
                    Tipo: tipoNombre,
                    Color: colorNombre
                };
            });

            setAutos(autosConNombres);
        } catch (error) {
            console.error('Error al obtener datos:', error);
        }
    };

    useEffect(() => {
        fetchAutos();
    }, []);

    // Función para buscar un auto por placa y abrir el modal en modo edición
    const handleBuscar = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/autos/placa/${placa}`);
            setAutoSeleccionado(response.data);
            setIdentidad(response.data.Identidad);
            setModalAbierto(true);
            setIsEditMode(true); // No edición al buscar
            setIsAddingMode(false);

            
        } catch (error) {
            alert('Auto no encontrado');
            setAutoSeleccionado(null);
        }
    };

    // Función para abrir el formulario de agregar un nuevo auto
    const handleAgregar = () => {
        setModalAbierto(true);
        setIsEditMode(false);
        setIsAddingMode(true);
        setAutoSeleccionado({
            Id: null,
            Placa: '',
            Id_modelo: '',
            Id_tipo: '',
            Id_color: '',
            Numero_vin: '',
            Identidad: ''
        });
        setIdentidad('');
    };

    const handleEdit = () => {
        setIsEditMode(true); // Habilitar el modo edición
    };

    // Función para guardar o actualizar un auto
    const handleGuardar = async () => {
        if (!autoSeleccionado) return; // Agrega esta línea para evitar errores

        try {
            const autoParaGuardar = {
                Id: autoSeleccionado.Id,
                Placa: autoSeleccionado.Placa,
                Id_modelo: parseInt(autoSeleccionado.Id_modelo, 10) || null,
                Id_tipo: parseInt(autoSeleccionado.Id_tipo, 10) || null,
                Id_color: parseInt(autoSeleccionado.Id_color, 10) || null,
                Numero_vin: autoSeleccionado.Numero_vin,
                Identidad: identidad,
            };

            if (autoSeleccionado.Id && isEditMode) {
                // Actualización
                await axios.put(`http://localhost:5000/autos/${autoSeleccionado.Id}`, autoParaGuardar);
                alert('Auto actualizado exitosamente');
            } else if (isAddingMode) {
                // Nuevo registro
                await axios.post('http://localhost:5000/autos', autoParaGuardar);
                alert('Auto guardado exitosamente');
            }
            fetchAutos();
            setModalAbierto(false);
        } catch (error) {
            console.error('Error al guardar o actualizar el auto:', error);
        }
    };

    // Función para eliminar un auto
    const handleEliminar = async () => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
            try {
                if (autoSeleccionado && autoSeleccionado.Id) {
                    await axios.delete(`http://localhost:5000/autos/${autoSeleccionado.Id}`);
                    alert('Auto eliminado exitosamente');
                }
                fetchAutos();
                setModalAbierto(false);
            } catch (error) {
                console.error('Error al eliminar el auto:', error);
            }
        }
    };

    // Función para manejar el cambio de identidad
    const handleIdentidadChange = async (e) => {
        const nuevaIdentidad = e.target.value;
        setIdentidad(nuevaIdentidad);

        if (nuevaIdentidad.length === 13) {
            try {
                const response = await axios.get(`http://localhost:5000/autos/identidad/${nuevaIdentidad}`);
                if (response.data) {
                    alert(`Cliente encontrado: ${response.data.Nombre}`);
                } else {
                    alert('Cliente no encontrado');
                }
            } catch (error) {
                console.error('Error al verificar la identidad:', error);
                alert('Cliente no encontrado');
            }
        }
    };

    return (
        <div className="container">
            <p className='text-3xl uppercase'>Gestión de Autos</p>
            <input
                type="text"
                placeholder="Buscar por número de placa"
                value={placa}
                onChange={(e) => setPlaca(e.target.value)}
            />
            <button className='btn-auto' onClick={handleBuscar}>Buscar</button>
            <button className='btn-auto' onClick={handleAgregar}>Agregar Auto</button>

            <Modal isOpen={modalAbierto} onRequestClose={() => setModalAbierto(false)}>
    <h2>{isAddingMode ? 'Agregar Vehiculo' : 'Detalles del vehiculo'}</h2>
    <form>
        <div className="modal">
            <h3>{autoSeleccionado?.Id ? 'Editar Auto' : 'Agregar Auto'}</h3>
            <input
                type="text"
                placeholder="Placa"
                value={autoSeleccionado?.Placa || ''}
                onChange={(e) => setAutoSeleccionado({ ...autoSeleccionado, Placa: e.target.value })}
                readOnly={!isEditMode && !isAddingMode}
            />
            <input
                type="text"
                placeholder="Identidad"
                value={identidad}
                onChange={handleIdentidadChange}
                readOnly={!isEditMode && !isAddingMode}
            />
            <select
                value={autoSeleccionado?.Id_modelo || ''}
                onChange={(e) => setAutoSeleccionado({ ...autoSeleccionado, Id_modelo: e.target.value })}
            >
                <option value="">Seleccione un modelo</option>
                {modelos.map((modelo) => (
                    <option key={modelo.Id_modelo} value={modelo.Id_modelo}>{modelo.Nombre}</option>
                ))}
            </select>
            <select
                value={autoSeleccionado?.Id_tipo || ''}
                onChange={(e) => setAutoSeleccionado({ ...autoSeleccionado, Id_tipo: e.target.value })}
            >
                <option value="">Seleccione un tipo</option>
                {tipos.map((tipo) => (
                    <option key={tipo.Id_tipo} value={tipo.Id_tipo}>{tipo.Nombre}</option>
                ))}
            </select>
            <select
                value={autoSeleccionado?.Id_color || ''}
                onChange={(e) => setAutoSeleccionado({ ...autoSeleccionado, Id_color: e.target.value })}
            >
                <option value="">Seleccione un color</option>
                {colores.map((color) => (
                    <option key={color.Id_color} value={color.Id_color}>{color.Nombre}</option>
                ))}
            </select>
            <input
                type="text"
                placeholder="Número VIN"
                value={autoSeleccionado?.Numero_vin || ''}
                onChange={(e) => setAutoSeleccionado({ ...autoSeleccionado, Numero_vin: e.target.value })}
                readOnly={!isEditMode && !isAddingMode}
            />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>


    {isAddingMode ? (
        <>
            <button className='btn-auto' type="button" onClick={() => setModalAbierto(false)}>
                Cancelar
            </button>
            <button className='btn-auto' type="button" onClick={handleGuardar}>
                Guardar
            </button>
        </>
    ) : (
        <>
            {role === 'Administrador' && autoSeleccionado?.Id_auto && (
                <button className='btn-auto' type="button" onClick={handleEliminar}>
                    Eliminar
                </button>
            )}
            {autoSeleccionado?.Id_auto && (
                <button className='btn-auto' type="button" onClick={handleEdit}>
                    Actualizar
                </button>
            )}
            <button className='btn-auto' type="button" onClick={() => setModalAbierto(false)}>
                Cancelar
            </button>
        </>
    )}
</div>



        </div>
    </form>
</Modal>


            <table>
                <thead>
                    <tr>
                        <th>Placa</th>
                        <th>Modelo</th>
                        <th>Tipo</th>
                        <th>Color</th>
                        <th>Número VIN</th>
                    </tr>
                </thead>
                <tbody>
                    {autos.map((auto) => (
                        <tr key={auto.Id}>
                            <td>{auto.Placa}</td>
                            <td>{auto.Modelo}</td>
                            <td>{auto.Tipo}</td>
                            <td>{auto.Color}</td>
                            <td>{auto.Numero_vin}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Autos;
