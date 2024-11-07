import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { TrashIcon, ArrowPathIcon, Bars3Icon, BellIcon, XMarkIcon, PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import logo from './styles/pictures/logo.PNG';
import { Link } from 'react-router-dom';
Modal.setAppElement('#root'); 


const Inventario = ({ rolUsuario }) => {
    const navigation = [
        { name: 'Home', ruta: "/Home", current: true },
        { name: 'Servicios', ruta: "/servicios", current: false },
        { name: 'Inventario', ruta: "/inventario", current: false },
        { name: 'Repuestos', ruta: "/repuestos", current: false },
        { name: 'Empleados', ruta: "/agregar-usuario", current: false },
        { name: 'Autos', ruta: "/autos", current: false },
        { name: 'Clientes', ruta: "/clientes", current: false },
      ]
      const navigate = useNavigate();
      
      function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
      }
      
      
      const [inventario, setInventario] = useState([]);
      const [repuestos, setRepuestos] = useState([]);
      const [repuestoSeleccionado, setRepuestoSeleccionado] = useState('');
      const [mostrarFormulario, setMostrarFormulario] = useState(false);
      const [editMode, setEditMode] = useState(false);
      const [inventarioData, setInventarioData] = useState({
          Id_inventario: '',
          Fecha_ingreso: '',
          Cantidad_disponible: '',
          Fecha_inicio: '',
          Fecha_fin: ''
      });
  
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
              setMostrarFormulario(false); // Cierra el formulario después de agregar
          } catch (error) {
              console.error('Error al agregar o editar el inventario:', error);
              alert('Error al procesar el inventario');
          }
      };
      
  
      const handleEditar = (item) => {
          setInventarioData({
              Id_inventario: item.Id_inventario,
              Fecha_ingreso: item.Fecha_ingreso,
              Cantidad_disponible: item.Cantidad_disponible,
              Fecha_inicio: item.Fecha_inicio,
              Fecha_fin: item.Fecha_fin
          });
          setRepuestoSeleccionado(item.Id_repuesto);
          setMostrarFormulario(true);
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
              Cantidad_disponible: '',
              Fecha_inicio: '',
              Fecha_fin: ''
          });
          setRepuestoSeleccionado('');
          setEditMode(false);
      };
  
      const handleAgregarNuevoClick = () => {
          setMostrarFormulario(true);
          resetForm();
          
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
                  src={logo}
                  className="h-10 w-auto"
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
                      Perfil
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <Link
                      to="/cambiar-contraseña"
                      className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                    >
                      Cambiar contraseña
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <button
                      onClick={() => navigate("/")}
                      className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                    >
                      Salir
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
          id="buscar-home"
          name="Buscar-cliente"
          type="text"
          placeholder="Busca un servicio"
          className="w-3/5 my-5 rounded-md border-0 py-1.5  text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-950 sm:text-sm/6"
        />
         
        <button
              type="button"
              className=" w-11 h-11  my-5 mx-2 flex items-center justify-center rounded-md bg-yellow-500 p-1  text-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" >
              <MagnifyingGlassIcon aria-hidden="true" className="h-6 w-6" />
        </button>
        {rolUsuario === "Administrador" && (
                <button 
                className=" w-11 h-11  my-5 mx-2 flex items-center justify-center rounded-md bg-yellow-500 p-1  text-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" 
                onClick={handleAgregarNuevoClick}
                >
                    {editMode ? <ArrowPathIcon aria-hidden="true" className="h-6 w-6" /> : <PlusIcon aria-hidden="true" className="h-6 w-6" />}
                </button>
            )}
        </div>

        <div className="fixed top-40 w-auto min-h-full flex col-start-1 justify-center bg-white text-black">
      <table className="table-row-group justify-center w-full rounded-none m-0 p-0 mt-0 pt-0 ">
      <thead>
                    <tr className=" bg-zinc-600 h-8 rounded-none m-0 p-0">
                        <th className="text-center text-white m-12 p-2">Repuesto</th>
                        <th className="text-center text-white m-12 p-2">Descripción</th>
                        <th className="text-center text-white m-12 p-2">Marca</th>
                        <th className="text-center text-white m-12 p-2">Proveedor</th>
                        <th className="text-center text-white m-12 p-2">Precio</th>
                        <th className="text-center text-white m-12 p-2">Cantidad</th>
                        <th className="text-center text-white m-12 p-2">Fecha Ingreso</th>
                        <th className="text-center text-white m-12 p-2">Fecha Inicio</th>
                        <th className="text-center text-white m-12 p-2">Fecha Fin</th>
                        {rolUsuario === "Administrador" && <th className="text-center text-white m-12 p-2"> Acciones</th>}
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
                                <td className="border-b-2 border-zinc-600  text-left px-8 ">{item.Fecha_inicio || "Fecha inválida"}</td>
                                <td className="border-b-2 border-zinc-600  text-left px-8 ">{item.Fecha_fin || "Fecha inválida"}</td>
                                
                                {/* Mostrar botones de editar y eliminar solo para Administrador */}
                                {rolUsuario === "Administrador" && (
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

            <modal style={{content:{backgroundColor:"white"},overlay:{backgroundColor:"rgba(0, 0, 0, 0.80)"}}} className=" h-auto w-full absolute left-96 p-5 rounded-lg max-w-2xl mx-auto my-8">
                {mostrarFormulario && (
                <form className="flex flex-col justify-between text-center w-full h-full " onSubmit={handleAgregarInventario}>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label>Repuesto</label>
                            <select
                                className="form-select"
                                value={repuestoSeleccionado}
                                onChange={(e) => setRepuestoSeleccionado(e.target.value)}
                            >
                                <option value="">Selecciona un repuesto</option>
                                {repuestos.map((repuesto) => (
                                    <option key={repuesto.Id_repuesto} value={repuesto.Id_repuesto}>
                                        {repuesto.Nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label>Fecha de Ingreso</label>
                            <input
                                type="date"
                                className="form-control"
                                name="Fecha_ingreso"
                                value={inventarioData.Fecha_ingreso}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-md-4">
                            <label>Fecha Inicio</label>
                            <input
                                type="date"
                                className="form-control"
                                name="Fecha_inicio"
                                value={inventarioData.Fecha_inicio}
                                onChange={handleChange}
                                min={inventarioData.Fecha_ingreso}
                            />
                        </div>
                        <div className="col-md-4">
                            <label>Fecha Fin</label>
                            <input
                                type="date"
                                className="form-control"
                                name="Fecha_fin"
                                value={inventarioData.Fecha_fin}
                                onChange={handleChange}
                                min={inventarioData.Fecha_inicio}
                            />
                        </div>
                        <div className="col-md-4">
                            <label>Cantidad Disponible</label>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Cantidad Disponible"
                                name="Cantidad_disponible"
                                value={inventarioData.Cantidad_disponible}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-12">
                            <button type="submit" className="btn btn-success me-2">
                                {editMode ? 'Guardar Cambios' : 'Guardar'}
                            </button>
                            <button 
                                type="button" 
                                className="btn btn-secondary"
                                onClick={resetForm}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </form>
            )}

       </modal>


      

      </div>

            
      </div>      
        </div>
    );
};

export default Inventario;
