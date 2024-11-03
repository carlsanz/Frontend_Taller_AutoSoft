import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Autos.css';

const Autos = () => {
    const [placa, setPlaca] = useState('');
    const [autos, setAutos] = useState([]);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [autoSeleccionado, setAutoSeleccionado] = useState(null);
    const [identidad, setIdentidad] = useState('');
    const [clienteNombre, setClienteNombre] = useState('');
    const [modelos, setModelos] = useState([]);
    const [tipos, setTipos] = useState([]);
    const [colores, setColores] = useState([]);

    // Función para obtener todos los autos
    const fetchAutos = async () => {
        try {
            const response = await axios.get('http://localhost:5000/autos');
            setAutos(response.data);
        } catch (error) {
            console.error('Error al obtener autos:', error);
        }
    };

    useEffect(() => {
        fetchAutos();

        const fetchDatosDesplegables = async () => {
            try {
                const [respuestaModelos, respuestaTipos, respuestaColores] = await Promise.all([
                    axios.get('http://localhost:5000/autos/modelos'),
                    axios.get('http://localhost:5000/autos/tipos'),
                    axios.get('http://localhost:5000/autos/colores')
                ]);
                setModelos(respuestaModelos.data);
                setTipos(respuestaTipos.data);
                setColores(respuestaColores.data);
            } catch (error) {
                console.error('Error al obtener datos desplegables:', error);
            }
        };

        fetchDatosDesplegables();
    }, []);

    // Función para buscar un auto por placa
    const handleBuscar = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/autos/placa/${placa}`);
            setAutoSeleccionado(response.data);
            setIdentidad(response.data.Identidad);
            setModalAbierto(true);
        } catch (error) {
            alert('Auto no encontrado');
            setAutoSeleccionado(null);
        }
    };

    // Función para agregar un nuevo auto
    const handleAgregar = () => {
        setAutoSeleccionado({
            Id: null, // Cambiado a null para indicar que es un nuevo auto
            Placa: '',
            Id_modelo: '',
            Id_tipo: '',
            Id_color: '',
            Numero_vin: '',
            Identidad: ''
        });
        setIdentidad('');
        setClienteNombre('');
        setModalAbierto(true);
    };

    // Función para guardar un auto
    const handleGuardar = async () => {
        try {
            const autoParaGuardar = {
                Id: autoSeleccionado.Id, // Incluir el ID si existe
                Placa: autoSeleccionado.Placa,
                Id_modelo: parseInt(autoSeleccionado.Id_modelo, 10), // Asegúrate de que es un número entero
                Id_tipo: parseInt(autoSeleccionado.Id_tipo, 10), // Asegúrate de que es un número entero
                Id_color: parseInt(autoSeleccionado.Id_color, 10), // Asegúrate de que es un número entero
                Numero_vin: autoSeleccionado.Numero_vin,
                Identidad: identidad,
            };

            if (autoSeleccionado.Id) {
                await axios.put(`http://localhost:5000/autos/${autoSeleccionado.Id}`, autoParaGuardar);
            } else {
                await axios.post('http://localhost:5000/autos', autoParaGuardar);
            }
            fetchAutos();
            setModalAbierto(false);
        } catch (error) {
            console.error('Error al guardar el auto:', error);
        }
    };

    // Función para eliminar un auto
    const handleEliminar = async () => {
        try {
            await axios.delete(`http://localhost:5000/autos/${autoSeleccionado.Id}`);
            fetchAutos();
            setModalAbierto(false);
        } catch (error) {
            console.error('Error al eliminar el auto:', error);
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
                    setClienteNombre(response.data.Nombre);
                } else {
                    setClienteNombre('');
                    alert('Cliente no encontrado');
                }
            } catch (error) {
                console.error('Error al verificar la identidad:', error);
                alert('Cliente no encontrado');
            }
        } else {
            setClienteNombre('');
        }
    };

    return (
        <div className="container">
            <h2>Gestión de Autos</h2>
            <input
                type="text"
                placeholder="Buscar por número de placa"
                value={placa}
                onChange={(e) => setPlaca(e.target.value)}
            />
            <button onClick={handleBuscar}>Buscar</button>
            <button onClick={handleAgregar}>Agregar Auto</button>

            {modalAbierto && (
                <div className="modal">
                    <h3>{autoSeleccionado.Id ? 'Editar Auto' : 'Agregar Auto'}</h3>
                    <input
                        type="text"
                        placeholder="Placa"
                        value={autoSeleccionado.Placa}
                        onChange={(e) => setAutoSeleccionado({ ...autoSeleccionado, Placa: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Identidad"
                        value={identidad}
                        onChange={handleIdentidadChange}
                    />
                    <select
                        value={autoSeleccionado.Id_modelo || ''}
                        onChange={(e) => setAutoSeleccionado({ ...autoSeleccionado, Id_modelo: e.target.value })}
                    >
                        <option value="">Seleccione un modelo</option>
                        {modelos.map((modelo) => (
                            <option key={modelo.Id} value={modelo.Id}>{modelo.Nombre}</option>
                        ))}
                    </select>
                    <select
                        value={autoSeleccionado.Id_tipo || ''}
                        onChange={(e) => setAutoSeleccionado({ ...autoSeleccionado, Id_tipo: e.target.value })}
                    >
                        <option value="">Seleccione un tipo</option>
                        {tipos.map((tipo) => (
                            <option key={tipo.Id} value={tipo.Id}>{tipo.Nombre}</option>
                        ))}
                    </select>
                    <select
                        value={autoSeleccionado.Id_color || ''}
                        onChange={(e) => setAutoSeleccionado({ ...autoSeleccionado, Id_color: e.target.value })}
                    >
                        <option value="">Seleccione un color</option>
                        {colores.map((color) => (
                            <option key={color.Id} value={color.Id}>{color.Nombre}</option>
                        ))}
                    </select>
                    <input
                        type="text"
                        placeholder="Número VIN"
                        value={autoSeleccionado.Numero_vin}
                        onChange={(e) => setAutoSeleccionado({ ...autoSeleccionado, Numero_vin: e.target.value })}
                    />
                    <button onClick={handleGuardar}>{autoSeleccionado.Id ? 'Actualizar' : 'Guardar'}</button>
                    {autoSeleccionado.Id && <button onClick={handleEliminar}>Eliminar</button>}
                    <button onClick={() => setModalAbierto(false)}>Cancelar</button>
                </div>
            )}

            <table>
                <thead>
                    <tr>
                        <th>Placa</th>
                        <th>Modelo</th>
                        <th>Tipo</th>
                        <th>Color</th>
                        <th>VIN</th>
                        <th>Identidad</th>
                    </tr>
                </thead>
                <tbody>
                    {autos.map((auto) => (
                        <tr key={auto.Placa}>
                            <td>{auto.Placa}</td>
                            <td>{auto.Modelo}</td>
                            <td>{auto.Tipo}</td>
                            <td>{auto.Color}</td>
                            <td>{auto.Numero_vin}</td>
                            <td>{auto.Identidad}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Autos;
