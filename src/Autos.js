import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { TrashIcon, ArrowPathIcon,PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
Modal.setAppElement('#root'); 

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
                const modeloNombre = respuestaModelos.data.find(m => m.Id_modelo === auto.Id_modelo)?.Nombre ;
                const tipoNombre = respuestaTipos.data.find(t => t.Id_tipo === auto.Id_tipo)?.Nombre ;
                const colorNombre = respuestaColores.data.find(c => c.Id_color === auto.Id_color)?.Nombre ;

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
                await axios.put(`http://localhost:5000/autos/${autoSeleccionado.Placa}`, autoParaGuardar);
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
                    await axios.delete(`http://localhost:5000/autos/${autoSeleccionado.Placa}`);
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

    

    useEffect(() => {
        
        axios.get('http://localhost:5000/autos/todos') 
            .then(response => {
                setAutos(response.data);
            })
            .catch(error => {
                console.error("Error al obtener los autos:", error);
            });
    }, []);




    return (
        <div 
        style={{ width: '100vw', overflowX: 'scroll', backgroundImage: 'url(/image/vehiculo.jpg)', backgroundSize: 'cover', backgroundPosition: ' top' }} 
        className="absolute  p-32 pb-0 bg-red-300 flex flex-col h-screen justify-center" >
      <div className="flex h-auto justify-center min-w-full">
      <input
                type="text"
                placeholder="Buscar por número de placa"
                value={placa}
                onChange={(e) => setPlaca(e.target.value)}
                 className="w-3/5 my-5 rounded-md border-0 py-1.5  text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-950 sm:text-sm/6"
            />
            <button  className=" w-11 h-11  my-5 mx-2 flex items-center justify-center rounded-md bg-yellow-500 p-1  text-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"onClick={handleBuscar}>
               <MagnifyingGlassIcon aria-hidden="true" className="h-6 w-6" />
            </button>
            <button className=" w-11 h-11 my-5 mx-2 flex items-center justify-center  rounded-md bg-yellow-500  p-1 text-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" onClick={handleAgregar}>
               <PlusIcon aria-hidden="true" className="h-6 w-6" />
            </button>
      </div>
      <div className="w-auto min-h-full flex col-start-1 justify-center text-black">
      <table className="table-row-group justify-center  bg-white rounded-none m-0 p-0 mt-0 pt-0 ">
            <thead>
                <tr className=" bg-zinc-600 h-8 rounded-none m-0 p-0">
                    <th className="text-center text-white m-12 p-2">Placa</th>
                    <th className="text-center text-white m-12 p-2">Modelo</th>
                    <th className="text-center text-white m-12 p-2">Tipo</th>
                    <th className="text-center text-white m-12 p-2">Color</th>
                    <th className="text-center text-white m-12 p-2">Número VIN</th>
                    <th className="text-center text-white m-12 p-2"></th>
                </tr>
            </thead>
            <tbody>
                {autos.map((auto) => (
                    <tr key={auto.Id_auto}>
                        <td className="border-b-2 border-zinc-600  text-left px-14 ">{auto.Placa}</td>
                        <td className="border-b-2 border-zinc-600  text-left px-14 ">{auto.Modelo}</td>
                        <td className="border-b-2 border-zinc-600  text-left px-14 ">{auto.Tipo}</td>
                        <td className="border-b-2 border-zinc-600  text-left px-14 ">{auto.Color}</td>
                        <td className="border-b-2 border-zinc-600  text-left px-14 ">{auto.Numero_vin}</td>
                        <td className="border-b-2 border-zinc-600  text-left px-14 ">
                                <button  className=" w-7 h-7 m-2 flex items-center justify-center rounded-md bg-green-600 p-1  text-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" onClick={() => handleEdit(autoSeleccionado)}>
                                    <ArrowPathIcon aria-hidden="true" className="h-6 w-6" />
                                </button>
                                <button className=" w-7 h-7  m-2 flex items-center justify-center rounded-md bg-red-500 p-1  text-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" onClick={() => handleEliminar(autoSeleccionado)}>
                                    <TrashIcon aria-hidden="true" className="h-6 w-6"  />
                                </button>
                       </td>
                    </tr>
                ))}
            </tbody>
        </table>

        <Modal style={{content:{backgroundColor:"white"},overlay:{backgroundColor:"rgba(0, 0, 0, 0.80)"}}} className=" h-auto w-full absolute left-96 p-5 rounded-lg max-w-2xl mx-auto my-8 "   isOpen={modalAbierto} onRequestClose={() => setModalAbierto(false)}>
        <form className="flex flex-col justify-between text-center w-full h-full ">
        <h2>{isAddingMode ? 'Agregar vehiculo' : 'Detalles del vehiculo'}</h2>
        <div style={{height:"28rem"}} className="flex flex-col justify-between p-6 ">
            <input
            className="h-12 block font-medium my-3 text-gray-900"
                type="text"
                placeholder="Placa"
                value={autoSeleccionado?.Placa || ''}
                onChange={(e) => setAutoSeleccionado({ ...autoSeleccionado, Placa: e.target.value })}
                readOnly={!isEditMode && !isAddingMode}
            />
            <input
            className="h-12 block font-medium my-3 text-gray-900"
                type="text"
                placeholder="Identidad"
                value={identidad}
                onChange={handleIdentidadChange}
                readOnly={!isEditMode && !isAddingMode}
            />
            <select
                className="h-12 block font-medium my-3 text-gray-900"
                value={autoSeleccionado?.Id_modelo || ''}
                onChange={(e) => setAutoSeleccionado({ ...autoSeleccionado, Id_modelo: e.target.value })}
            >
                <option value="">Seleccione un modelo</option>
                {modelos.map((modelo) => (
                    <option key={modelo.Id_modelo} value={modelo.Id_modelo}>{modelo.Nombre}</option>
                ))}
            </select>
            <select
               className="h-12 block font-medium my-3 text-gray-900"
                value={autoSeleccionado?.Id_tipo || ''}
                onChange={(e) => setAutoSeleccionado({ ...autoSeleccionado, Id_tipo: e.target.value })}
            >
                <option value="">Seleccione un tipo</option>
                {tipos.map((tipo) => (
                    <option key={tipo.Id_tipo} value={tipo.Id_tipo}>{tipo.Nombre}</option>
                ))}
            </select>
            <select
                className="h-12 block font-medium my-3 text-gray-900"
                value={autoSeleccionado?.Id_color || ''}
                onChange={(e) => setAutoSeleccionado({ ...autoSeleccionado, Id_color: e.target.value })}
            >
                <option value="">Seleccione un color</option>
                {colores.map((color) => (
                    <option key={color.Id_color} value={color.Id_color}>{color.Nombre}</option>
                ))}
            </select>
            <input
            className="h-12 block font-medium my-3 text-gray-900"
                type="text"
                placeholder="Número VIN"
                value={autoSeleccionado?.Numero_vin || ''}
                onChange={(e) => setAutoSeleccionado({ ...autoSeleccionado, Numero_vin: e.target.value })}
                readOnly={!isEditMode && !isAddingMode}
            />
            </div>
            <div className=" flex content-end justify-around items-center  w-full h-20">


                {isAddingMode ? (
                    <>
                        <button className="h-11 w-44 my-5 mx-2 flex items-center justify-center rounded-sm bg-yellow-500 p-1  text-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" type="button" onClick={() => setModalAbierto(false)}>
                            Cancelar
                        </button>
                        <button className="h-11 w-44 my-5 mx-2 flex items-center justify-center rounded-sm bg-yellow-500 p-1  text-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" type="button" onClick={handleGuardar}>
                            Guardar
                        </button>
                    </>
                ) : (
                    <>
                        {role === 'Administrador' && autoSeleccionado?.Id_auto && (
                            <button className="h-11 w-44 my-5 mx-2 flex items-center justify-center rounded-sm bg-yellow-500 p-1  text-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" type="button" onClick={handleEliminar}>
                                Eliminar
                            </button>
                        )}
                        {autoSeleccionado?.Id_auto && (
                            <button className="h-11 w-44 my-5 mx-2 flex items-center justify-center rounded-sm bg-yellow-500 p-1  text-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" type="button" onClick={handleEdit}>
                                Actualizar
                            </button>
                        )}
                        <button className="h-11 w-44 my-5 mx-2 flex items-center justify-center rounded-sm bg-yellow-500 p-1  text-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" type="button" onClick={() => setModalAbierto(false)}>
                            Cancelar
                        </button>
                    </>
        )}
        </div>
        
       </form>
     </Modal>

    </div>
</div>

           
            
        
    );
};

export default Autos;
