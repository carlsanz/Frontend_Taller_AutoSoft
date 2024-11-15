import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { TrashIcon, ArrowPathIcon, PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
Modal.setAppElement('#root'); 


const Clientes = () => {
    const [identidad, setIdentidad] = useState('');
    const [cliente, setCliente] = useState(null);
    const [clientes, setClientes] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isAddingMode, setIsAddingMode] = useState(false);
    const [departamentos, setDepartamentos] = useState([]);
    const [formData, setFormData] = useState({
        Identidad: '',
        Id_departamento: '',
        P_nombre: '',
        S_nombre: '',
        P_apellido: '',
        S_apellido: '',
        Direccion: '',
        Telefono: '',
        Fecha_nac: '',
        correo: '',
        Genero: 'Femenino', // Valor por defecto
    });
    const role = localStorage.getItem('role');

    //obtener las colonias al cargar componentes
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

// para la busqueda de los clientes mediante identidad
const handleSearch = async () => {
    try {
        const response = await axios.get(`http://localhost:5000/api/clientes/${identidad}`);
        let clienteData = response.data;
        if (clienteData.Fecha_nac) {
            clienteData.Fecha_nac = new Date(clienteData.Fecha_nac).toISOString().split('T')[0];
        }
        setCliente(response.data);
        setFormData(response.data);  // Cargar datos en el formulario
        setIsModalOpen(true);  // Abrir modal
        setIsEditMode(false);  // No edición al buscar
        setIsAddingMode(false);  // No agregar
    } catch (error) {
        alert('Cliente no encontrado');
        setCliente(null);
    }
};
//para agregar los nuevos clientes
    const handleAdd = () => {
        setIsModalOpen(true);
        setIsEditMode(false);
        setIsAddingMode(true); // Activar modo agregar
        setFormData({
            Identidad: '',
            Id_departamento: '',
            P_nombre: '',
            S_nombre: '',
            P_apellido: '',
            S_apellido: '',
            Direccion: '',
            Telefono: '',
            Fecha_nac: '',
            correo: '',
            Genero: 'Femenino',
        }); // Limpiar el formulario
    };
    // para manejo de la actualizacion de los clientes
    const handleEdit = () => {
        setIsEditMode(true); // Habilitar el modo edición
    };
    // para manejo de la eliminacion de los clientes
    const handleDelete = async () => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
            try {
                await axios.delete(`http://localhost:5000/api/clientes/${formData.Identidad}`);
                alert('Cliente eliminado');
                setCliente(null);
                setIdentidad('');
                setIsModalOpen(false);  // Cerrar modal al eliminar
            } catch (error) {
                alert('Error al eliminar el cliente');
            }
        }
    };
    // manejo de los cambios en los inputs del formulario
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();  // Evitar recarga de la página
    
        try {
            if (isAddingMode) {
                // Si estamos en modo de agregar, hacer POST
                await axios.post('http://localhost:5000/api/clientes', formData);
                alert('Cliente agregado exitosamente');
            } else if (isEditMode) {
                // Si estamos en modo de edición, hacer PUT para actualizar
                await axios.put(`http://localhost:5000/api/clientes/${formData.Identidad}`, formData);
                alert('Cliente actualizado exitosamente');
            }
            // Cerrar modal y limpiar estado
            setIsModalOpen(false);
            setCliente(null);
            setIdentidad('');  // Limpiar campo de identidad
        } catch (error) {
            alert('Error al agregar o actualizar el cliente');
            console.error(error);
        }
    };


    

// Obtener clientes al cargar el componente
useEffect(() => {
    const fetchClientes = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/todos');
            setClientes(response.data);  // Llenar el estado con los datos de clientes
        } catch (error) {
            console.error('Error al obtener los clientes', error);
        }
    };

    fetchClientes();
}, []);



    return (
        <div 
        style={{ width: '100vw', overflowX: 'hidden', backgroundImage: 'url(/image/vehiculo.jpg)', backgroundSize: 'cover', backgroundPosition: ' top' }} 
        className="-z-10 absolute  p-32 bg-red-300 flex flex-col h-screen justify-center" >
      <div className="flex h-auto justify-center min-w-full">
      <input
                className="w-3/5 my-5 rounded-md border-0 py-1.5  text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-950 sm:text-sm/6"
                type="text"
                placeholder="Buscar por número de identidad"
                value={identidad}
                onChange={(e) => setIdentidad(e.target.value)}
            />
            <button className=" w-11 h-11  my-5 mx-2 flex items-center justify-center rounded-md bg-yellow-500 p-1  text-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" onClick={handleSearch}>
            <MagnifyingGlassIcon aria-hidden="true" className="h-6 w-6" />
            </button>
            <button className=" w-11 h-11  my-5 mx-2 flex items-center justify-center rounded-md bg-yellow-500 p-1  text-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" onClick={handleAdd} disabled={role !== 'Administrador' && !cliente}>
            <PlusIcon className="h-6 w-6" />
            </button>    
     </div>
     <div className="w-auto min-h-full flex col-start-1 justify-center  text-black">
     <table className="table-row-group justify-center bg-white  rounded-none m-0 p-0 mt-0 pt-0 ">
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
    {clientes.length === 0 ? (
        <tr>
            <td colSpan="5">No hay clientes registrados</td>
        </tr>
    ) : (
        clientes.map((cliente) => (
            <tr key={cliente.Identidad}>
                <td className="border-b-2 border-zinc-600  text-left px-14 ">{cliente.Identidad}</td>
                <td className="border-b-2 border-zinc-600  text-left px-14 ">{cliente.P_nombre} {cliente.S_nombre}</td>
                <td className="border-b-2 border-zinc-600  text-left px-14 ">{cliente.P_apellido} {cliente.S_apellido}</td>
                <td className="border-b-2 border-zinc-600  text-left px-14 ">{cliente.Genero}</td>
                <td className="border-b-2 border-zinc-600  text-left px-14 ">{cliente.Direccion}</td>
                <td className="border-b-2 border-zinc-600  text-left px-14 ">
                                <button  className=" w-7 h-7 m-2 flex items-center justify-center rounded-md bg-green-600 p-1  text-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" onClick={() => handleEdit(cliente)}>
                                    <ArrowPathIcon aria-hidden="true" className="h-6 w-6" />
                                </button>
                                <button className=" w-7 h-7  m-2 flex items-center justify-center rounded-md bg-red-500 p-1  text-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" onClick={() => handleDelete(cliente.Identidad)}>
                                    <TrashIcon aria-hidden="true" className="h-6 w-6"  />
                                </button>
                            </td>
            </tr>
        ))
    )}
</tbody>
</table>
<Modal style={{content:{backgroundColor:"white"},overlay:{backgroundColor:"rgba(0, 0, 0, 0.80)"}}} className=" h-auto w-screen absolute left-40 p-5 rounded-lg max-w-screen-lg mx-auto my-8" isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)}>

    <form className="flex flex-col justify-between text-center h-full " onSubmit={handleSubmit}>
    <h2>{isAddingMode ? 'Agregar Cliente' : 'Detalles del Cliente'}</h2>
    <div style={{height:"28rem", width:"auto"}} className="flex flex-row justify-between p-6 ">
    <div style={{height:"28rem"}} className="flex flex-col justify-between p-5 ">
            <label>Identidad</label>
            <input
                className="h-12 block font-medium my-2 text-gray-900"
                type="text"
                name="Identidad"
                value={formData.Identidad}
                onChange={handleInputChange}
                readOnly={!isEditMode && !isAddingMode} // Solo editable si estamos en modo edición
            />

            <label>Primer Nombre</label>
            <input
                className="h-12 block font-medium my-2 text-gray-900"
                type="text"
                name="P_nombre"
                value={formData.P_nombre}
                onChange={handleInputChange}
                readOnly={!isEditMode && !isAddingMode}
            />

            <label>Segundo Nombre</label>
            <input
                className="h-12 block font-medium my-2 text-gray-900"
                type="text"
                name="S_nombre"
                value={formData.S_nombre}
                onChange={handleInputChange}
                readOnly={!isEditMode && !isAddingMode}
            />

            <label>Primer Apellido</label>
            <input
                className="h-12 block font-medium my-2 text-gray-900"
                type="text"
                name="P_apellido"
                value={formData.P_apellido}
                onChange={handleInputChange}
                readOnly={!isEditMode && !isAddingMode}
            />

            <label>Segundo Apellido</label>
            <input
                className="h-12 block font-medium my-2 text-gray-900"
                type="text"
                name="S_apellido"
                value={formData.S_apellido}
                onChange={handleInputChange}
                readOnly={!isEditMode && !isAddingMode}
            />
            </div>
            <div style={{height:"28rem"}} className="flex flex-col justify-between p-5 ">
             <label>Teléfono</label>
            <input
                className="h-12 block font-medium my-2 text-gray-900"
                type="text"
                name="Telefono"
                value={formData.Telefono}
                onChange={handleInputChange}
                readOnly={!isEditMode && !isAddingMode}
            />
             <label>Correo</label>
            <input
                className="h-12 block font-medium my-2 text-gray-900"
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleInputChange}
                readOnly={!isEditMode && !isAddingMode}
            />
             <label>Fecha de Nacimiento</label>
            <input
                className="h-12 block font-medium my-2 text-gray-900"
                type="date"
                name="Fecha_nac"
                value={formData.Fecha_nac}
                onChange={handleInputChange}
                readOnly={!isEditMode && !isAddingMode}
            />

            <label>Género</label>
            <select
                className="h-12 block font-medium my-2 text-gray-900"
                name="Genero"
                value={formData.Genero}
                onChange={handleInputChange}
                disabled={!isEditMode && !isAddingMode}
            >
                <option value="Femenino">Femenino</option>
                <option value="Masculino">Masculino</option>
            </select>
            </div>
            <div style={{height:"28rem"}} className="flex flex-col justify-between p-5 ">
            <label>Departamento</label>
            <select
                className="h-12 block font-medium my-2 text-gray-900"
                name="Id_departamento"
                value={formData.Id_departamento}
                onChange={handleInputChange}
                disabled={!isEditMode && !isAddingMode}
            >
                <option value="">--Selecciona un departamento--</option>
                {departamentos.map((departamentos) => (
                    <option key={departamentos.Id_departamento} value={departamentos.Id_departamento}>
                        {departamentos.Nombre}
                    </option>
                ))}
            </select>

            <label>Dirección</label>
            <textarea className="h-80 block font-medium my-3 text-gray-900"
                type="text"
                name="Direccion"
                value={formData.Direccion}
                onChange={handleInputChange}
                readOnly={!isEditMode && !isAddingMode}
            />

             </div>
             
        </div>
        <div className=" flex content-end justify-around items-center  w-full h-20" >
        {isAddingMode ? (
                            <>
        <button className="h-11 w-44 my-5 mx-2 flex items-center justify-center rounded-sm bg-yellow-500 p-1  text-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" type="button" onClick={() => setIsModalOpen(false)}>
            Cancelar
        </button>
        <button className="h-11 w-44 my-5 mx-2 flex items-center justify-center rounded-sm bg-yellow-500 p-1  text-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" type="submit">Aceptar</button>  {/* Llama a handleSubmit en agregar */}
                            </>
                        ) : (
                            <>
        <button className="h-11 w-44 my-5 mx-2 flex items-center justify-center rounded-sm bg-yellow-500 p-1  text-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" type="submit">Aceptar</button>  {/* Llama a handleSubmit en editar */}
        {role === 'Administrador' && (
            <>
                <button className="h-11 w-44 my-5 mx-2 flex items-center justify-center rounded-sm bg-yellow-500 p-1  text-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" type="button" onClick={handleEdit} disabled={!cliente}>
                    Actualizar
                </button>
                <button className="h-11 w-44 my-5 mx-2 flex items-center justify-center rounded-sm bg-yellow-500 p-1  text-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" type="button" onClick={handleDelete} disabled={!cliente}>
                    Eliminar
                </button>
                                    </>
                                )}
                            </>
                        )}
            </div>
        
                
        </form>
            </Modal>
     </div>
      </div>

    );
};

export default Clientes;
