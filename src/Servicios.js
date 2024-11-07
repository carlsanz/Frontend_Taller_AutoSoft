import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { TrashIcon, ArrowPathIcon, Bars3Icon, BellIcon, XMarkIcon, PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import logo from './styles/pictures/logo.PNG';
import { Link } from 'react-router-dom';
Modal.setAppElement('#root'); 

const Servicios = ({ rolUsuario }) => {
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

//FUNCIONES DEL CRUD

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

           {rolUsuario === 'Administrador' && (
            <button
            onClick={() => { setIsEditing(false); setIsModalOpen(true); }}
              type="button"
              className=" w-11 h-11 my-5 mx-2 flex items-center justify-center  rounded-md bg-yellow-500  p-1 text-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              <PlusIcon aria-hidden="true" className="h-6 w-6" />
            </button>)}
        </div>

      <div className="fixed top-40 w-4/5 min-h-full flex col-start-1 justify-center bg-white text-black">
      <table className="table-row-group justify-center w-full rounded-none m-0 p-0 mt-0 pt-0 ">
                <thead >
                    <tr className=" bg-zinc-600 h-8 rounded-none m-0 p-0">
                         <th className="text-center text-white m-12 p-2">Nombre</th>
                         <th className=" text-center text-white m-12 p-2">Descripción</th>
                         <th className=" text-center text-white m-12 p-2">Precio</th>
                         <th className=" text-center text-white m-12 p-2">Tipo de Servicio</th>
                        {rolUsuario === 'Administrador' && <th></th>}
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
                                <td className="border-b-2 border-zinc-600  text-left px-8 ">{servicio.Nombre}</td>
                                <td className="border-b-2 border-zinc-600  text-justify px-8">{servicio.Descripcion}</td>
                                <td className="border-b-2 border-zinc-600  text-center px-8">{servicio.Precio}</td>
                                <td className="border-b-2 border-zinc-600 text-center px-8">{servicio.Tipo_servicio}</td>
                                {rolUsuario === "Administrador" && (
                                    <td className=" border-b-2  border-zinc-600 px-8"> 
                                        <button type="button"
                                        onClick={() => handleEdit(servicio)}
                                         className=" w-7 h-7 m-2 flex items-center justify-center rounded-md bg-green-600 p-1  text-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" >
                                         <ArrowPathIcon aria-hidden="true" className="h-6 w-6" /></button>
                                        <button type="button"
                                        onClick={() => handleDelete(servicio.Id_servicio)}
                                        className=" w-7 h-7  m-2 flex items-center justify-center rounded-md bg-red-500 p-1  text-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" >
                                         <TrashIcon aria-hidden="true" className="h-6 w-6"  /></button>
                                    </td>
                                )}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            <Modal style={{content:{backgroundColor:"white"},overlay:{backgroundColor:"rgba(0, 0, 0, 0.80)"}}} className=" h-auto w-full absolute left-96 p-5 rounded-lg max-w-2xl mx-auto my-8"  isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)}>
                       
                        
                        <form className="flex flex-col justify-between text-center w-full h-full " onSubmit={handleSubmit}>
                         <h2>{isEditing ? 'Detalles del servicio' : 'Agregar Nuevo Servicio'}</h2>
                         <div style={{height:"28rem"}} className="flex flex-col justify-between p-6 ">
                         
                                <label>Nombre</label>
                                <input className="h-12 block font-medium my-3 text-gray-900" type="text" name="Nombre" value={formData.Nombre} onChange={handleInputChange} required />

                                <label>Precio</label>
                                <input className="h-12 block font-medium my-3 text-gray-900" type="number" name="Precio" value={formData.Precio} onChange={handleInputChange} required />

                                <label>Tipo de Servicio</label>
                                <select className="h-12 block font-medium my-3 text-gray-900" name="Tipo_servicio" value={formData.Tipo_servicio} onChange={handleInputChange}>
                                    <option value="" disabled>Seleccione el tipo de servicio</option>
                                    <option value="Preventivo">Preventivo</option>
                                    <option value="Correctivo">Correctivo</option>
                                </select>
                                <label>Descripción</label>
                                <textarea className="h-80 block font-medium my-3 text-gray-900" type="text" name="Descripcion" value={formData.Descripcion} onChange={handleInputChange} required />
                                </div>
                                
                            
                            <div className=" flex content-end justify-around items-center  w-full h-20">
                                <button className="h-11 w-44 my-5 mx-2 flex items-center justify-center rounded-sm bg-yellow-500 p-1  text-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" type="submit">{isEditing ? 'Actualizar Servicio' : 'Agregar Servicio'}</button>
                                <button className="h-11 w-44 my-5 mx-2 flex items-center justify-center rounded-sm bg-yellow-500 p-1  text-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" type="button" onClick={() => setIsModalOpen(false)}>Cerrar</button>
                            </div>
                            
                            
                        </form>
            </Modal>       
        


  </div>   
      
      </div>
      </div>
  
  );
}
export default Servicios;