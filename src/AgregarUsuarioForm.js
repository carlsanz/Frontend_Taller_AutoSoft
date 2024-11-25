import { TrashIcon, ArrowPathIcon, PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal'; 
Modal.setAppElement('#root'); 

const AgregarUsuario = () => {
    const [empleados, setEmpleados] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [departamentos, setDepartamentos] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [identidadABuscar, setIdentidadABuscar] = useState('');
    const [formData, setFormData] = useState({
        Nombre: '',
        Email: '', // Este es el único campo de correo
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
        <div 
        style={{ width: '100vw', overflowX: 'hidden', backgroundImage: 'url(/image/vehiculo.jpg)', backgroundSize: 'cover', backgroundPosition: ' top' }} 
        className="-z-10 absolute p-32 pb-0  flex flex-col h-screen justify-center" >
     
      <form className="flex h-auto justify-center min-w-full" onSubmit={handleBuscarUsuario}>
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
               <button className=" w-11 h-11  my-5 mx-2 flex items-center justify-center rounded-md bg-yellow-500 p-1  text-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"  onClick={() => {resetForm(); setIsModalOpen(true); }}>
                  <PlusIcon aria-hidden="true" className="h-6 w-6" />
                </button>
        </form>

        <div className="w-full min-h-full flex col-start-1 justify-center  text-black mt-5">
        <div className="overflow-y-auto bg-white max-h-96 w-full">
            <table className="min-w-full w-full divide-y divide-gray-200">
                <thead>
                    <tr className=" bg-zinc-600 h-8 rounded-none m-0 p-0">
                        <th className="text-center text-white m-12 px-4 py-2">Identidad</th>
                        <th className="text-center text-white m-12 px-4 py-2">Nombre</th>
                        <th className="text-center text-white m-12 px-4 py-2">Apellido</th>
                        <th className="text-center text-white m-12 px-4 py-2">Genero</th>
                        <th className="text-center text-white m-12 px-4 py-2">Direccion</th>
                        <th className="text-center text-white m-12 px-4 py-2"></th>
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
                                <td className="border-b-2 border-zinc-600  text-center px-4 py-2" >{empleado.Identidad}</td>
                                <td className="border-b-2 border-zinc-600  text-center px-4 py-2" >{empleado.Nombre}</td>
                                <td className="border-b-2 border-zinc-600  text-center px-4 py-2" >{empleado.Apellido}</td>
                                <td className="border-b-2 border-zinc-600  text-center px-4 py-2" >{empleado.Genero}</td>
                                <td className="border-b-2 border-zinc-600  text-center px-4 py-2" >{empleado.Direccion}</td>
                                <td className="border-b-2 border-zinc-600  text-center px-4 py-2">
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
        </div>
        </div>

            <Modal style={{content:{backgroundColor:"white"},overlay:{backgroundColor:"rgba(0, 0, 0, 0.80)"}}} className=" h-auto w-screen absolute left-10 top-11 p-5 px-10 rounded-lg max-w-screen-xl mx-auto my-8" isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)}>
             <form className="flex flex-col justify-between text-center h-full " onSubmit={handleSubmit}>
             <h2>{isEditMode ? 'Actualizar Usuario' : 'Formulario de Registro'}</h2>

                <div style={{height:"25rem", width:"auto"}} className="flex flex-row justify-between p-6 ">
                  <div style={{height:"23rem"}} className="flex flex-col justify-between p-5 ">
                                <input className="h-12 block font-medium my-2 text-gray-900"  type="text" placeholder='Identidad' name="Identidad" value={formData.Identidad} onChange={handleInputChange} required />
                                <input className="h-12 block font-medium my-2 text-gray-900"   type="text" placeholder='Primer nombre'  name="P_nombre" value={formData.P_nombre} onChange={handleInputChange} required />
                                <input className="h-12 block font-medium my-2 text-gray-900"   type="text" placeholder='Segundo nombre'  name="S_nombre" value={formData.S_nombre} onChange={handleInputChange} />
                                <input className="h-12 block font-medium my-2 text-gray-900"   type="text" placeholder='Primer apellido'  name="P_apellido" value={formData.P_apellido} onChange={handleInputChange} required />
                                <input className="h-12 block font-medium my-2 text-gray-900"   type="text" placeholder='Segundo apellido'  name="S_apellido" value={formData.S_apellido} onChange={handleInputChange} />
                                <select
                                className="h-12 block font-medium my-2 text-gray-900"
                                name="Genero"
                                value={formData.Genero}
                                onChange={handleInputChange}
                            >
                                <option value="" disabled>Genero</option>
                                <option value="Femenino">Femenino</option>
                                <option value="Masculino">Masculino</option>
                            </select>
                        
                  </div>
                <div style={{height:"23rem"}} className="flex flex-col justify-between p-5 ">
                               
                                <select
                                className="h-12 block font-medium my-2 text-gray-900"
                                name="Id_departamento"
                                value={formData.Id_departamento}
                                onChange={handleInputChange}
                                //disabled={!isEditMode}
                            >
                            <option value="">Seleccione su departamento</option>
                                {departamentos.map((departamento) => (
                                    <option key={departamento.Id_departamento} value={departamento.Id_departamento}>
                                    {departamento.Nombre}
                                    </option>
                                ))}
                            </select>
                            <textarea  className="h-36 block font-medium my-2 text-gray-900"  type="text" placeholder='Ingrese la direccion del empleado' name="Direccion" value={formData.Direccion} onChange={handleInputChange} />
                             <input className="h-12 block font-medium my-2 text-gray-900"  type="text" placeholder='Telefono' name="Telefono" value={formData.Telefono} onChange={handleInputChange} />

                            <input            
                                className="h-12 block font-medium my-2 text-gray-900" 
                                type="date" 
                                placeholder='Fecha de nacimiento' 
                                name="Fecha_nac" 
                                value={formData.Fecha_nac} 
                                onChange={handleInputChange} 
                                required 
                            />
                    </div>
                    <div style={{height:"23rem"}} className="flex flex-col justify-between p-5 ">
                            <h3>Datos de Usuario</h3>
                                    <input className="h-12 block font-medium my-2 text-gray-900" type="text" placeholder='Nombre de usuario'  name="Nombre" value={formData.Nombre} onChange={handleInputChange} required />
                                    <input className="h-12 block font-medium my-2 text-gray-900" type="email" placeholder='Correo electrónico'  name="Email" value={formData.Email} onChange={handleInputChange} required />
                                    <input className="h-12 block font-medium my-2 text-gray-900" type="text" placeholder='Rol'  name="Rol" value={formData.Rol} onChange={handleInputChange} required />
                            <div className='flex flex-col justify-center items-center'>
                            <label> Primer inicio de sesión:</label>
                            <input
                                className="h-5 w-5 block font-medium my-2 text-gray-900"
                                type="checkbox"
                                name='Primer_ingreso'
                                value={formData.Primer_ingreso}
                                
                            />
                            </div>
                    </div>
                

                            {/* Campos de Empleados */}
                    <div style={{height:"23rem"}} className="flex flex-col justify-start p-5 ">
                            <h3>Datos de Empleado</h3>
                            <input className="h-12 block font-medium my-2 text-gray-900"  placeholder='Ocupación'  type="text" name="Ocupacion" value={formData.Ocupacion} onChange={handleInputChange} required />

                            <input className="h-12 block font-medium my-2 text-gray-900"  placeholder='Salario'  type="number" name="Salario" value={formData.Salario} onChange={handleInputChange} required />

                           <input className="h-12 block font-medium my-2 text-gray-900"           
                                type="date" 
                                placeholder='Fecha de contratacion' 
                                name="Fecha_contratacion" 
                                value={formData.Fecha_contratacion} 
                                onChange={handleInputChange} 
                                required 
                            />
                        </div>
                        </div>
                        <div className=" flex content-end justify-evenly items-center  pt-8 w-full h-20" >
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
    
    );
};

export default AgregarUsuario;