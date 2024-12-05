import axios from 'axios';
import { TrashIcon, ArrowPathIcon, PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import Mensaje from './Mensaje';
Modal.setAppElement('#root'); 


const Repuestos = ({ rolUsuario }) => {
        const [nombreBusqueda, setNombreBusqueda] = useState('');
        const [repuestos, setRepuestos] = useState([]);
        const [repuestosOriginales, setRepuestosOriginales] = useState([])
        const [modalIsOpen, setModalIsOpen] = useState(false);
        const [isEditMode, setIsEditMode] = useState(false);
        const [isAddingMode, setIsAddingMode] = useState(false);
        const [proveedores, setProveedores] = useState([]);
        const [marcas, setMarcas] = useState([]);
        const [formData, setFormData] = useState({
            Nombre: '',
            Id_marca_repuesto: '',
            Id_proveedor: '',
            Descripcion: '',
            Precio: '',
        });

        const [mensaje, setMensaje] = useState(''); // Mensaje a mostrar
        const [tipoMensaje, setTipoMensaje] = useState(''); // Tipo de mensaje
    
        const mostrarMensaje = (msg, tipo) => {
        setMensaje(msg);
        setTipoMensaje(tipo);
        };
    


    // Obtener proveedores y marcas
    useEffect(() => {
        const obtenerProveedoresYMarcas = async () => {
            try {
                const [proveedoresRes, marcasRes] = await Promise.all([
                    axios.get('http://localhost:5000/repuestos/proveedores'),
                    axios.get('http://localhost:5000/repuestos/marcas'),
                ]);
                setProveedores(proveedoresRes.data);
                setMarcas(marcasRes.data);
            } catch (error) {
                console.error('Error al obtener proveedores y marcas:', error);
            }
        };
        obtenerProveedoresYMarcas();
    }, []);

    useEffect(() => {
        // Solo obtener los repuestos si ya se tienen proveedores y marcas
        if (proveedores.length > 0 && marcas.length > 0) {
            obtenerRepuestos();
        }
    });

    //obtener los repuestos

    const obtenerRepuestos = async () => {
        try {
            const response = await axios.get('http://localhost:5000/repuestos/');
            const repuestosData = response.data;
    
            // Asignar nombres de marcas y proveedores en lugar de IDs
            const repuestosConNombres = repuestosData.map((repuesto) => {
                const marca = marcas.find(m => m.Id_marca_repuesto === repuesto.Id_marca_repuesto);
                const proveedor = proveedores.find(p => p.Id_proveedor === repuesto.Id_proveedor);
                return {
                    ...repuesto,
                    NombreMarca: marca ? marca.Nombre : 'Desconocida',
                    NombreProveedor: proveedor ? proveedor.Nombre : 'Desconocido',
                };
            });
    
            setRepuestos(repuestosConNombres);
            setRepuestosOriginales(repuestosConNombres); // Guarda la lista completa en repuestosOriginales
        } catch (error) {
            console.error("Error al obtener repuestos:", error);
        }
    };
    


    // Manejo de búsqueda de repuestos
    const handleSearch = () => {
        if (nombreBusqueda.trim() === '') {
            setRepuestos(repuestosOriginales); // Si el campo de búsqueda está vacío, restaurar la lista completa
        } else {
            const resultados = repuestosOriginales.filter(repuesto => 
                repuesto.Nombre.toLowerCase().includes(nombreBusqueda.toLowerCase())
            );
            setRepuestos(resultados);
        }
    };

    // Agregar nuevo repuesto
    const handleAdd = () => {
        setModalIsOpen(true);
        setIsEditMode(false);
        setIsAddingMode(true);
        setFormData({
            Nombre: '',
            Id_marca_repuesto: '',
            Id_proveedor: '',
            Descripcion: '',
            Precio: '',
        });
    };

    // Editar repuesto
    const handleEdit = (repuesto) => {
        setModalIsOpen(true);
        setIsEditMode(true);
        setIsAddingMode(false);
        setFormData(repuesto);
    };

    // Eliminar repuesto
    const handleDelete = async (idRepuesto) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este repuesto?')) {
            try {
                await axios.delete(`http://localhost:5000/repuestos/${idRepuesto}`);
                mostrarMensaje('Repuesto eliminado exitosamente', 'success');
                obtenerRepuestos(); // Refresca la lista de repuestos después de eliminar
            } catch (error) {
                mostrarMensaje('Error al eliminar el repuesto', 'error');
                console.error(error);
            }
        }
    };

    // Manejo de cambios en el formulario
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isAddingMode) {
                await axios.post('http://localhost:5000/repuestos', formData);
                mostrarMensaje('Repuesto agregado exitosamente', 'success');
            } else if (isEditMode) {
                await axios.put(`http://localhost:5000/repuestos/${formData.Id_repuesto}`, formData);
                mostrarMensaje('Repuesto actualizado exitosamente', 'success');
            }
            setModalIsOpen(false);
            setRepuestos([]);
            setNombreBusqueda('');
            obtenerRepuestos();
        } catch (error) {
            mostrarMensaje('Error al agregar o actualizar el repuesto', 'error');
            console.error(error);
        }
    };

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
                    placeholder="Buscar por nombre del repuesto"
                    value={nombreBusqueda}
                    onChange={(e) => setNombreBusqueda(e.target.value)}
                    className="w-3/5 my-5 rounded-md border-0 py-1.5  text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-950 sm:text-sm/6"
                />
                <button type="button"
                 className=" w-11 h-11  my-5 mx-2 flex items-center justify-center rounded-md bg-yellow-500 p-1  text-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"onClick={handleSearch}>
                    <MagnifyingGlassIcon  className="h-6 w-6" />
                </button>
                {rolUsuario === "Administrador" && (
                <button  type="button"
              className=" w-11 h-11 my-5 mx-2 flex items-center justify-center  rounded-md bg-yellow-500  p-1 text-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" onClick={handleAdd}>
                <PlusIcon className="h-6 w-6" />
                </button>)}
      </div>
      <div className="w-full min-h-full flex col-start-1 justify-center  text-black mt-5">
        <div className="overflow-y-auto bg-white max-h-full w-full">
            <table className="min-w-full w-full divide-y divide-gray-200">
            <thead className="sticky top-0">
                    <tr  className=" bg-zinc-600 h-8 rounded-none m-0 p-0">
                        <th className="text-center text-white m-12 p-2">Nombre</th>
                        <th className="text-center text-white m-12 p-2">Marca</th>
                        <th className="text-center text-white m-12 p-2">Proveedor</th>
                        <th className="text-center text-white m-12 p-2">Descripción</th>
                        <th className="text-center text-white m-12 p-2">Precio</th>
                        {rolUsuario === "Administrador" && <th className="text-center text-white m-12 p-2"></th>}
                    </tr>
                </thead>
                <tbody>
                    {repuestos.map((repuesto) => (
                        <tr key={repuesto.Id_repuesto}>
                            <td className="border-b-2 border-zinc-600  text-left px-14 ">{repuesto.Nombre}</td>
                            <td className="border-b-2 border-zinc-600  text-left px-14 ">{repuesto.NombreMarca}</td>
                            <td className="border-b-2 border-zinc-600  text-left px-14 ">{repuesto.NombreProveedor}</td>
                            <td className="border-b-2 border-zinc-600  text-left px-14 ">{repuesto.Descripcion}</td>
                            <td className="border-b-2 border-zinc-600  text-left px-14 ">{repuesto.Precio}</td>
                            {rolUsuario === "Administrador" && (<td className="border-b-2 border-zinc-600  text-left px-14 ">
                                <button  className=" w-7 h-7 m-2 flex items-center justify-center rounded-md bg-green-600 p-1  text-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" onClick={() => handleEdit(repuesto)}>
                                    <ArrowPathIcon aria-hidden="true" className="h-6 w-6" />
                                </button>
                                <button className=" w-7 h-7  m-2 flex items-center justify-center rounded-md bg-red-500 p-1  text-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" onClick={() => handleDelete(repuesto.Id_repuesto)}>
                                    <TrashIcon aria-hidden="true" className="h-6 w-6"  />
                                </button>
                            </td> )}
                        </tr>
                    ))}
                </tbody>
            </table>

            <Modal style={{content:{backgroundColor:"white"},overlay:{backgroundColor:"rgba(0, 0, 0, 0.80)"}}} className=" h-auto w-full absolute left-96 p-5 top-11 rounded-lg max-w-2xl mx-auto my-8" isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}>
                
                <form className="flex flex-col justify-between text-center w-full h-full "onSubmit={handleSubmit}>
                    <h2>{isAddingMode ? 'Agregar Repuesto' : 'Detalles del Repuesto'}</h2>
                    <div style={{height:"25rem"}} className="flex flex-col justify-between p-6 ">
                     <input
                        className="h-12 block font-medium my-3 text-gray-900"
                        type="text"
                        name="Nombre"
                        placeholder='Nombre del repuesto'
                        value={formData.Nombre}
                        onChange={handleInputChange}
                        readOnly={!isEditMode && !isAddingMode}
                    />

                    <select
                        className="h-12 block font-medium my-3 text-gray-900"
                        name="Id_marca_repuesto"
                        placeholder='Seleccione la marca'
                        value={formData.Id_marca_repuesto}
                        onChange={handleInputChange}
                        disabled={!isEditMode && !isAddingMode}
                    >
                        <option value="" disabled>Seleccione la marca</option>
                        {marcas.map((marca) => (
                            <option key={marca.Id_marca_repuesto} value={marca.Id_marca_repuesto}>
                                {marca.Nombre}
                            </option>
                        ))}
                    </select>

                        <select
                        className="h-12 block font-medium my-3 text-gray-900"
                        name="Id_proveedor"
                        placeholder='Seleccione el proveedor'
                        value={formData.Id_proveedor}
                        onChange={handleInputChange}
                        disabled={!isEditMode && !isAddingMode}
                         >
                        <option value="" disabled>eleccione el proveedor</option>
                        {proveedores.map((proveedor) => (
                            <option key={proveedor.Id_proveedor} value={proveedor.Id_proveedor}>
                                {proveedor.Nombre}
                            </option>
                        ))}
                    </select>

                          <input
                        className="h-12 block font-medium my-3 text-gray-900"
                        type="text"
                        placeholder='Ingrese una descripción para el repuesto'
                        name="Descripcion"
                        value={formData.Descripcion}
                        onChange={handleInputChange}
                        readOnly={!isEditMode && !isAddingMode}
                    />

                     <input
                        className="h-12 block font-medium my-3 text-gray-900"
                        type="number"
                        placeholder='Precio'
                        name="Precio"
                        value={formData.Precio}
                        onChange={handleInputChange}
                        readOnly={!isEditMode && !isAddingMode}
                    />
                    </div>

                    <div className=" flex content-end justify-around items-center  w-full h-20">
                        {isAddingMode ? (
                            <>
                                <button className="h-11 w-44 my-5 mx-2 flex items-center justify-center rounded-sm bg-yellow-500 p-1  text-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"type="button" onClick={() => setModalIsOpen(false)}>
                                    Cancelar
                                </button>
                                <button className="h-11 w-44 my-5 mx-2 flex items-center justify-center rounded-sm bg-yellow-500 p-1  text-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"type="submit">Agregar</button>
                            </>
                        ) : (
                            <>
                                <button className="h-11 w-44 my-5 mx-2 flex items-center justify-center rounded-sm bg-yellow-500 p-1  text-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" type="submit">Aceptar</button>
                                <button className="h-11 w-44 my-5 mx-2 flex items-center justify-center rounded-sm bg-yellow-500 p-1  text-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" type="button" onClick={() => setModalIsOpen(false)}>
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

export default Repuestos;

