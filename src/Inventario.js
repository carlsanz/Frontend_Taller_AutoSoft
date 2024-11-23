import { PlusCircleIcon, PlusIcon, TrashIcon, ArrowPathIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';

Modal.setAppElement('#root');

const Inventario = ({ rolUsuario }) => {
    const [inventario, setInventario] = useState([]);
    const [repuestos, setRepuestos] = useState([]);
    const [repuestoSeleccionado, setRepuestoSeleccionado] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [inventarioData, setInventarioData] = useState({
        Id_inventario: '',
        Fecha_ingreso: '',
        Cantidad_disponible: ''
    });

    const navigate = useNavigate();

    useEffect(() => {
        obtenerInventario();
        obtenerRepuestos();
    }, []);

    const obtenerInventario = async () => {
        try {
            const response = await axios.get('http://localhost:5000/inventarios/inventario');
            setInventario(response.data);
        } catch (error) {
            console.error('Error al obtener el inventario', error);
            setInventario([]);
        }
    };

    const obtenerRepuestos = async () => {
        try {
            const response = await axios.get('http://localhost:5000/inventarios/repuestos');
            setRepuestos(response.data);
        } catch (error) {
            console.error('Error al obtener repuestos:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInventarioData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAgregarInventario = async (e) => {
        e.preventDefault();
        if (!repuestoSeleccionado) {
            alert('Por favor seleccione un repuesto');
            return;
        }

        try {
            if (editMode) {
                // Modo de edición
                await axios.put(`http://localhost:5000/inventarios/inventario/${inventarioData.Id_inventario}`, {
                    Id_repuesto: repuestoSeleccionado,
                    ...inventarioData
                });
            } else {
                // Modo de agregar
                await axios.post('http://localhost:5000/inventarios/inventarios', {
                    Id_repuesto: repuestoSeleccionado,
                    ...inventarioData
                });
            }

            obtenerInventario();
            resetForm(); // Limpiar el formulario después de agregar o editar
            setModalIsOpen(false); // Cierra el modal después de agregar
        } catch (error) {
            console.error('Error al agregar o editar el inventario:', error);
            alert('Error al procesar el inventario');
        }
    };

    const handleEditar = (item) => {
        setInventarioData({
            Id_inventario: item.Id_inventario,
            Fecha_ingreso: item.Fecha_ingreso,
            Cantidad_disponible: item.Cantidad_disponible
        });
        setRepuestoSeleccionado(item.Id_repuesto);
        setModalIsOpen(true);
        setEditMode(true);
    };

    const handleEliminar = async (id) => {
        if (window.confirm('¿Está seguro de que desea eliminar este registro?')) {
            try {
                await axios.delete(`http://localhost:5000/inventarios/inventario/${id}`);
                obtenerInventario();
            } catch (error) {
                console.error('Error al eliminar el inventario:', error);
                alert('Error al eliminar el inventario');
            }
        }
    };

    const resetForm = () => {
        setInventarioData({
            Id_inventario: '',
            Fecha_ingreso: '',
            Cantidad_disponible: ''
        });
        setRepuestoSeleccionado('');
        setEditMode(false);
    };

    const handleAgregarNuevoClick = () => {
        setModalIsOpen(true);
        resetForm();
    };

    const closeModal = () => {
        setModalIsOpen(false);
        resetForm();
    };

    return (
        <div
            style={{ width: '100vw', overflowX: 'hidden', backgroundImage: 'url(/image/vehiculo.jpg)', backgroundSize: 'cover', backgroundPosition: 'top' }}
            className="-z-10 absolute p-32 pb-0 flex flex-col h-screen justify-center"
        >
            <div className="flex h-auto justify-center min-w-full">
                <input
                    id="buscar-home"
                    name="Buscar-cliente"
                    type="text"
                    placeholder="Busca un servicio"
                    className="w-3/5 my-5 rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-950 sm:text-sm/6"
                />
                <button
                    type="button"
                    className="w-11 h-11 my-5 mx-2 flex items-center justify-center rounded-md bg-yellow-500 p-1 text-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                    <MagnifyingGlassIcon aria-hidden="true" className="h-6 w-6" />
                </button>
                {rolUsuario === "Administrador" && (
                    <button
                        className="w-11 h-11 my-5 mx-2 flex items-center justify-center rounded-md bg-yellow-500 p-1 text-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                        onClick={handleAgregarNuevoClick}
                    >
                        <PlusIcon aria-hidden="true" className="h-6 w-6" />
                    </button>
                )}
            </div>

            <div className="w-auto min-h-full flex col-start-1 justify-center text-black">
            <table className="table-row-group justify-center bg-white rounded-none m-0 p-0 mt-0 pt-0 ">
      <thead>
                    <tr className=" bg-zinc-600  h-8 rounded-none m-0 p-0" >
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th className="text-center text-xs text-white mr-0 m-12 py-2 px-4"><button 
                            className="w-32 h-10 bg-zinc-700 m-2 flex items-center justify-evenly rounded-md  text-yellow-500  hover:text-yellow-500 focus:outline-none focus:ring-2 hover:bg-gray-500 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                            onClick={() => navigate("/repuestos")}>
                            <PlusCircleIcon aria-hidden="true" className="h-5 w-5" /> Nuevo Repuesto
                            </button> 
                        </th>
                    </tr>

                    <tr className=" bg-zinc-600 h-8 rounded-none m-0 p-0">
                        <th className="text-center text-white m-12 p-2">Repuesto</th>
                        <th className="text-center text-white m-12 p-2">Descripción</th>
                        <th className="text-center text-white m-12 p-2">Marca</th>
                        <th className="text-center text-white m-12 p-2">Proveedor</th>
                        <th className="text-center text-white m-12 p-2">Precio</th>
                        <th className="text-center text-white m-12 p-2">Cantidad</th>
                        <th className="text-center text-white m-12 p-2">Fecha Ingreso</th>
                        {rolUsuario === "Administrador" && <th className="text-center text-white m-12 p-2"></th>}
                    </tr>
                </thead>
                <tbody>
                    {inventario.length > 0 ? (
                        inventario.map((item) => (
                            <tr key={item.Id_inventario}>
                                <td className="border-b-2 border-zinc-600  text-left px-8 ">{item.nombre}</td>
                                <td className="border-b-2 border-zinc-600  text-left px-8 ">{item.descripcion}</td>
                                <td className="border-b-2 border-zinc-600  text-left px-8 ">{item.marca}</td>
                                <td className="border-b-2 border-zinc-600  text-left px-8 ">{item.proveedor}</td>
                                <td className="border-b-2 border-zinc-600  text-left px-8 ">{item.precio}</td>
                                <td className="border-b-2 border-zinc-600  text-left px-8 ">{item.Cantidad_disponible}</td>
                                <td className="border-b-2 border-zinc-600  text-left px-8 ">{item.Fecha_ingreso || "Fecha inválida"}</td>
                                
                                {/* Mostrar botones de editar y eliminar solo para Administrador */}
                                {rolUsuario === "Administrador"  && (
                                    <td className="border-b-2 border-zinc-600  text-left px-8 ">
                                        <button 
                                             className=" w-7 h-7 m-2 flex items-center justify-center rounded-md bg-green-600 p-1  text-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                                            onClick={() => handleEditar(item)}
                                        >
                                             <ArrowPathIcon aria-hidden="true" className="h-6 w-6" />
                                        </button>
                                        <button 
                                            className=" w-7 h-7  m-2 flex items-center justify-center rounded-md bg-red-500 p-1  text-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                                            onClick={() => handleEliminar(item.Id_inventario)}
                                        >
                                            <TrashIcon aria-hidden="true" className="h-6 w-6"  />
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="10">No hay datos disponibles</td>
                        </tr>
                    )}
                </tbody>
            </table>
            </div>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                className=" h-auto w-full absolute left-96 p-5 top-36 rounded-lg max-w-2xl mx-auto my-8 " 
                style={{
                    content: { backgroundColor: "white", maxWidth: "600px", margin: "auto", padding: "20px" },
                    overlay: { backgroundColor: "rgba(0, 0, 0, 0.8)" }
                }}
            >
                <form onSubmit={handleAgregarInventario}
                className="flex flex-col justify-between text-center h-full ">
                    <h2> {editMode ? 'Actualizar inventario': 'Agregar inventario'}</h2>
                    <div style={{height:"15rem"}} className="flex flex-col justify-between p-6 ">
                    
                    <select
                        className="h-12 block font-medium my-3 text-gray-900"
                        value={repuestoSeleccionado}
                        onChange={(e) => setRepuestoSeleccionado(e.target.value)}
                    >
                        <option value="">Seleccione un repuesto</option>
                        {repuestos.map(repuesto => (
                            <option key={repuesto.Id_repuesto} value={repuesto.Id_repuesto}>
                                {repuesto.Nombre}
                            </option>
                        ))}
                    </select>
                    <input
                        className="h-12 block font-medium my-3 text-gray-900"
                        placeholder='Fecha de ingreso'
                        type="date"
                        name="Fecha_ingreso"
                        value={inventarioData.Fecha_ingreso}
                        onChange={handleChange}
                    />
                    
                    <input
                        className="h-12 block font-medium my-3 text-gray-900"
                        placeholder='Cantidad ingresados'
                        type="number"
                        name="Cantidad_disponible"
                        value={inventarioData.Cantidad_disponible}
                        onChange={handleChange}
                    />
                    </div>
                    <div className=" flex content-end justify-around items-center  w-full h-20">
                    <button className="h-11 w-44 my-5 mx-2 flex items-center justify-center rounded-sm bg-yellow-500 p-1  text-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" type="submit">{editMode ? "Guardar Cambios" : "Guardar"}</button>
                    <button className="h-11 w-44 my-5 mx-2 flex items-center justify-center rounded-sm bg-yellow-500 p-1  text-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" type="button" onClick={closeModal}>Cancelar</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Inventario;
