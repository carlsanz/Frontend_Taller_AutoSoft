import {TrashIcon, ArrowPathIcon, PlusIcon, MagnifyingGlassIcon,} from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import Mensaje from './Mensaje';

Modal.setAppElement("#root");

  
  const Servicios = ({ rolUsuario }) => {
    const [servicios, setServicios] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedServiceId, setSelectedServiceId] = useState(null);
    const [formData, setFormData] = useState({
      Nombre: "",
      Descripcion: "",
      Precio: "",
      Tipo_servicio: "",
    });
  
    console.log(localStorage.getItem("role")); // Verficar rol

    const [mensaje, setMensaje] = useState(''); // Mensaje a mostrar
    const [tipoMensaje, setTipoMensaje] = useState(''); // Tipo de mensaje

    const mostrarMensaje = (msg, tipo) => {
    setMensaje(msg);
    setTipoMensaje(tipo);
    };
  
    //FUNCIONES DEL CRUD
  
    useEffect(() => {
      const obtenerServicios = async () => {
        try {
          const response = await fetch(
            "http://localhost:5000/api/servicios/obtener"
          );
          if (!response.ok) {
            throw new Error("Error al obtener los servicios");
          }
          const data = await response.json();
          console.log("Servicios obtenidos:", data);
          setServicios(data);
        } catch (error) {
          console.error("Error al obtener los servicios:", error);
        }
      };
  
      obtenerServicios();
    }, []);
  
    const handleDelete = async (Id_servicio) => {
      if (!window.confirm("¿Estás seguro de que quieres borrar este servicio?")) {
        return;
      }
      try {
        const response = await fetch(
          `http://localhost:5000/api/servicios/eliminar/${Id_servicio}`,
          {
            method: "DELETE",
          }
        );
  
        if (!response.ok) {
          throw new Error("Error al borrar el servicio");
        }
  
        setServicios(servicios.filter((servicio) => servicio.Id_servicio !== Id_servicio));
        mostrarMensaje('Servicio borrado exitosamente', 'success');
      } catch (error) {
        console.error("Error al borrar el servicio:", error);
        mostrarMensaje('Hubo un error al borrar el servicio', 'error');
      }
    };
  
    const handleEdit = (servicio) => {
      setIsEditing(true);
      setSelectedServiceId(servicio.Id_servicio);
      setFormData({
        Nombre: servicio.Nombre,
        Descripcion: servicio.Descripcion,
        Precio: servicio.Precio,
        Tipo_servicio: servicio.Tipo_servicio,
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
          const response = await fetch(
            `http://localhost:5000/api/servicios/actualizar/${selectedServiceId}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(formData),
            }
          );
  
          if (!response.ok) {
            throw new Error("Error al actualizar el servicio");
          }
  
          const servicioActualizado = await response.json();
          setServicios(
            servicios.map((servicio) =>
              servicio.Id_servicio === selectedServiceId
                ? servicioActualizado
                : servicio
            )
          );
  
          mostrarMensaje('Servicio actualizado exitosamente', 'success');
        } catch (error) {
          console.error("Error al actualizar el servicio:", error);
          mostrarMensaje('Hubo un error al actualizar el servicio','error');
        }
      } else {
        try {
          const response = await fetch(
            "http://localhost:5000/api/servicios/agregar",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(formData),
            }
          );
  
          if (!response.ok) {
            throw new Error("Error al agregar el servicio");
          }
  
          const nuevoServicio = await response.json();
          setServicios([...servicios, nuevoServicio]);
  
          mostrarMensaje('Servicio agregado exitosamente', 'success');
        } catch (error) {
          console.error("Error al agregar el servicio:", error);
          mostrarMensaje('Hubo un error al agregar el servicio', 'error');
        }
      }
  
      setIsModalOpen(false);
      setIsEditing(false);
      setSelectedServiceId(null);
      setFormData({
        Nombre: "",
        Descripcion: "",
        Precio: "",
        Tipo_servicio: "",
      });
    };
  
    return (<div 
      style={{ width: '100vw', overflowX: 'hidden', overflowY: 'hidden', backgroundImage: 'url(/image/vehiculo.jpg)', backgroundSize: 'cover', backgroundPosition: ' top' }} 
      className="-z-10 absolute pt-32 pb-20 px-9 flex flex-col h-screen justify-center"  >
    <div className="flex h-auto justify-center min-w-full">
        <Mensaje
            mensaje={mensaje}
            tipo={tipoMensaje}
            onClose={() => setMensaje(null)} // Cierra el mensaje
          />
          <input
            id="buscar-home"
            name="Buscar-cliente"
            type="text"
            placeholder="Busca un servicio"
            className="w-3/5 my-5 rounded-md border-0 py-1.5  text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-950 sm:text-sm/6"
          />
  
          <button
            type="button"
            className=" w-11 h-11  my-5 mx-2 flex items-center justify-center rounded-md bg-yellow-500 p-1  text-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            <MagnifyingGlassIcon className="h-6 w-6" />
          </button>
  
        
            <button
              onClick={() => {
                setIsEditing(false);
                setIsModalOpen(true);
              }}
              type="button"
              className=" w-11 h-11 my-5 mx-2 flex items-center justify-center  rounded-md bg-yellow-500  p-1 text-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              <PlusIcon className="h-6 w-6" />
            </button>
        
        </div>
  
        <div className="w-full min-h-full flex col-start-1 justify-center  text-black mt-5">
        <div className="overflow-y-auto bg-white max-h-full w-full">
        <table className="min-w-full w-full divide-y divide-gray-200">
          <thead className="sticky top-0">
              <tr className="bg-zinc-600 h-8">
                <th className="text-center text-white p-2">Nombre</th>
                <th className="text-center text-white p-2">Descripción</th>
                <th className="text-center text-white p-2">Precio</th>
                <th className="text-center text-white p-2">Tipo de Servicio</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {servicios.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center p-4">
                    No hay servicios disponibles
                  </td>
                </tr>
              ) : (
                servicios.map((servicio) => (
                  <tr className="border-b-2 text-center border-zinc-400 px-14 " key={servicio.Id_servicio}>
                    <td >
                      {servicio.Nombre}
                    </td>
                    <td >
                      {servicio.Descripcion}
                    </td>
                    <td >
                      {servicio.Precio}
                    </td>
                    <td>
                      {servicio.Tipo_servicio}
                    </td>
                  
                      <td className="flex">
                        <button
                          type="button"
                          onClick={() => handleEdit(servicio)}
                          className="w-7 h-7 m-2 flex items-center justify-center rounded-md bg-green-600 p-1 text-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                        >
                          <ArrowPathIcon aria-hidden="true" className="h-6 w-6" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(servicio.Id_servicio)}
                          className="w-7 h-7 m-2 flex items-center justify-center rounded-md bg-red-500 p-1 text-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                        >
                          <TrashIcon aria-hidden="true" className="h-6 w-6" />
                        </button>
                      </td>
                    
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Modal
          className="p-5 max-w-[90%] sm:max-w-2xl mx-auto bg-white rounded-lg shadow-lg relative 
          top-1/2 sm:top-20 transform -translate-y-1/2 sm:translate-y-0"
          style={{content:{backgroundColor:"white"},overlay:{backgroundColor:"rgba(0, 0, 0, 0.80)"}}} 
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
        >
          <form
            className="flex flex-col justify-between text-center w-full h-full"
            onSubmit={handleSubmit}
          >
            <h2>
              {isEditing
                ? "Detalles del servicio"
                : "Agregar Nuevo Servicio"}
            </h2>
            <div style={{ height: "25rem" }} className="flex flex-col justify-between p-6">
              <input
                className="h-12 block font-medium my-3 text-gray-900"
                type="text"
                name="Nombre"
                placeholder="Nombre del servicio"
                value={formData.Nombre}
                onChange={handleInputChange}
                required
              />
              <input
                className="h-12 block font-medium my-3 text-gray-900"
                type="number"
                name="Precio"
                placeholder="Precio"
                value={formData.Precio}
                onChange={handleInputChange}
                required
              />
              <select
                className="h-12 block font-medium my-3 text-gray-900"
                name="Tipo_servicio"
                placeholder="Tipo de servicio"
                value={formData.Tipo_servicio}
                onChange={handleInputChange}
                required
              >
                <option value="" disabled>
                  Seleccione el tipo de servicio
                </option>
                <option value="Preventivo">Preventivo</option>
                <option value="Correctivo">Correctivo</option>
              </select>
              <textarea
                className="h-80 block font-medium my-3 text-gray-900"
                type="text"
                name="Descripcion"
                placeholder="Ingrese una descripción del servicio"
                value={formData.Descripcion}
                onChange={handleInputChange}
                required
              />
            </div>
  
            <div className="flex content-end justify-around items-center w-full h-20">
              <button
                className="h-11 w-44 my-5 mx-2 flex items-center justify-center rounded-sm bg-yellow-500 p-1 text-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                type="submit"
              >
                {isEditing ? "Actualizar Servicio" : "Agregar Servicio"}
              </button>
              <button
                className="h-11 w-44 my-5 mx-2 flex items-center justify-center rounded-sm bg-yellow-500 p-1 text-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                type="button"
                onClick={() => setIsModalOpen(false)}
              >
                Cerrar
              </button>
            </div>
          </form>
        </Modal>
      </div>
      </div>
    );
  };
  
  export default Servicios;