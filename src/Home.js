import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import {  Popover, PopoverButton, PopoverPanel  } from '@headlessui/react'
import { ChevronDownIcon, PhoneIcon, PlayCircleIcon } from '@heroicons/react/20/solid'
import { ChartPieIcon, CursorArrowRaysIcon,FingerPrintIcon,SquaresPlusIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';


Modal.setAppElement('#root');

const Home = () => {

  const role = localStorage.getItem('role') || '';

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [estadosCitas, setEstadosCitas] = useState([]);
    const [placa, setPlaca] = useState("");  // Estado para almacenar el valor del input de placa
    const [formData, setFormData] = useState({
        Id_cliente: '',
        Id_empleados: '',
        Id_auto: '',
        Fecha_ingreso: '',
        Descripcion: '',
        Id_estado: ''
    });

    useEffect(() => {
        
    }, []);

    


    useEffect(() => {
      const obtenerEstadosCitas = async () => {
        try {
          const response = await axios.get('http://localhost:5000/citas/estados');
          setEstadosCitas(response.data); // Almacenar los estados de citas en el estado
        } catch (error) {
          console.error('Error al obtener estados de citas:', error);
        }
      };
      obtenerEstadosCitas();
    }, []);

   


    
    let searchTimeout = null; // Temporizador global para evitar múltiples solicitudes innecesarias

    const handleAutoSearch = (value) => {
      clearTimeout(searchTimeout); // Cancela cualquier temporizador previo
    
      if (value.length >= 4) { // Solo busca si hay al menos 4 caracteres
        searchTimeout = setTimeout(() => {
          // Endpoint del backend para buscar autos por placa
          fetch(`http://localhost:5000/citas/placa/${value}`)
            .then((response) => {
              if (!response.ok) throw new Error("Automóvil no encontrado"); // Si no encuentra el auto, lanza un error
              return response.json();
            })
            .then((data) => {
              if (data) {
                console.log("Automóvil encontrado:", data);
    
                // Solo actualiza el estado internamente (sin modificar el valor del input)
                setFormData((prevData) => ({
                  ...prevData,
                  Id_auto: data.Id_auto, // Guardamos el ID del auto internamente
                  Id_cliente: data.Id_cliente, // Guardamos el ID del cliente internamente
                }));
    
                // Alerta de éxito al encontrar el automóvil y cliente
                alert(`Auto encontrado: ID Auto = ${data.Id_auto}, ID Cliente = ${data.Id_cliente}`);
              }
            })
            .catch((error) => {
              console.error("Error al buscar el automóvil:", error.message);
              // Solo muestra la alerta si realmente no se encuentra el automóvil
              if (error.message !== "Automóvil no encontrado") {
                alert("Hubo un error al realizar la búsqueda.");
              }
            });
        }, 500); // Espera 500ms después de que el usuario deje de escribir
      }
    };

 

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    

    const handleSubmit = async (e) => {
        e.preventDefault();
        const idEmpleado = localStorage.getItem('idEmpleados');

        // Asegurarse de que el formData tenga siempre el id_empleado
        const finalFormData = {
            ...formData,
            Id_empleados: idEmpleado || "", // Si no existe id_empleado, enviar vacío
        };

        console.log('Datos enviados al backend:', finalFormData); // Verifica los datos


        try {
            const method = isEditMode ? 'PUT' : 'POST';
            const url = isEditMode 
                ? `http://localhost:5000/citas/${formData.Id_cita}`
                : 'http://localhost:5000/citas';

            await axios({
                method,
                url,
                data: finalFormData
            });

            alert(isEditMode ? 'Cita actualizada exitosamente' : 'Cita agregada exitosamente');
            setIsModalOpen(false);
            resetForm();
        } catch (error) {
            console.error('Error al guardar la cita:', error);
            alert('Error al guardar la cita');
        }
    };

    
    const resetForm = () => {
        setFormData({
            Id_cliente: '',
            Id_empleados: '',
            Id_auto: '',
            Fecha_ingreso: '',
            Descripcion: '',
            Id_estado: ''
        });
        setIsEditMode(false);
    };

  const solutions = [
    { name: 'Agregar Cita', description: 'Get a better understanding of your traffic', href: '#', icon: ChartPieIcon },
    { name: 'Reagendar cita', description: 'Speak directly to your customers', href: '#', icon: CursorArrowRaysIcon },
    { name: 'Cancelar cita', description: "Your customers' data will be safe and secure", href: '#', icon: FingerPrintIcon },
    { name: 'Ver todas las citas', description: 'Connect with third-party tools', href: '#', icon: SquaresPlusIcon },
    { name: 'Generar factura', description: 'Build strategic funnels that will convert', href: '#', icon: ArrowPathIcon },
  ]
  const callsToAction = [
    { name: 'Watch demo', href: '#', icon: PlayCircleIcon },
    { name: 'Contact sales', href: '#', icon: PhoneIcon },
  ]

  const posts = [
    {
      id: 1,
      title: 'Boost your conversion rate',
      href: '#',
      description:
        'Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel. Iusto corrupti dicta.',
      date: 'Mar 16, 2020',
      datetime: '2020-03-16',
      category: { title: 'Marketing', href: '#' },
      author: {
        name: 'Michael Foster',
        role: 'Co-Founder / CTO',
        href: '#',
        imageUrl:
          'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
    },
    // Más publicaciones...
  ];

  return (
    <div style={{ width: '100vw', overflowX: 'scroll' }} className="flex-col h-screen">
      <div className=" bg-gray-100 min-h-full relative max-w-full">
        {/* Imagen de fondo */}
        <img className="relative h-96 w-full m-0 p-0" src="image/vehiculo.jpg" alt="vehículo" />
        {role === 'Mecanico' && (
        <div id='Vista_Mecanico'>

        {/* Barra de búsqueda */}
        <div className="flex items-center justify-center w-full mt-5">
          <input
            id="buscar-home"
            name="Buscar-cliente"
            type="text"
            placeholder="Busca un cliente"
            className="w-4/5 lg:w-2/3 ml-4 rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-950"
          />
          <button
            type="button"
            
            className="w-11 h-11 mx-2 flex items-center justify-center rounded-md bg-amber-500 text-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
          >
            <MagnifyingGlassIcon aria-hidden="true" className="h-6 w-6" />
          </button>
          <button
           onClick={() => { setIsModalOpen(true); resetForm(); }}
            className="w-11 h-11 mx-2 flex items-center justify-center rounded-md bg-amber-500 text-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
          >
            <PlusIcon aria-hidden="true" className="h-6 w-6" />
          </button>
        </div>

        <Modal
  style={{
    content: { backgroundColor: "white" },
    overlay: { backgroundColor: "rgba(0, 0, 0, 0.80)" },
  }}
  className="h-full w-full absolute scroll left-96 top-8 p-5 rounded-lg max-w-2xl mx-auto my-3"
  isOpen={isModalOpen}
  onRequestClose={() => setIsModalOpen(false)}
  contentLabel="Formulario de Cita"
>
  <form className="flex flex-col justify-around text-center w-full h-full" onSubmit={handleSubmit}>
    <h2>{isEditMode ? "Editar Cita" : "Agregar Cita"}</h2>
    <div style={{ height: "30rem" }} className="flex flex-col justify-between p-6 pt-0">

    <input
  className="h-12 block font-medium my-3 text-gray-900"
  name="placa"  // Nombre cambiado a "placa" para evitar confusión
  value={placa}  // Usa el estado 'placa' para controlar el valor del input
  onChange={(e) => {
    setPlaca(e.target.value);  // Actualiza el valor de la placa
    handleAutoSearch(e.target.value); // Realiza la búsqueda al escribir
  }}
  placeholder="Ingrese la placa del automóvil"
/>

      <input
        className="h-12 block font-medium my-3 text-gray-900"
        name="Fecha_ingreso"
        value={formData.Fecha_ingreso}
        onChange={handleInputChange}
        type="date"
        required
      />
      <textarea
        style={{ height: "6rem" }}
        className="h-80 block font-medium my-3 text-gray-900"
        name="Descripcion"
        value={formData.Descripcion}
        onChange={handleInputChange}
        placeholder="Descripción"
        required
      />
     <div>
          <label>Estado de Cita</label>
          <select
            className="h-12 block font-medium my-3 text-gray-900"
            name="Id_estado"
            value={formData.Id_estado}
            onChange={handleInputChange}
          >
            <option value="">Selecciona un estado</option>
            {estadosCitas.map((estado) => (
              <option key={estado.Id_estado} value={estado.Id_estado}>
                {estado.Nombre}
              </option>
            ))}
          </select>
        </div>



      <div className="flex content-end justify-around items-center w-full h-15">
        <button
          type="submit"
          className="h-11 w-44 my-5 mx-2 flex items-center justify-center rounded-sm bg-yellow-500 p-1 text-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
        >
          {isEditMode ? "Actualizar" : "Agregar"}
        </button>
        <button
          type="button"
          className="h-11 w-44 my-5 mx-2 flex items-center justify-center rounded-sm bg-yellow-500 p-1 text-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
          onClick={() => setIsModalOpen(false)}
        >
          Cancelar
        </button>
      </div>
    </div>
  </form>
</Modal>


        {/* Sección de citas */}
        <div className="bg-gray-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl py-16 sm:py-24 lg:max-w-none lg:py-16">
              <h2 className="text-2xl font-bold text-gray-900">Citas</h2>
              <div className="mt-10 grid gap-8 border-t border-gray-200 pt-10 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <article
                    key={post.id}
                    className="border p-5 border-gray-300 shadow-lg rounded-lg flex flex-col items-start justify-between"
                  >
                    <div className="flex items-center gap-x-4 text-xs text-gray-500">
                      <time dateTime={post.datetime}>{post.date}</time>
                      <a
                        href={post.category.href}
                        className="rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100"
                      >
                        {post.category.title}
                      </a>
                      <Popover className="relative">
                                    <PopoverButton className="inline-flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900">
                                        <span  className='flex items-center justify-start content-center text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium'
                                        >Citas  <ChevronDownIcon aria-hidden="true" className='h-5' /> </span>
                                    </PopoverButton>

                                    <PopoverPanel
                                        transition
                                        className="absolute left-1/2 z-10 mt-5 flex w-screen max-w-max -translate-x-1/2 px-4 transition data-[closed]:translate-y-1 data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in"
                                    >
                                        <div className="w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm/6 shadow-lg ring-1 ring-gray-900/5">
                                        <div className="p-4">
                                            {solutions.map((item) => (
                                            <div key={item.name} className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50">
                                                <div className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                                                <item.icon aria-hidden="true" className="h-6 w-6 text-gray-600 group-hover:text-indigo-600" />
                                                </div>
                                                <div>
                                                <a href={item.href} className="font-semibold text-gray-900">
                                                    {item.name}
                                                    <span className="absolute inset-0" />
                                                </a>
                                                <p className="mt-1 text-gray-600">{item.description}</p>
                                                </div>
                                            </div>
                                            ))}
                                        </div>
                                        <div className="grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-50">
                                            {callsToAction.map((item) => (
                                            <a
                                                key={item.name}
                                                href={item.href}
                                                className="flex items-center justify-center gap-x-2.5 p-3 font-semibold text-gray-900 hover:bg-gray-100"
                                            >
                                                <item.icon aria-hidden="true" className="h-5 w-5 flex-none text-gray-400" />
                                                {item.name}
                                            </a>
                                            ))}
                                        </div>
                                        </div>
                                    </PopoverPanel>
                                    </Popover>
                      

                    </div>
                    <h3 className="mt-3 text-lg font-semibold text-gray-900 group-hover:text-gray-600">
                      <a href={post.href}>{post.title}</a>
                    </h3>
                    <p className="mt-5 line-clamp-3 text-sm text-gray-600">{post.description}</p>
                    <div className="mt-8 flex items-center gap-x-4">
                      <img
                        alt={post.author.name}
                        src={post.author.imageUrl}
                        className="h-10 w-10 rounded-full"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">
                          <a href={post.author.href}>{post.author.name}</a>
                        </p>
                        <p className="text-gray-600">{post.author.role}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>)}

      {role === 'Administrador' && (
      <div id='Vista_administrdor'>

      </div>
      )}
      </div>
    </div>
  );
};

export default Home;
