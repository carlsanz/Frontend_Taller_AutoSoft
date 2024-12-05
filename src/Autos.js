import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { TrashIcon, ArrowPathIcon,PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import Mensaje from './Mensaje'; 

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

    const [mensaje, setMensaje] = useState(''); // Mensaje a mostrar
    const [tipoMensaje, setTipoMensaje] = useState(''); // Tipo de mensaje

    const mostrarMensaje = (msg, tipo) => {
    setMensaje(msg);
    setTipoMensaje(tipo);
    };
  
  


    const role = localStorage.getItem('role');

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
            mostrarMensaje('Auto no encontrado', 'error');
            setAutoSeleccionado(null);
        }
    };

    const handleMostrarAuto = async (placa) => {
        console.log("Buscando auto con placa:", placa);
    
        if (!placa) {
            mostrarMensaje('Por favor, ingrese una placa válida.', 'alert');
            return;
        }
    
        try {
            const response = await axios.get(`http://localhost:5000/autos/placa/${placa}`);
            if (response.data) {
                setAutoSeleccionado(response.data);
                setIdentidad(response.data.Identidad);
                setModalAbierto(true);
                setIsEditMode(true); // Modo edición al buscar
                setIsAddingMode(false);
            } else {
                mostrarMensaje('Auto no encontrado', 'error');
                setAutoSeleccionado(null);
            }
        } catch (error) {
            mostrarMensaje('Error al buscar el auto', 'error');
            setAutoSeleccionado(null);
        }
    };

    useEffect(()=>{
    const fetchModelos = async ()=> {
    try{
        const response = await axios.get('http://localhost:5000/autos/modelos');
        setModelos(response.data);
       }
       catch(error){
          console.error('Error al obtener los modelos', error);
       }

    };
    fetchModelos();
    }, []);

    
    useEffect(()=>{
        const fetchTipos = async ()=> {
        try{
            const response = await axios.get('http://localhost:5000/autos/tipos');
            setTipos (response.data);
           }
           catch(error){
              console.error('Error al obtener los tipos', error);
           }
    
        };
        fetchTipos();
        }, []);

    
     useEffect(()=>{
            const fetchColores = async ()=> {
            try{
                const response = await axios.get('http://localhost:5000/autos/colores');
                setColores (response.data);
               }
               catch(error){
                  console.error('Error al obtener los colores', error);
               }
        
            };
            fetchColores();
            }, []);
    

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

    // const handleEdit = () => {
    //     setIsEditMode(true); // Habilitar el modo edición
    //     setModalAbierto(true);
    //     setIsAddingMode(false);

    //     setIdentidad(autoSeleccionado);
    //     setModelos(autoSeleccionado);
    //     setTipos(autoSeleccionado);
    //     setColores(autoSeleccionado);

    // };

    // Función para guardar o actualizar un auto
    const handleGuardar = async () => {
        if (!autoSeleccionado) return; // Evitar errores si no hay auto seleccionado
        
        console.log('Auto seleccionado para guardar:', autoSeleccionado.Placa); // Verifica que esta información es correcta
    
        try {
            const autoParaGuardar = {
                Placa: autoSeleccionado.Placa,
                Id_modelo: parseInt(autoSeleccionado.Id_modelo, 10) || null,
                Id_tipo: parseInt(autoSeleccionado.Id_tipo, 10) || null,
                Id_color: parseInt(autoSeleccionado.Id_color, 10) || null,
                Numero_vin: autoSeleccionado.Numero_vin,
                Identidad: identidad,
            };
    
            if (autoSeleccionado.Placa && isEditMode) {
                console.log('Actualizando auto...');
                // Actualización
                await axios.put(`http://localhost:5000/autos/${autoSeleccionado.Placa}`, autoParaGuardar);
                mostrarMensaje('Auto actualizado exitosamente', 'success');
            } else if (isAddingMode) {
                console.log('Guardando nuevo auto...');
                // Nuevo registro
                await axios.post('http://localhost:5000/autos', autoParaGuardar);
                mostrarMensaje('Auto guardado exitosamente', 'success');
            }
    
            // Después de actualizar o guardar, actualiza la lista de autos
            fetchAutos();  // Llama la función que obtiene los autos de la base de datos
            setModalAbierto(false);  // Cierra el modal después de guardar o actualizar
        } catch (error) {
            console.error('Error al guardar o actualizar el auto:', error);
        }
    };
    

    // Función para eliminar un auto
    const handleEliminar = async () => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este Automovil?')) {
            console.log(autoSeleccionado, autoSeleccionado.Placa);
            try {
                if (autoSeleccionado && autoSeleccionado.Placa) {
                    // Realizar la solicitud DELETE al backend
                    const response = await axios.delete(`http://localhost:5000/autos/${autoSeleccionado.Placa}`);
                    
                    // Si la respuesta es exitosa, muestra el mensaje de éxito
                    mostrarMensaje(response.data.message || 'Auto eliminado exitosamente', 'success');
    
                    // Actualiza la lista de autos en el frontend después de eliminarlo
                    setAutos((prevAutos) => prevAutos.filter((auto) => auto.Placa !== autoSeleccionado.Placa));
    
                    // Cerrar el modal
                    setModalAbierto(false);
                }
            } catch (error) {
                console.error('Error al eliminar el auto:', error); // Mostrar el error completo para depuración
    
                // Verificar si la respuesta de error tiene un mensaje
                if (error.response && error.response.data && error.response.data.message) {
                    mostrarMensaje(error.response.data.message); // Mostrar mensaje específico del backend
                } else {
                    mostrarMensaje('Hubo un error al eliminar el auto. Intenta nuevamente.', 'error'); // Mensaje genérico si no hay mensaje de backend
                }
    
                // Mostrar el error completo para depuración
                console.log('Detalles del error: ', error.response);
                console.log('Error:', error.message);
                console.log('Error de la respuesta:', error.response ? error.response.data : 'No hay respuesta');
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
                    mostrarMensaje(`Cliente encontrado: ${response.data.Nombre}`, 'success');
                } else {
                    mostrarMensaje('Cliente no encontrado', 'error');
                }
            } catch (error) {
                console.error('Error al verificar la identidad:', error);
                mostrarMensaje('Cliente no encontrado', 'error');
            }
        }
    };
    

    const fetchAutos = async () => {
        try {
            const response = await axios.get('http://localhost:5000/autos/todos');
            setAutos(response.data); // Actualiza el estado autos con la respuesta de la API
        } catch (error) {
            console.error('Error al obtener los autos:', error);
        }
    };

    // useEffect para cargar los autos cuando el componente se monta
    useEffect(() => {
        fetchAutos(); // Llama a fetchAutos para cargar los autos
    }, []); // Este efecto solo se ejecuta una vez, al montar el componente

    




    return (
        <div 
        style={{ width: '100vw', overflowX: 'hidden', overflowY: 'hidden', backgroundImage: 'url(/image/vehiculo.jpg)', backgroundSize: 'cover', backgroundPosition: ' top' }} 
        className="-z-10 absolute pt-32 pb-20 px-9 flex flex-col h-screen justify-center"  >
      <div className="flex h-auto justify-center min-w-full">
      <Mensaje
            mensaje={mensaje}
            tipo={tipoMensaje}
            onClose={() => setMensaje(null)} // Cierra el mensaje
          />
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
      <div className="w-full min-h-full flex col-start-1 justify-center  text-black mt-5">
        <div className="overflow-y-auto bg-white max-h-full w-full">
            <table className="min-w-full w-full divide-y divide-gray-200">
            <thead className="sticky top-0">
                <tr className=" bg-zinc-600 h-8 rounded-none m-0 p-0">
                    <th className="text-center text-white   m-12 px-4 py-2">Placa</th>
                    <th className="text-center text-white   m-12 px-4 py-2">Modelo</th>
                    <th className="text-center text-white   m-12 px-4 py-2">Tipo</th>
                    <th className="text-center text-white   m-12 px-4 py-2">Color</th>
                    <th className="text-center text-white   m-12 px-4 py-2">Número VIN</th>
                    <th className="text-center text-white   m-12 px-4 py-2"></th>
                </tr>
            </thead>
            <tbody>
            {autos.length === 0 ? (
            <tr>
            <td colSpan="5">No hay autos registrados</td>
           </tr>
           ) : (
                autos.map((auto) => (
                    <tr key={auto.Id_auto}>
                        <td className="border-b-2 border-zinc-600  px-4 py-2 ">{auto.Placa}</td>
                        <td className="border-b-2 border-zinc-600  px-4 py-2 ">{auto.Modelo}</td>
                        <td className="border-b-2 border-zinc-600  px-4 py-2 ">{auto.Tipo}</td>
                        <td className="border-b-2 border-zinc-600  px-4 py-2 ">{auto.Color}</td>
                        <td className="border-b-2 border-zinc-600  px-4 py-2 ">{auto.Numero_vin}</td>
                        <td className="border-b-2 border-zinc-600  px-4 py-2 ">
                                <button  className=" w-7 h-7 m-2 flex items-center justify-center rounded-md bg-green-600 p-1  text-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"  onClick={() => {
                    console.log(auto.Placa); // Aquí imprimes el valor de auto.Placa en la consola
                    handleMostrarAuto(auto.Placa); // Luego llamas a la función con la placa
                }}>
                                    <ArrowPathIcon aria-hidden="true" className="h-6 w-6" />
                                </button>
                                <button className=" w-7 h-7  m-2 flex items-center justify-center rounded-md bg-red-500 p-1  text-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" onClick={() => handleEliminar(autoSeleccionado)}>
                                    <TrashIcon aria-hidden="true" className="h-6 w-6"  />
                                </button>
                       </td>
                    </tr>
                ))
            )}
            </tbody>
        </table>

        <Modal style={{content:{backgroundColor:"white"},overlay:{backgroundColor:"rgba(0, 0, 0, 0.80)"}}} className=" h-auto w-full absolute left-96 p-5 top-11 rounded-lg max-w-2xl mx-auto my-8 "   isOpen={modalAbierto} onRequestClose={() => setModalAbierto(false)}>
        <form className="flex flex-col justify-between text-center w-full h-full ">
        <Mensaje
            mensaje={mensaje}
            tipo={tipoMensaje}
            onClose={() => setMensaje(null)} // Cierra el mensaje
          />
        <h2>{isAddingMode ? 'Agregar vehiculo' : 'Detalles del vehiculo'}</h2>
        <div style={{height:"25rem"}} className="flex flex-col justify-between p-6 ">
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
                <option value="">Seleccione el modelo del vehiculo</option>
                {modelos.map((modelo) => (
                    <option key={modelo.Id_modelo} value={modelo.Id_modelo}>{modelo.Nombre}</option>
                ))}
            </select>
            <select
               className="h-12 block font-medium my-3 text-gray-900"
                value={autoSeleccionado?.Id_tipo || ''}
                onChange={(e) => setAutoSeleccionado({ ...autoSeleccionado, Id_tipo: e.target.value })}
            >
                <option value="">Seleccione el tipo de vehiculo</option>
                {tipos.map((tipo) => (
                    <option key={tipo.Id_tipo} value={tipo.Id_tipo}>{tipo.Nombre}</option>
                ))}
            </select>
            <select
                className="h-12 block font-medium my-3 text-gray-900"
                value={autoSeleccionado?.Id_color || ''}
                onChange={(e) => setAutoSeleccionado({ ...autoSeleccionado, Id_color: e.target.value })}
            >
                <option value="">Seleccione el color del vehiculo</option>
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
                            <button className="h-11 w-44 my-5 mx-2 flex items-center justify-center rounded-sm bg-yellow-500 p-1  text-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" type="button" onClick={handleGuardar}>
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
</div>

           
            
        
    );
};

export default Autos;
