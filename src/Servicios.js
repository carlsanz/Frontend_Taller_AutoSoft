import React, { useEffect, useState } from 'react';
import './Servicios.css';

const Servicios = ({ rolUsuario }) => {
    const [servicios, setServicios] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false); 
    const [selectedServiceId, setSelectedServiceId] = useState(null); 
    const [formData, setFormData] = useState({
        Nombre: '',
        Descripcion: '',
        Precio: '',
        Tipo_servicio: ''
    });

    console.log(localStorage.getItem('role')); // Verficar rol

    useEffect(() => {
        const obtenerServicios = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/servicios/obtener');
                if (!response.ok) {
                    throw new Error('Error al obtener los servicios');
                }
                const data = await response.json();
                console.log('Servicios obtenidos:', data); 
                setServicios(data);
            } catch (error) {
                console.error('Error al obtener los servicios:', error);
            }
        };

        obtenerServicios();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('¿Estás seguro de que quieres borrar este servicio?')) {
            return;
        }
        try {
            const response = await fetch(`http://localhost:5000/api/servicios/borrar/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Error al borrar el servicio');
            }

            setServicios(servicios.filter((servicio) => servicio.Id_servicio !== id));
            alert('Servicio borrado exitosamente');
        } catch (error) {
            console.error('Error al borrar el servicio:', error);
            alert('Hubo un error al borrar el servicio');
        }
    };

    const handleEdit = (servicio) => {
        setIsEditing(true);
        setSelectedServiceId(servicio.Id_servicio);
        setFormData({
            Nombre: servicio.Nombre,
            Descripcion: servicio.Descripcion,
            Precio: servicio.Precio,
            Tipo_servicio: servicio.Tipo_servicio
        });
        setIsModalOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isEditing) {
            try {
                const response = await fetch(`http://localhost:5000/api/servicios/actualizar/${selectedServiceId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                if (!response.ok) {
                    throw new Error('Error al actualizar el servicio');
                }

                const servicioActualizado = await response.json();
                setServicios(servicios.map((servicio) =>
                    servicio.Id_servicio === selectedServiceId ? servicioActualizado : servicio
                ));

                alert('Servicio actualizado exitosamente');
            } catch (error) {
                console.error('Error al actualizar el servicio:', error);
                alert('Hubo un error al actualizar el servicio');
            }
        } else {
            try {
                const response = await fetch('http://localhost:5000/api/servicios/agregar', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                if (!response.ok) {
                    throw new Error('Error al agregar el servicio');
                }

                const nuevoServicio = await response.json();
                setServicios([...servicios, nuevoServicio]);

                alert('Servicio agregado exitosamente');
            } catch (error) {
                console.error('Error al agregar el servicio:', error);
                alert('Hubo un error al agregar el servicio');
            }
        }

        
        setIsModalOpen(false);
        setIsEditing(false);
        setSelectedServiceId(null);
        setFormData({ Nombre: '', Descripcion: '', Precio: '', Tipo_servicio: '' });
    };

    return (
        <div>
            <h2>Servicios Ofrecidos</h2>
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Precio</th>
                        <th>Tipo de Servicio</th>
                        {rolUsuario === 'Administrador' && <th>Acciones</th>}
                    </tr>
                </thead>
                <tbody>
                    {servicios.length === 0 ? (
                        <tr>
                            <td colSpan="5">No hay servicios disponibles</td>
                        </tr>
                    ) : (
                        servicios.map((servicio) => (
                            <tr key={servicio.Id_servicio}>
                                <td>{servicio.Nombre}</td>
                                <td>{servicio.Descripcion}</td>
                                <td>{servicio.Precio}</td>
                                <td>{servicio.Tipo_servicio}</td>
                                {rolUsuario === 'Administrador' && (
                                    <td>
                                        <button className="btn-actualizar" onClick={() => handleEdit(servicio)}>Actualizar</button>
                                        <button className="btn-borrar" onClick={() => handleDelete(servicio.Id_servicio)}>Borrar</button>
                                    </td>
                                )}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            {rolUsuario === 'Administrador' && (
                <div id="botones-servicios" className="botones">
                    <button className="btn-agregar" onClick={() => { setIsEditing(false); setIsModalOpen(true); }}>Agregar</button>
                    <button className="btn-volver" onClick={() => window.location.href = '/home'}>Volver</button>
                </div>
            )}

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>{isEditing ? 'Actualizar Servicio' : 'Agregar Nuevo Servicio'}</h2>
                        <form onSubmit={handleSubmit}>
                            <label>Nombre</label>
                            <input type="text" name="Nombre" value={formData.Nombre} onChange={handleInputChange} required />

                            <label>Descripción</label>
                            <input type="text" name="Descripcion" value={formData.Descripcion} onChange={handleInputChange} required />

                            <label>Precio</label>
                            <input type="number" name="Precio" value={formData.Precio} onChange={handleInputChange} required />

                            <label>Tipo de Servicio</label>
                            <select name="Tipo_servicio" value={formData.Tipo_servicio} onChange={handleInputChange}>
                                <option value="" disabled>Seleccione el tipo de servicio</option>
                                <option value="Preventivo">Preventivo</option>
                                <option value="Correctivo">Correctivo</option>
                            </select>

                            <button className="btn-agregar" type="submit">{isEditing ? 'Actualizar Servicio' : 'Agregar Servicio'}</button>
                            <button className="btn-borrar" type="button" onClick={() => setIsModalOpen(false)}>Cerrar</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Servicios;
