import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { TrashIcon, ArrowPathIcon, Bars3Icon, BellIcon, XMarkIcon, PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import React, {useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal'; // Asegúrate de tener react-modal instalado
import { useNavigate } from 'react-router-dom';
import logo from './styles/pictures/logo.PNG';
import { Link } from 'react-router-dom';
Modal.setAppElement('#root'); // Cambia '#root' por el ID de tu elemento raíz



const AgregarUsuario = () => {
    const navigation = [
        { name: 'Home', ruta: "/Home", current: true },
        { name: 'Servicios', ruta: "/servicios", current: false },
        { name: 'Inventario', ruta: "/inventario", current: false },
        { name: 'Repuestos', ruta: "/repuestos", current: false },
        { name: 'Empleados', ruta: "/agregar-usuario", current: false },
        { name: 'Autos', ruta: "/autos", current: false },
        { name: 'Clientes', ruta: "/clientes", current: false },
      ]
      
      function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
      }
    const navigate = useNavigate();
    const [empleados, setEmpleados] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [departamentos, setDepartamentos] = useState([]);
    const [formData, setFormData] = useState({
        Nombre: '',
        Email: '', // Este es el único campo de correo
        Contraseña: '',
        Rol: '',
        Identidad: '',
        Id_departamento: '',
        P_nombre: '',
        S_nombre: '',
        P_apellido: '',
        S_apellido: '',
        Direccion: '',
        Telefono: '',
        Fecha_nac: '',
        Genero: '',
        Ocupacion: '',
        Salario: '',
        Fecha_contratacion: '',
        Primer_ingreso:''
    });
    const [isEditMode, setIsEditMode] = useState(false);
    const [identidadABuscar, setIdentidadABuscar] = useState('');

    //obetener los departamentos
    useEffect(()=>{
        const fetchDepartamentos = async ()=> {
            try {
                const response = await axios.get('http://localhost:5000/api/departamentos');
                setDepartamentos(response.data);
                } catch (error) {
                    console.error('Error al obtener los departamentos', error);
        }
};
fetchDepartamentos();
}, []);

//manejo de fechas 
const formatDate = (dateString) => {
    if (!dateString) return ''; // Verifica si la fecha es nula o vacía
    const date = new Date(dateString); // Convierte la cadena en un objeto Date
    const day = String(date.getUTCDate()).padStart(2, '0'); // Ajustar para obtener el día correcto
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Ajustar mes
    const year = date.getUTCFullYear();
    return `${year}-${month}-${day}`; // Retornar en formato yyyy-mm-dd para que el input date lo entienda
};


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

//buscar usuarios 
const handleBuscarUsuario = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.get(`http://localhost:5000/usuarios-completo/empleados/${identidadABuscar}`);
        
        // Aplicamos el formato a las fechas antes de actualizar el estado
        const usuario = response.data;
        usuario.Fecha_nac = formatDate(usuario.Fecha_nac);
        usuario.Fecha_contratacion = formatDate(usuario.Fecha_contratacion);
        
        setFormData(usuario);
        setIsEditMode(true);
        setIsModalOpen(true);
    } catch (error) {
        console.error('Error al buscar usuario:', error);
        alert('Usuario no encontrado.');
    }
};

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const method = isEditMode ? 'PUT' : 'POST';
        const url = isEditMode ? `http://localhost:5000/usuarios-completo/${formData.Identidad}` : 'http://localhost:5000/usuarios-completo';
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error al guardar usuario:', errorData);
            throw new Error('Error al guardar usuario');
        }

        alert(isEditMode ? 'Usuario actualizado exitosamente' : 'Datos agregados exitosamente');
        setIsModalOpen(false);
        resetForm();
    } catch (error) {
        alert('Error al guardar los datos');
        console.error('Error:', error);
    }
};

// eliminar usuario
const handleEliminarUsuario = async () => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
        return;
    }
    try {
        const response = await axios.delete(`http://localhost:5000/usuarios-completo/${formData.Identidad }/${formData.Email}`);
        if (response.status === 200) {
            alert('Usuario eliminado exitosamente');
            setIsModalOpen(false);
            resetForm();
        } else {
            alert('Error al eliminar el usuario');
        }
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        alert('Error al eliminar el usuario');
    }
};

const resetForm = () => {
    setFormData({
        Nombre: '',
        Email: '',
        Contraseña: '',
        Rol: '',
        Primer_ingreso:'',
        Identidad: '',
        Id_departamento: '',
        P_nombre: '',
        S_nombre: '',
        P_apellido: '',
        S_apellido: '',
        Direccion: '',
        Telefono: '',
        Fecha_nac: '',
        Genero: '',
        Ocupacion: '',
        Salario: '',
        Fecha_contratacion: ''
    });
    setIsEditMode(false);
};

useEffect(() => {
    // Llamada al backend para obtener los datos de los empleados
    fetch('http://localhost:5000/usuarios-completo/empleados')  // Cambia el puerto y la ruta si es necesario
        .then((response) => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            return response.json();
        })
        .then((data) => setEmpleados(data))
        .catch((error) => console.error('Error al obtener empleados:', error));
}, []);


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
      <form className="fixed top-20 flex justify-center min-w-full " onSubmit={handleBuscarUsuario}>
                <input
                    className="w-3/5 my-5 rounded-md border-0 py-1.5  text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-950 sm:text-sm/6"
                    type="text"
                    placeholder="Buscar por Identidad"
                    value={identidadABuscar}
                    onChange={(e) => setIdentidadABuscar(e.target.value)}
                    required
                    />
               <button className=" w-11 h-11  my-5 mx-2 flex items-center justify-center rounded-md bg-yellow-500 p-1  text-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" type="submit" >
                 <MagnifyingGlassIcon aria-hidden="true" className="h-6 w-6" />
                </button>
               <button className=" w-11 h-11  my-5 mx-2 flex items-center justify-center rounded-md bg-yellow-500 p-1  text-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"  onClick={() => { setIsModalOpen(true); resetForm(); }}>
                  <PlusIcon aria-hidden="true" className="h-6 w-6" />
                </button>
        </form>

        <div className="fixed top-40 w-auto min-h-full flex col-start-1 justify-center bg-white text-black">
        <table className="table-row-group justify-center w-full rounded-none m-0 p-0 mt-0 pt-0 ">
            <thead>
                <tr className=" bg-zinc-600 h-8 rounded-none m-0 p-0">
                    <th className="text-center text-white m-12 p-2">Identidad</th>
                    <th className="text-center text-white m-12 p-2">Nombre</th>
                    <th className="text-center text-white m-12 p-2">Apellido</th>
                    <th className="text-center text-white m-12 p-2">Genero</th>
                    <th className="text-center text-white m-12 p-2">Direccion</th>
                    <th className="text-center text-white m-12 p-2"></th>
                </tr>
            </thead>
            <tbody>
                {empleados.length === 0 ? (
                    <tr>
                        <td colSpan="5">No hay empleados registrados</td>
                    </tr>
                ) : (
                    empleados.map((empleado) => (
                        <tr key={empleado.Identidad}>
                            <td className="border-b-2 border-zinc-600  text-left px-8" >{empleado.Identidad}</td>
                            <td className="border-b-2 border-zinc-600  text-left px-8" >{empleado.Nombre}</td>
                            <td className="border-b-2 border-zinc-600  text-left px-8" >{empleado.Apellido}</td>
                            <td className="border-b-2 border-zinc-600  text-left px-8" >{empleado.Genero}</td>
                            <td className="border-b-2 border-zinc-600  text-left px-8" >{empleado.Direccion}</td>
                            <td className="border-b-2 border-zinc-600  text-left px-8 ">
                                <button  className=" w-7 h-7 m-2 flex items-center justify-center rounded-md bg-green-600 p-1  text-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" >
                                    <ArrowPathIcon aria-hidden="true" className="h-6 w-6" />
                                </button>
                                <button className=" w-7 h-7  m-2 flex items-center justify-center rounded-md bg-red-500 p-1  text-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" >
                                    <TrashIcon aria-hidden="true" className="h-6 w-6"  />
                                </button>
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>

            <Modal style={{content:{backgroundColor:"white"},overlay:{backgroundColor:"rgba(0, 0, 0, 0.80)"}}} className=" h-auto w-screen absolute left-10 p-5 rounded-lg max-w-screen-xl mx-auto my-8" isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)}>
             <form className="flex flex-col justify-between text-center h-full " onSubmit={handleSubmit}>
             <h2>{isEditMode ? 'Actualizar Usuario' : 'Formulario de Registro'}</h2>

                <div style={{height:"28rem", width:"auto"}} className="flex flex-row justify-between p-6 ">
                  <div style={{height:"28rem"}} className="flex flex-col justify-between p-5 ">
                           <h3>Datos personales</h3>
                            <label>Identidad</label>
                            <input className='form-input' type="text" name="Identidad" value={formData.Identidad} onChange={handleInputChange} required />

                            <label>Primer Nombre</label>
                            <input className='form-input'  type="text" name="P_nombre" value={formData.P_nombre} onChange={handleInputChange} required />

                            <label>Segundo Nombre</label>
                            <input className='form-input'  type="text" name="S_nombre" value={formData.S_nombre} onChange={handleInputChange} />

                            <label>Primer Apellido</label>
                            <input className='form-input'  type="text" name="P_apellido" value={formData.P_apellido} onChange={handleInputChange} required />

                            <label>Segundo Apellido</label>
                            <input className='form-input'  type="text" name="S_apellido" value={formData.S_apellido} onChange={handleInputChange} />
                  </div>

                <div style={{height:"28rem"}} className="flex flex-col justify-between p-5 ">
                            <label>Dirección</label>
                            <input className='form-input'  type="text" name="Direccion" value={formData.Direccion} onChange={handleInputChange} />
                             
                            <label>Departamento</label>
                            <select
                                className='form-input'
                                name="Id_departamento"
                                value={formData.Id_departamento}
                                onChange={handleInputChange}
                                //disabled={!isEditMode}
                            >
                            <option value="">--Selecciona un departamento--</option>
                                {departamentos.map((departamento) => (
                                    <option key={departamento.Id_departamento} value={departamento.Id_departamento}>
                                    {departamento.Nombre}
                                    </option>
                                ))}
                            </select>
                            <label>Teléfono</label>
                            <input className='form-input'  type="text" name="Telefono" value={formData.Telefono} onChange={handleInputChange} />

                            <label>Fecha de Nacimiento</label>
                            <input 
                                className='form-input' 
                                type="date" 
                                name="Fecha_nac" 
                                value={formData.Fecha_nac} 
                                onChange={handleInputChange} 
                                required 
                            />
                            <label>Género</label>
                            <input className='form-input'  type="text" name="Genero" value={formData.Genero} onChange={handleInputChange} required />
                    </div>
                    <div style={{height:"28rem"}} className="flex flex-col justify-between p-5 ">
                            <h3>Datos de Usuario</h3>
                            <label>Nombre</label>
                            <input className='form-input' type="text" name="Nombre" value={formData.Nombre} onChange={handleInputChange} required />

                            <label>Email</label>
                            <input className='form-input' type="email" name="Email" value={formData.Email} onChange={handleInputChange} required />

                            <label>Contraseña</label>
                            <input className='form-input' type="password" name="Contraseña" value={formData.Contraseña} onChange={handleInputChange} required />

                            <label>Rol</label>
                            <input className='form-input' type="text" name="Rol" value={formData.Rol} onChange={handleInputChange} required />

                            <label> Primer inicio de sesión:</label>
                            <input
                                className='form-input'
                                type="checkbox"
                                name='Primer_ingreso'
                                value={formData.Primer_ingreso}
                                
                            />
                    </div>
                

                            {/* Campos de Empleados */}
                    <div style={{height:"28rem"}} className="flex flex-col justify-between p-5 ">
                            <h3>Datos de Empleado</h3>
                            <label>Ocupación</label>
                            <input className='form-input'  type="text" name="Ocupacion" value={formData.Ocupacion} onChange={handleInputChange} required />

                            <label>Salario</label>
                            <input className='form-input'  type="number" name="Salario" value={formData.Salario} onChange={handleInputChange} required />

                            <label>Fecha de Contratación</label>
                            <input 
                                className='form-input' 
                                type="date" 
                                name="Fecha_contratacion" 
                                value={formData.Fecha_contratacion} 
                                onChange={handleInputChange} 
                                required 
                            />
                        </div>
                        </div>
                        <div className=" flex content-end justify-around items-center  pt-8 w-full h-20" >
                            <button className="h-11 w-44 my-5 mx-2 flex items-center justify-center rounded-sm bg-yellow-500 p-1 text-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" type="submit">{isEditMode ? 'Actualizar' : 'Guardar'}</button>
                            {isEditMode && (
                                <button className="h-11 w-44 my-5 mx-2 flex items-center justify-center rounded-sm bg-yellow-500 p-1 text-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" type="button" onClick={handleEliminarUsuario} style={{ backgroundColor: 'red', color: 'white' }}>
                                    Eliminar
                                </button>
                            )}
                            <button className="h-11 w-44 my-5 mx-2 flex items-center justify-center rounded-sm bg-yellow-500 p-1 text-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" type="button" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                    </div>
                
                </form>
            </Modal>
        </div>
        </div>
     </div>
    );
};

export default AgregarUsuario;