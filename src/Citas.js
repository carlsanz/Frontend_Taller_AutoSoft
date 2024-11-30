import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const Citas = () => {
    const [citas, setCitas] = useState([]);
    const [nombreMecanico, setNombreMecanico] = useState('');

    useEffect(() => {
        fetchCitas(); // Cargar todas las citas al inicio
    }, []);

    const fetchCitas = async () => {
        try {
            const response = await axios.get('http://localhost:5000/citas/obtener');
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

    const handleBuscarPorMecanico = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get(`http://localhost:5000/citas/mecanico/${nombreMecanico}`);
            setCitas(response.data);
        } catch (error) {
            console.error('Error al buscar citas por mecánico:', error);
            alert('No se encontraron citas para este mecánico.');
        }
    };

    const handleVerTodas = () => {
        setNombreMecanico(''); // Limpia el input
        fetchCitas(); // Recarga todas las citas
    };

    return (
        <div 
            style={{ width: '100vw', overflowX: 'hidden', backgroundImage: 'url(/image/vehiculo.jpg)', backgroundSize: 'cover', backgroundPosition: 'top' }} 
            className="-z-10 absolute p-32 pb-0 flex flex-col h-screen justify-center"
        >
            {/* Formulario de búsqueda */}
            <form className="flex h-auto justify-center min-w-full" onSubmit={handleBuscarPorMecanico}>
                <input
                    className="w-3/5 my-5 rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-950 sm:text-sm/6"
                    type="text"
                    placeholder="Buscar citas por mecánico"
                    value={nombreMecanico}
                    onChange={(e) => setNombreMecanico(e.target.value)}
                    required
                />
                <button 
                    className="w-11 h-11 my-5 mx-2 flex items-center justify-center rounded-md bg-yellow-500 p-1 text-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" 
                    type="submit"
                >
                    <MagnifyingGlassIcon className="h-6 w-6" />
                </button>
                {/* Botón para ver todas las citas */}
                <button
                    type="button"
                    className="w-auto h-11 my-5 mx-2 flex items-center justify-center rounded-md bg-blue-500 px-4 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    onClick={handleVerTodas}
                >
                    Ver todas las citas
                </button>
            </form>

            {/* Tabla de citas */}
            <div className="w-full min-h-full flex col-start-1 justify-center text-black mt-5">
                <div className="overflow-y-auto bg-white max-h-96 w-full">
                    <table className="min-w-full w-full divide-y divide-gray-200">
                        <thead>
                            <tr className="bg-zinc-600 h-8 rounded-none m-0 p-0">
                                <th className="text-center text-white m-12 p-2">Nombre Cliente</th>
                                <th className="text-center text-white m-12 p-2">Nombre Empleado</th>
                                <th className="text-center text-white m-12 p-2">Placa Auto</th>
                                <th className="text-center text-white m-12 p-2">Fecha Ingreso</th>
                                <th className="text-center text-white m-12 p-2">Descripción</th>
                                <th className="text-center text-white m-12 p-2">Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {citas.map((cita) => (
                                <tr key={cita.Id_cita} className="border-b">
                                    <td className="border-b-2 border-zinc-600 text-left px-14">{cita.Nombre_Cliente}</td>
                                    <td className="border-b-2 border-zinc-600 text-left px-14">{cita.Nombre_Empleado}</td>
                                    <td className="border-b-2 border-zinc-600 text-left px-14">{cita.Placa}</td>
                                    <td className="border-b-2 border-zinc-600 text-left px-14">{formatDate(cita.Fecha)}</td>
                                    <td className="border-b-2 border-zinc-600 text-left px-14">{cita.Descripcion}</td>
                                    <td className="border-b-2 border-zinc-600 text-left px-14">{cita.Estado}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Citas;
