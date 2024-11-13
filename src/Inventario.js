
import { PlusIcon, TrashIcon, ArrowPathIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

Modal.setAppElement('#root'); 



const Inventario = ({ rolUsuario }) => {

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
        <div 
        style={{ width: '100vw', overflowX: 'hidden', backgroundImage: 'url(/image/vehiculo.jpg)', backgroundSize: 'cover', backgroundPosition: ' top' }} 
        className="absolute  p-32 pb-0 bg-red-300 flex flex-col h-screen justify-center" >


      <div className="flex h-auto justify-center min-w-full">
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

        <div className="w-auto min-h-full flex col-start-1 justify-center  text-black">
      <table className="table-row-group justify-center bg-white rounded-none m-0 p-0 mt-0 pt-0 ">
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
      
    );
};

export default Inventario;
