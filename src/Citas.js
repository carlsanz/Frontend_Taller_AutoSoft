import { TrashIcon, ArrowPathIcon, PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const Citas = () => {
    const [citas, setCitas] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [idBuscar, setIdBuscar] = useState('');
    const [formData, setFormData] = useState({
        Id_cliente: '',
        Id_empleados: '',
        Id_auto: '',
        Fecha_ingreso: '',
        Descripcion: '',
        Id_estado: ''
    });

    useEffect(() => {
        fetchCitas();
    }, []);

    const fetchCitas = async () => {
        try {
            const response = await axios.get('http://localhost:5000/citas');
            setCitas(response.data);
        } catch (error) {
            console.error('Error al obtener citas:', error);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const year = date.getUTCFullYear();
        return `${year}-${month}-${day}`;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleBuscarCita = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get(`http://localhost:5000/citas/${idBuscar}`);
            const cita = response.data;
            cita.Fecha_ingreso = formatDate(cita.Fecha_ingreso);
            setFormData(cita);
            setIsEditMode(true);
            setIsModalOpen(true);
        } catch (error) {
            console.error('Error al buscar cita:', error);
            alert('Cita no encontrada.');
        }
    };

    const handleEditClick = (cita) => {
        setFormData({
            ...cita,
            Fecha_ingreso: formatDate(cita.Fecha_ingreso)
        });
        setIsEditMode(true);
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const method = isEditMode ? 'PUT' : 'POST';
            const url = isEditMode 
                ? `http://localhost:5000/citas/${formData.Id_cita}`
                : 'http://localhost:5000/citas';

            await axios({
                method,
                url,
                data: formData
            });

            alert(isEditMode ? 'Cita actualizada exitosamente' : 'Cita agregada exitosamente');
            setIsModalOpen(false);
            fetchCitas();
            resetForm();
        } catch (error) {
            console.error('Error al guardar la cita:', error);
            alert('Error al guardar la cita');
        }
    };

    const handleEliminarCita = async (id) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar esta cita?')) return;
        try {
            await axios.delete(`http://localhost:5000/citas/${id}`);
            alert('Cita eliminada exitosamente');
            fetchCitas();
        } catch (error) {
            console.error('Error al eliminar cita:', error);
            alert('Error al eliminar la cita');
        }
    };

    const resetForm = () => {
        setFormData({
            Id_cliente: '',
            Id_empleados: '',
            Id_auto: '',
            Fecha_ingreso: '',
            Descripcion: '',
            Id_estado: ''
        });
        setIsEditMode(false);
    };

    return (
        <div 
        style={{ width: '100vw', overflowX: 'hidden', backgroundImage: 'url(/image/vehiculo.jpg)', backgroundSize: 'cover', backgroundPosition: ' top' }} 
        className="-z-10 absolute  p-32 pb-0 flex flex-col h-screen justify-center" >
            <form className="flex h-auto justify-center min-w-full" onSubmit={handleBuscarCita}>
                <input
                    className="w-3/5 my-5 rounded-md border-0 py-1.5  text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-950 sm:text-sm/6"
                    type="text"
                    placeholder="Buscar cita por ID"
                    value={idBuscar}
                    onChange={(e) => setIdBuscar(e.target.value)}
                    required
                />
                <button 
                 className=" w-11 h-11  my-5 mx-2 flex items-center justify-center rounded-md bg-yellow-500 p-1  text-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" 
                type="submit">
                <MagnifyingGlassIcon className="h-6 w-6"/>
                </button>
                <button 
                 className=" w-11 h-11  my-5 mx-2 flex items-center justify-center rounded-md bg-yellow-500 p-1  text-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" 
                onClick={() => { setIsModalOpen(true); resetForm(); }}>
                <PlusIcon className="h-6 w-6" />
                </button>
            </form>

            <div className="w-auto min-h-full flex col-start-1 justify-center  text-black">
            <table className=" table-row-group h-auto bg-white justify-center rounded-none m-0 p-0 mt-0 pt-0 ">
                <thead>
                    <tr className="bg-gray-800 text-white">
                        <th className="p-3">ID Cliente</th>
                        <th className="p-3">ID Empleado</th>
                        <th className="p-3">ID Auto</th>
                        <th className="p-3">Fecha Ingreso</th>
                        <th className="p-3">Descripción</th>
                        <th className="p-3">ID Estado</th>
                        <th className="p-3">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {citas.map((cita) => (
                        <tr key={cita.Id_cita} className="border-b">
                            <td className="p-3 text-center">{cita.Id_cliente}</td>
                            <td className="p-3 text-center">{cita.Id_empleados}</td>
                            <td className="p-3 text-center">{cita.Id_auto}</td>
                            <td className="p-3 text-center">{formatDate(cita.Fecha_ingreso)}</td>
                            <td className="p-3 text-center">{cita.Descripcion}</td>
                            <td className="p-3 text-center">{cita.Id_estado}</td>
                            <td className="p-3 flex justify-center">
                                <button className="p-2 mx-1 bg-blue-500 text-white rounded" onClick={() => handleEditClick(cita)}>
                                    <ArrowPathIcon className="h-5 w-5" />
                                </button>
                                <button className="p-2 mx-1 bg-red-500 text-white rounded" onClick={() => handleEliminarCita(cita.Id_cita)}>
                                    <TrashIcon className="h-5 w-5" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Modal style={{content:{backgroundColor:"white"},overlay:{backgroundColor:"rgba(0, 0, 0, 0.80)"}}} className=" h-auto w-full absolute left-96 top-14 p-5 rounded-lg max-w-2xl mx-auto my-8"  isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} contentLabel="Formulario de Cita">
                <form className="flex flex-col justify-between text-center w-full h-full " onSubmit={handleSubmit}>
                <h2>{isEditMode ? 'Editar Cita' : 'Agregar Cita'}</h2>
                <div style={{height:"28rem"}} className="flex flex-col justify-between p-6 ">
                    <input className="h-12 block font-medium my-3 text-gray-900" name="Id_cliente" value={formData.Id_cliente} onChange={handleInputChange} placeholder="ID Cliente" required />
                    <input className="h-12 block font-medium my-3 text-gray-900" name="Id_empleados" value={formData.Id_empleados} onChange={handleInputChange} placeholder="ID Empleado" required />
                    <input className="h-12 block font-medium my-3 text-gray-900" name="Id_auto" value={formData.Id_auto} onChange={handleInputChange} placeholder="ID Auto" required />
                    <input className="h-12 block font-medium my-3 text-gray-900" name="Fecha_ingreso" value={formData.Fecha_ingreso} onChange={handleInputChange} type="date" required />
                    <textarea style={{height:"4rem"}} className="h-80 block font-medium my-3 text-gray-900" name="Descripcion" value={formData.Descripcion} onChange={handleInputChange} placeholder="Descripción" required />
                    <input className="h-12 block font-medium my-3 text-gray-900" name="Id_estado" value={formData.Id_estado} onChange={handleInputChange} placeholder="ID Estado" required />
                    <div className=" flex content-end justify-around items-center  w-full h-20">
                    <button type="submit" className="h-11 w-44 my-5 mx-2 flex items-center justify-center rounded-sm bg-yellow-500 p-1  text-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" >{isEditMode ? 'Actualizar' : 'Agregar'}</button>
                    <button type="button" className="h-11 w-44 my-5 mx-2 flex items-center justify-center rounded-sm bg-yellow-500 p-1  text-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                    </div>
                    </div>
                </form>
            </Modal>
        </div>
        </div>
    );
};

export default Citas;
