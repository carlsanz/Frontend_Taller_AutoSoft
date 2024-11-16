import {  MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const Citas = () => {
    const [citas, setCitas] = useState([]);
    const [idBuscar, setIdBuscar] = useState('');

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


    const handleBuscarCita = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get(`http://localhost:5000/citas/${idBuscar}`);
            const cita = response.data;
            cita.Fecha_ingreso = formatDate(cita.Fecha_ingreso);
        } catch (error) {
            console.error('Error al buscar cita:', error);
            alert('Cita no encontrada.');
        }
    };



    return (
        <div 
        style={{ width: '100vw', overflowX: 'hidden', backgroundImage: 'url(/image/vehiculo.jpg)', backgroundSize: 'cover', backgroundPosition: ' top' }} 
        className="-z-10 absolute  p-32 pb-0 flex flex-col h-screen justify-center" >
            <form className="flex h-auto justify-center min-w-full" onSubmit={handleBuscarCita}>
                <input
                    className="w-3/5 my-5 rounded-md border-0 py-1.5  text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-950 sm:text-sm/6"
                    type="text"
                    placeholder="Buscar citas por mecanico"
                    value={idBuscar}
                    onChange={(e) => setIdBuscar(e.target.value)}
                    required
                />
                <button 
                 className=" w-11 h-11  my-5 mx-2 flex items-center justify-center rounded-md bg-yellow-500 p-1  text-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" 
                type="submit">
                <MagnifyingGlassIcon className="h-6 w-6"/>
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
                            
                        </tr>
                    ))}
                </tbody>
            </table>

           
        </div>
        </div>
    );
};

export default Citas;