import axios from 'axios';
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { TrashIcon, ArrowPathIcon, Bars3Icon, BellIcon, XMarkIcon, PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
Modal.setAppElement('#root'); 


const Repuestos = () => {
         //Elementos del Nav
         const navigation = [
            { name: 'Home', ruta: "/Home", current: true },
            { name: 'Servicios', ruta: "/servicios", current: false },
            { name: 'Inventario', ruta: "#", current: false },
            { name: 'Repuestos', ruta: "/repuestos", current: false },
            { name: 'Empleados', ruta: "/agregar-usuario", current: false },
            { name: 'Autos', ruta: "/autos", current: false },
            { name: 'Clientes', ruta: "/clientes", current: false },
          ]
    
        function classNames(...classes) {
            return classes.filter(Boolean).join(' ')
          }
          
        const navigate = useNavigate();
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
                alert('Repuesto eliminado');
                obtenerRepuestos(); // Refresca la lista de repuestos después de eliminar
            } catch (error) {
                alert('Error al eliminar el repuesto');
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
                alert('Repuesto agregado exitosamente');
            } else if (isEditMode) {
                await axios.put(`http://localhost:5000/repuestos/${formData.Id_repuesto}`, formData);
                alert('Repuesto actualizado exitosamente');
            }
            setModalIsOpen(false);
            setRepuestos([]);
            setNombreBusqueda('');
            obtenerRepuestos();
        } catch (error) {
            alert('Error al agregar o actualizar el repuesto');
            console.error(error);
        }
    };

    return (
        <div style={{ width: '100vw', overflowX: 'hidden'  }} className="relative flex-col h-screen " >
            <Disclosure as="nav" className="bg-gray-800  w-full top-0 fixed">
        <div className="mx-0 max-w-full lg px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              {/* Mobile menu button */}
              <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open main menu</span>
                <Bars3Icon aria-hidden="true" className="block h-6 w-6 group-data-[open]:hidden" />
                <XMarkIcon aria-hidden="true" className="hidden h-6 w-6 group-data-[open]:block" />
              </DisclosureButton>
            </div>
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex flex-shrink-0 items-center">
                <img
                  alt="Your Company"
                  src="/image/WhatsApp Image 2024-09-30 at 7.04.38 PM-fotor-20241006193033.png"
                  className="h-8 w-auto"
                />
              </div>
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4">
                  {navigation.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => navigate(item.ruta)}
                      aria-current={item.current ? 'page' : undefined}
                      className={classNames(
                        item.current ? 'bg-gray-700 hover:bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                        'rounded-md px-3 py-2 text-sm font-medium',
                      )}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <button
                type="button"
                className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                <span className="absolute -inset-1.5" />
                <span className="sr-only">View notifications</span>
                <BellIcon aria-hidden="true" className="h-6 w-6" />
              </button>

              {/* Profile dropdown */}
              <Menu as="div" className="relative ml-3">
                <div>
                  <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Open user menu</span>
                    <img
                      alt=""
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      className="h-8 w-8 rounded-full"
                    />
                  </MenuButton>
                </div>
                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                >
                  <MenuItem>
                    <a
                      href="h"
                      className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                    >
                      Your Profile
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <a
                      href="hh"
                      className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                    >
                      Settings
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <button
                      onClick={() => navigate("/")}
                      className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                    >
                      Sign out
                    </button>
                  </MenuItem>
                </MenuItems>
              </Menu>
            </div>
          </div>
        </div>

        <DisclosurePanel className="sm:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2">
            {navigation.map((item) => (
              <DisclosureButton
                key={item.name}
                as="a"
                href={item.href}
                aria-current={item.current ? 'page' : undefined}
                className={classNames(
                  item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                  'block rounded-md px-3 py-2 text-base font-medium',
                )}
              >
                {item.name}
              </DisclosureButton>
            ))}
          </div>
        </DisclosurePanel>
      </Disclosure>

      <div className="bg-gray-100 -z-10 min-h-full max-w-full flex flex-col items-center justify-center">
      <img className="h-1/2 w-full m-0 p-0" src="image/vehiculo.jpg" alt=''/>
      <div className="fixed top-20 flex justify-center min-w-full ">
      <input
                    type="text"
                    placeholder="Buscar por nombre del repuesto"
                    value={nombreBusqueda}
                    onChange={(e) => setNombreBusqueda(e.target.value)}
                    className="w-3/5 my-5 rounded-md border-0 py-1.5  text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-950 sm:text-sm/6"
                />
                <button type="button"
                 className=" w-11 h-11  my-5 mx-2 flex items-center justify-center rounded-md bg-yellow-500 p-1  text-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"onClick={handleSearch}>
                    <MagnifyingGlassIcon aria-hidden="true" className="h-6 w-6" />
                </button>
                <button  type="button"
              className=" w-11 h-11 my-5 mx-2 flex items-center justify-center  rounded-md bg-yellow-500  p-1 text-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" onClick={handleAdd}>
                <PlusIcon aria-hidden="true" className="h-6 w-6" />
                </button>
      </div>
      <div className="fixed top-40 min-h-full flex col-start-1 justify-center w-auto bg-white text-black">
      <table className="table-row-group justify-center w-full rounded-none m-0 p-0 mt-0 pt-0 ">
                <thead>
                    <tr  className=" bg-zinc-600 h-8 rounded-none m-0 p-0">
                        <th className="text-center text-white m-12 p-2">Nombre</th>
                        <th className="text-center text-white m-12 p-2">Marca</th>
                        <th className="text-center text-white m-12 p-2">Proveedor</th>
                        <th className="text-center text-white m-12 p-2">Descripción</th>
                        <th className="text-center text-white m-12 p-2">Precio</th>
                        <th className="text-center text-white m-12 p-2"></th>
                    </tr>
                </thead>
                <tbody>
                    {repuestos.map((repuesto) => (
                        <tr key={repuesto.Id_repuesto}>
                            <td className="border-b-2 border-zinc-600  text-left px-8 ">{repuesto.Nombre}</td>
                            <td className="border-b-2 border-zinc-600  text-left px-8 ">{repuesto.NombreMarca}</td>
                            <td className="border-b-2 border-zinc-600  text-left px-8 ">{repuesto.NombreProveedor}</td>
                            <td className="border-b-2 border-zinc-600  text-left px-8 ">{repuesto.Descripcion}</td>
                            <td className="border-b-2 border-zinc-600  text-left px-8 ">{repuesto.Precio}</td>
                            <td className="border-b-2 border-zinc-600  text-left px-8 ">
                                <button  className=" w-7 h-7 m-2 flex items-center justify-center rounded-md bg-green-600 p-1  text-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" onClick={() => handleEdit(repuesto)}>
                                    <ArrowPathIcon aria-hidden="true" className="h-6 w-6" />
                                </button>
                                <button className=" w-7 h-7  m-2 flex items-center justify-center rounded-md bg-red-500 p-1  text-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" onClick={() => handleDelete(repuesto.Id_repuesto)}>
                                    <TrashIcon aria-hidden="true" className="h-6 w-6"  />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
      </div>
      </div>

            <Modal style={{content:{backgroundColor:"white"},overlay:{backgroundColor:"rgba(0, 0, 0, 0.80)"}}} className=" h-auto w-full absolute left-96 p-5 rounded-lg max-w-2xl mx-auto my-8" isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}>
                
                <form className="flex flex-col justify-between text-center w-full h-full "onSubmit={handleSubmit}>
                    <h2>{isAddingMode ? 'Agregar Repuesto' : 'Detalles del Repuesto'}</h2>
                    <div style={{height:"28rem"}} className="flex flex-col justify-between p-6 ">
                    <label>Nombre</label>
                    <input
                        className="h-12 block font-medium my-3 text-gray-900"
                        type="text"
                        name="Nombre"
                        value={formData.Nombre}
                        onChange={handleInputChange}
                        readOnly={!isEditMode && !isAddingMode}
                    />

                    <label>Marca</label>
                    <select
                        className="h-12 block font-medium my-3 text-gray-900"
                        name="Id_marca_repuesto"
                        value={formData.Id_marca_repuesto}
                        onChange={handleInputChange}
                        disabled={!isEditMode && !isAddingMode}
                    >
                        <option value="">--Selecciona una marca--</option>
                        {marcas.map((marca) => (
                            <option key={marca.Id_marca_repuesto} value={marca.Id_marca_repuesto}>
                                {marca.Nombre}
                            </option>
                        ))}
                    </select>

                    <label>Proveedor</label>
                    <select
                        className="h-12 block font-medium my-3 text-gray-900"
                        name="Id_proveedor"
                        value={formData.Id_proveedor}
                        onChange={handleInputChange}
                        disabled={!isEditMode && !isAddingMode}
                    >
                        <option value="">--Selecciona un proveedor--</option>
                        {proveedores.map((proveedor) => (
                            <option key={proveedor.Id_proveedor} value={proveedor.Id_proveedor}>
                                {proveedor.Nombre}
                            </option>
                        ))}
                    </select>

                    <label>Descripción</label>
                    <input
                        className="h-12 block font-medium my-3 text-gray-900"
                        type="text"
                        name="Descripcion"
                        value={formData.Descripcion}
                        onChange={handleInputChange}
                        readOnly={!isEditMode && !isAddingMode}
                    />

                    <label>Precio</label>
                    <input
                        className="h-12 block font-medium my-3 text-gray-900"
                        type="number"
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
    );
};

export default Repuestos;

