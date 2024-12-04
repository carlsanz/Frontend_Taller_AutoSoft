import { TrashIcon, PlusIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import {  Popover, PopoverButton, PopoverPanel  } from '@headlessui/react'
import {ChevronLeftIcon, ChevronUpIcon, ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/20/solid'
import { WrenchScrewdriverIcon, ArrowPathRoundedSquareIcon ,NoSymbolIcon,Cog8ToothIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';




Modal.setAppElement('#root');

const Home = () => {
  const role = localStorage.getItem('role') || '';
  const [repuestos, setRepuestos] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cantidadCitasHoy, setCantidadCitasHoy] = useState(0);

  useEffect(() => {
    fetchCantidadCitasHoy(); // Obtener la cantidad de citas del día
}, []);

  //Obtener cias de hoy
  const fetchCantidadCitasHoy = async () => {
    try {
        const response = await axios.get('http://localhost:5000/citas/hoy/cantidad'); // Endpoint para la cantidad de citas
        setCantidadCitasHoy(response.data.cantidad || 0);
    } catch (error) {
        console.error('Error al obtener la cantidad de citas del día:', error);
    }
};


//Obtener empleados
  const [empleados, setEmpleados] = useState([]);
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

  //buscar citas por fecha
    const [searchDate, setSearchDate] = useState(""); // Estado para la fecha seleccionada

    const handleSearch = async () => {
      if (!searchDate) {
          alert("Por favor, selecciona una fecha.");
          return;
      }
  
      try {
          const response = await fetch(`http://localhost:5000/citas/fecha/${searchDate}`);
  
          if (!response.ok) {
              const errorText = await response.text(); // Obtiene el mensaje en caso de error
              throw new Error(`Error: ${response.status} - ${errorText}`);
          }
  
          const data = await response.json(); // Analiza la respuesta solo si es válida
  
          if (data.length > 0) {
              setCitas(data); // Actualizar el estado con las citas encontradas
          } else {
              alert("No se encontraron citas para la fecha seleccionada.");
              setCitas([]); // Limpiar el estado si no hay citas
          }
      } catch (error) {
          console.error("Error al buscar citas:", error);
          alert("Ocurrió un error al buscar las citas. Verifica la consola para más detalles.");
      }
  };

  const handleVerTodas = () => {
    setSearchDate(''); // Limpia el input
    obtenerCitas(obtenerIdUsuario());
   };

  //Obtener cita por id_empleado 
  const [citas, setCitas] = useState([]);


   // Función para obtener el ID del usuario desde el Local Storage
    const obtenerIdUsuario = () => {
    const usuario = localStorage.getItem('idEmpleados'); // Obtiene el valor
    return usuario ? parseInt(usuario, 10) : null; // Lo convierte en número o devuelve null si no existe
  };

  // Función para obtener las citas por empleado
  const obtenerCitas = async (idEmpleado) => {
    try {
      setLoading(true); // Muestra cargando
      setError(null); // Limpia errores previos
      const response = await axios.get(`http://localhost:5000/citas/obtener/cita/${idEmpleado}`);
      setCitas(response.data); // Guarda las citas en el estado
    } catch (err) {
      console.error('Error al obtener las citas:', err);
      setError('No se pudieron cargar las citas. Intenta de nuevo más tarde.');
    } finally {
      setLoading(false); // Oculta cargando
    }
  };

  useEffect(() => {
    const idEmpleados = obtenerIdUsuario(); // Obtiene el ID del Local Storage
    if (idEmpleados) {
      obtenerCitas(idEmpleados); // Llama al backend con el ID
    } else {
      setError('No se encontró el ID del empleado en el Local Storage.');
    }
  }, []);


//Obtener Repuestos por citas
  const [citaRepuestosSeleccionada, setCitaRepuestosSeleccionada] = useState(null); // Cita seleccionada para repuestos
  const [citaServiciosSeleccionada, setCitaServiciosSeleccionada] = useState(null); // Cita seleccionada para servicios


  const obtenerRepuestos = async (idCita) => {
    if (!idCita) {
      setError('No se encontró el ID de la cita.');
      setLoading(false);
      return;
    }
    try {
      
      console.log(`Obteniendo repuestos para la cita con ID: ${idCita}`);
      const response = await axios.get(`http://localhost:5000/reputilizado/${idCita}`);
      console.log('Datos recibidos:', response.data);
      setRepuestos(response.data); // Almacena los repuestos
    } catch (error) {
      console.error('Error al obtener los repuestos:', error);
      setError('Error al obtener los repuestos.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleMostrarRepuestos = (idCita) => {
    if (citaRepuestosSeleccionada === idCita) {
      setCitaRepuestosSeleccionada(null); // Oculta los repuestos si ya estaban seleccionados
    } else {
      setCitaRepuestosSeleccionada(idCita); // Selecciona la nueva cita
      obtenerRepuestos(idCita);
    }
  };
  
  // Obtener servicios
  const obtenerServicios = async (idCita) => {
    if (!idCita) {
      setError('No se encontró el ID de la cita.');
      setLoading(false);
      return;
    }
    try {
      console.log(`Obteniendo servicios para la cita con ID: ${idCita}`);
      const response = await axios.get(`http://localhost:5000/api/servicios/citas/disponibles/${idCita}`);
      console.log('Datos recibidos:', response.data); 
      setServicios(response.data); // Almacena los servicios
    } catch (error) {
      console.error('Error al obtener los servicios:', error);
      setError('Error al obtener los servicios.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleMostrarServicios = (idCita) => {
    if (citaServiciosSeleccionada === idCita) {
      setCitaServiciosSeleccionada(null); // Oculta los servicios si ya estaban seleccionados
    } else {
      setCitaServiciosSeleccionada(idCita); // Selecciona la nueva cita
      obtenerServicios(idCita);
    }
  };



  // Estado para el modal de repuestos y los datos de los repuestos
  const [isRepuestosModalOpen, setIsRepuestosModalOpen] = useState(false);
  const [repuestosData, setRepuestosData] = useState([
    { Id_inventario: '', Cantidad_usada: '', Id_cita: '' } // Asegúrate de incluir id_cita al inicio
  ]);


//funcion para reagendar cita
  const [idCita, setIdCita] = useState(null);
  const abrirFechaModal = (id) => {
    setIdCita(id); // Almacena el ID de la cita
    setFecha('');  // Reinicia el estado con una fecha vacía
    setIsFechaModalOpen(true);
  };

const cerrarFechaModal = () => setIsFechaModalOpen(false); 
const [isFechaModalOpen, setIsFechaModalOpen] = useState(false); // Controla el estado del modal
const [fecha, setFecha] = useState(''); // Almacena la fecha ingresada


const actualizarFecha = async (idCita) => {
  if (!idCita) return;  // Si no hay un ID válido, no hace nada
  try {
    const response = await axios.put(
      `http://localhost:5000/citas/actFecha/${idCita}`, // Usa el idCita del estado
      { Fecha_ingreso: fecha } // Cambié el nombre de la clave a "Fecha_ingreso"
    );

    console.log('Respuesta del servidor:', response.data);
    alert('Fecha actualizada con éxito');
    cerrarFechaModal(); // Cierra el modal
  } catch (error) {
    console.error('Error al actualizar la fecha:', error);
    alert('Hubo un error al actualizar la fecha. Inténtalo de nuevo.');
  }
  obtenerCitas();
};


 //SERVICIOS CITAS
  const [isServiciosModalOpen, setIsServiciosModalOpen] = useState(false);
  const [serviciosData, setServiciosData] = useState([{ id_servicio: '' }]);
  const [serviciosDisponibles, setServiciosDisponibles] = useState([]);


  const abrirServiciosModal = () => {
    obtenerServiciosDisponibles(); // Carga los servicios al abrir el modal
    setIsServiciosModalOpen(true);
  };

  const cerrarServiciosModal = () => {
    setServiciosData([{ id_servicio: '' }]); // Limpia los datos al cerrar
    setIsServiciosModalOpen(false);
  };

  const obtenerServiciosDisponibles = () => {
    fetch('http://localhost:5000/api/servicios/servxcita')
      .then((response) => response.json())
      .then((data) => setServiciosDisponibles(data))
      .catch((error) => console.error('Error al obtener servicios:', error));
  };

  const handleServicioChange = (index, field, value) => {
    const newServicios = [...serviciosData];
    newServicios[index] = { ...newServicios[index], [field]: value };
    setServiciosData(newServicios);
  };

 
  const handleServiciosFormSubmit = async (e) => {
    e.preventDefault();
    try {
      for (const servicio of serviciosData) {
        const payload = {
        id_cita: idCitaSeleccionada,
        id_servicio: servicio.id_servicio,
        };
        // Mostrar el JSON enviado en la consola
        console.log('JSON enviado:', JSON.stringify(payload, null, 2));
        // Enviar cada servicio por separado
        const response = await fetch('http://localhost:5000/api/servicios/citas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
        const data = await response.json();
          if (response.ok) {
            console.log('Respuesta del servidor:', data);
          } else {
            // Si el servidor responde con un error, mostramos la alerta
            alert(data.message || 'Hubo un problema al asociar el servicio.');
          }
        }
        cerrarServiciosModal(); // Cerrar el modal después de enviar todos los servicios
        } catch (error) {
          console.error('Error al enviar servicios:', error);
          alert('Hubo un error en la solicitud.');
        }
    };



  const [repuestosDisponibles, setRepuestosDisponibles] = useState([]);
  // Función para abrir el modal de repuestos y resetear el estado de los repuestos
  const abrirRepuestosModal = () => {
    setRepuestosData([{ id_inventario: '', cantidad: '' }]); // Reinicia el estado con un solo repuesto vacío
    cargarRepuestos(); // Carga los repuestos antes de abrir el modal
    setIsRepuestosModalOpen(true);
  };

  const cerrarRepuestosModal = () => setIsRepuestosModalOpen(false);

  // Función para manejar los cambios en los campos de los repuestos
  const handleRepuestoChange = (index, field, value) => {
    const newRepuestos = [...repuestosData];
    
  // Mantenemos el 'id_cita' intacto, usando el valor de 'idCitaSeleccionada'
  newRepuestos[index] = { 
    ...newRepuestos[index], 
    [field]: value,
    id_cita: idCitaSeleccionada // Asigna 'id_cita' con el valor de 'idCitaSeleccionada'
  };

  setRepuestosData(newRepuestos); // Actualizar el estado
};
 // Función para agregar un nuevo repuesto
 // Función para manejar el envío de repuestos al backend

 // Función para enviar los datos (renombrada a handleRepuestosFormSubmit)
 // Enviar un solo objeto, no un array
 const handleRepuestosFormSubmit = (e) => {
  e.preventDefault();

  const repuestoAEnviar = repuestosData[0] || {};
  console.log('JSON enviado:', JSON.stringify(repuestoAEnviar));

  fetch('http://localhost:5000/reputilizado/utilizados', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(repuestoAEnviar),
  })
      .then((response) => {
          if (!response.ok) {
              return response.json().then((errorData) => {
                  throw new Error(errorData.message || 'Error en la solicitud');
              });
          }
          return response.json(); // Procesa la respuesta en caso de éxito (200)
      })
      .then((data) => {
          if (data.repetido) {
              alert('El repuesto ya fue agregado para esta cita.');
          } else {
              alert('Repuesto agregado correctamente.');
          }
      })
      .catch((error) => {
          alert(error.message || 'Ocurrió un error inesperado.');
      });
};


  const cargarRepuestos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/reputilizado'); // Asegúrate de que la URL sea la correcta
      setRepuestosDisponibles(response.data); // Asume que el endpoint devuelve un array de objetos
    } catch (error) {
      console.error('Error al cargar los repuestos:', error);
    }
  };

  const handleCitaSeleccionada = async (id) => {
    if (!id) {
      console.error('ID de cita no válido');
      return;
    }
    try {
      console.log('Cita seleccionada:', id);
      setIdCitaSeleccionada(id);
      await obtenerRepuestos(id); // Llama a la función para obtener los repuestos
    } catch (error) {
      console.error('Error al manejar la cita seleccionada:', error);
    }
  };

  const [idCitaSeleccionada, setIdCitaSeleccionada] = useState(null);
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
    obtenerEstadosCitas();
      
  }, []);

  const [stepsState, setStepsState] = useState({});  // Estado para los pasos de las citas


  const obtenerEstadosCitas = async () => {
    try {
      const response = await axios.get('http://localhost:5000/citas/estados');
      setEstadosCitas(response.data); // Almacenar los estados de citas en el estado
    } catch (error) {
      console.error('Error al obtener estados de citas:', error);
    }
  };

  let searchTimeout = null; // Temporizador global para evitar múltiples solicitudes innecesarias

  const handleAutoSearch = (value) => {
    clearTimeout(searchTimeout); // Cancela cualquier temporizador previo
  
    if (value.length >= 4) { // Solo busca si hay al menos 4 caracteres
      searchTimeout = setTimeout(() => {
        // Endpoint del backend para buscar autos por placa
        fetch(`http://localhost:5000/citas/placa/${value}`).then((response) => {
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
        const response = await axios({
            method,
            url,
            data: finalFormData,
        });

        // Actualizar el estado de citas directamente
        if (isEditMode) {
            // Si es edición, actualizar la cita en el estado
            setCitas((prevCitas) =>
                prevCitas.map((cita) =>
                    cita.Id_cita === formData.Id_cita ? response.data : cita
                )
            );
        } else {
            // Si es una nueva cita, agregarla al estado
            setCitas((prevCitas) => [...prevCitas, response.data]);
        }

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

 
  const cancelarCita = async (idCita) => {
    handleCitaSeleccionada(idCita);
    console.log('ID de la cita a eliminar:', idCita); // Log del ID
    const url = `http://localhost:5000/citas/eliminar/${idCita}`;
    console.log('URL de la solicitud DELETE:', url); // Log de la URL

    const confirmar = window.confirm('¿Está seguro de que desea cancelar esta cita?');
    if (!confirmar) return;

    try {
        const response = await fetch(url, { method: 'DELETE' });
        console.log('Respuesta del servidor:', response); // Log de la respuesta
        
        if (response.ok) {
            alert('Cita cancelada con éxito.');
            obtenerCitas(); // Refresca la lista de citas
        } else {
            const errorText = await response.text();
            throw new Error(errorText || 'Error al cancelar la cita');
        }
    } catch (error) {
        console.error('Error al cancelar la cita:', error.message);
        alert('Hubo un problema al cancelar la cita. Intente de nuevo.');
    }
};



       //progressbar 
      
  const steps = [
    { label: "Pendiente",},
    { label: "En progreso" },
    { label: "Finalizada" },
  ];

  // Función para cargar el estado inicial de todas las citas
const fetchInitialStates = async () => {
  try {
    const url = `http://localhost:5000/citas/citasEstados`;
    const response = await axios.get(url);
    const citasEstados = response.data; // Suponiendo que devuelve un array con { Id_cita, Id_estado }

    // Convertir los estados a un objeto para manejar el estado local
    const estadosIniciales = {};
    citasEstados.forEach(({ Id_cita, Id_estado }) => {
      estadosIniciales[Id_cita] = Id_estado - 1; // Ajuste para índices (1, 2, 3 -> 0, 1, 2)
    });

    setStepsState(estadosIniciales);
  } catch (error) {
    console.error("Error al obtener los estados iniciales:", error);
    alert("No se pudieron obtener los estados iniciales. Inténtalo nuevamente.");
  }
};

// Llama a esta función cuando el componente se monte
useEffect(() => {
  fetchInitialStates();
}, []);
  // Función para manejar el siguiente estado
  const handleNext = async (id) => {
    const currentStep = stepsState[id] || 0;
    if (currentStep < steps.length - 1) {
      try {
        const nuevoEstado = currentStep + 1;
        const url = `http://localhost:5000/citas/actEstado/${id}`;
        await axios.put(url, { Id_estado: nuevoEstado + 1 });
        setStepsState((prevState) => ({
          ...prevState,
          [id]: nuevoEstado,
        }));
        alert("Estado actualizado correctamente.");
      } catch (error) {
        console.error("Error al actualizar el estado:", error);
        alert("No se pudo actualizar el estado. Inténtalo nuevamente.");
      }
    } else {
      alert("La cita ya está finalizada.");
    }
  };

  // Función para manejar el estado anterior
  const handlePrev = async (id) => {
    const currentStep = stepsState[id] || 0;
    if (currentStep > 0) {
      try {
        const nuevoEstado = currentStep - 1;
        const url = `http://localhost:5000/citas/actEstado/${id}`;
        await axios.put(url, { Id_estado: nuevoEstado + 1 });
        setStepsState((prevState) => ({
          ...prevState,
          [id]: nuevoEstado,
        }));
        alert("Estado actualizado correctamente.");
      } catch (error) {
        console.error("Error al actualizar el estado:", error);
        alert("No se pudo actualizar el estado. Inténtalo nuevamente.");
      }
    } else {
      alert("Ya estás en el primer paso.");
    }
  };
   //fin progressbar 

   
  // TODO PARA GENERAR FACTURAS.
  const [showModal, setShowModal] = useState(false);
  const [factura, setFactura] = useState(null);
  const [facturaError, setFacturaError] = useState('');
  
  // useEffect para verificar el estado de 'showModal'
  useEffect(() => {
      console.log('Modal abierto:', showModal);  // Esto se ejecutará cuando `showModal` cambie
  }, [showModal]);
  
  // Función para generar la factura
  const generarFactura = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/factura/generar/${idCitaSeleccionada}`);
      console.log('Respuesta de la API:', response.data);
      
      // Extraemos los datos de la factura, servicios y repuestos
      const { datosFactura } = response.data;
      setFactura(datosFactura);
      setFacturaError('');
      setShowModal(true);  // Abre el modal
    } catch (err) {
      console.error('Error:', err);
      setFacturaError(err.response?.data?.message || 'Error al generar la factura');
    }
  };
  

  //Opciones de las citas()
  const solutions = [
    { name: 'Agregar Servicio', description: 'Agregar los servicios que se apicaran al vehiculo', href: '#', icon: WrenchScrewdriverIcon,  onClick: abrirServiciosModal},
    { name: 'Agregar Repuestos', description: 'Incluye los repuestos necesarios para la reparacion', href: '#', icon: Cog8ToothIcon, onClick: abrirRepuestosModal  },
    { name: 'Reagendar cita', description: 'Modificar Hora y fecha de la cita', href:'#', icon: ArrowPathRoundedSquareIcon, onClick: () => abrirFechaModal(citas.Id_cita) },
    { name: 'Cancelar cita', description: 'Anular la cita programada', href: '#', icon: NoSymbolIcon, onClick: () => cancelarCita(citas.Id_cita) },
    { name: 'Generar factura', description: 'Cita finalizada, lista para facturar', href: '#', icon: ArrowDownTrayIcon, onClick:generarFactura},
  ]


  //Eliminar servicios de la cita
  const eliminarServicio = async (idCita, idServicio) => {
    console.log(`Intentando eliminar el servicio con ID: ${idServicio} de la cita con ID: ${idCita}`);
    try {
      const response = await axios.delete(`http://localhost:5000/api/servicios/eliminar/${idCita}/${idServicio}`);
      console.log('Respuesta del servidor:', response.data);
  
      // Si la eliminación fue exitosa, actualizamos el estado
      setServicios((prevServicios) =>
        prevServicios.filter((servicio) => servicio.id_servicio !== idServicio)
      );
  
      alert('Servicio eliminado correctamente.');
    } catch (error) {
      console.error('Error al eliminar el servicio:', error.response?.data || error.message);
      alert('Hubo un error al eliminar el servicio.');
    }
  };

    //Eliminar repuesto
  const eliminarRepuesto = async (idCita, idInventario) => {
    console.log(`Datos enviados al backend: ID Cita - ${idCita}, ID Inventario - ${idInventario}`);
  
    try {
      const response = await axios.delete(`http://localhost:5000/reputilizado/${idCita}/${idInventario}`);
      console.log('Respuesta del servidor:', response.data);
  
      // Actualizar la lista de repuestos
      setRepuestos((prevRepuestos) =>
        prevRepuestos.filter((repuesto) => repuesto.id_inventario !== idInventario)
      );
  
      alert('Repuesto eliminado correctamente y cantidad devuelta al inventario.');
    } catch (error) {
      console.error('Error al eliminar el repuesto:', error.response?.data || error.message);
      alert('Hubo un error al eliminar el repuesto.');
    }
  };



  return (
    <div style={{ width: '98vw', height: '2000px' }} className="flex-col p-10 pt-20">
    <div className=" bg-gray-100 min-h-full flex flex-col justify-start relative max-w-full">
      {/* Imagen de fondo */}
      <img className="relative h-96 opacity-85 opa w-full m-0 p-0  rounded-2xl" src="image/vehiculo.jpg" alt="vehículo" />
        {role === 'Mecanico' && (
        <div id='Vista_Mecanico'>
        
        {/* Barra de búsqueda */}
        <div className="flex items-center justify-center w-full mt-5">
          <input
          id="buscar-home"
          name="Buscar-cliente"
          type="date"
          placeholder="Busca un cita"
          className="w-4/5 lg:w-2/3 ml-4 rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-950"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          />
          <button
          type="button"
          className="w-11 h-11 mx-2 flex items-center justify-center rounded-md bg-amber-500 text-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
          onClick={handleSearch}
          >
            <MagnifyingGlassIcon aria-hidden="true" className="h-6 w-6" />
          </button>
          <button
          onClick={() => { setIsModalOpen(true); resetForm(); }}
          className="w-11 h-11 mx-2 flex items-center justify-center rounded-md bg-amber-500 text-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
          >
            <PlusIcon aria-hidden="true" className="h-6 w-6" />
          </button>
          <button
                    type="button"
                    className="w-auto h-11 my-5 mx-2 flex items-center justify-center rounded-md bg-blue-500 px-4 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    onClick={handleVerTodas}
                >
                    Ver todas las citas
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


 {/* Modal para Factura */}
<div>
  {/* Mostrar errores si hay */}
  {facturaError && <p style={{ color: 'red' }}>{facturaError}</p>}

  {/* Mostrar el modal solo si showModal es true y factura está disponible */}
  {showModal && factura && (
    <div
      className="modal"
      style={{
        background: 'rgba(0, 0, 0, 0.5)',
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        zIndex: '9999',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        className="modal-content p-11 py-5 h-full w-1/2 flex flex-col justify-between overflow-y-auto scrollbar-thin max-w-full "
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          margin: 'auto',
        }}
    >
    {/* Botón para cerrar el modal */}
    <div className="flex items-baseline justify-between">
        
        <h2 className="text-2xl">Factura </h2>
        <button
        onClick={() => setShowModal(false)}
        className="px-4 py-2  text-black rounded-md mt-4"
        >
          <XMarkIcon aria-hidden="true" className="h-6 w-6" />
        </button>
        
      </div>
        <p><strong>Fecha:</strong> {new Date(factura.Fecha).toLocaleString()}</p>
        <div className="flex justify-between">
            <div>
            
            <div className="mt-4">
              <p><strong>No. Factura:</strong> {factura.Id_cita}</p>
              <p><strong>Empleado:</strong> {factura.empleado.NombreEmpleado} {factura.empleado.ApellidoEmpleado}</p>
              </div>


            </div>
            <div className="mt-4">
              <p><strong>Cliente:</strong> {factura.cliente.NombreCliente} {factura.cliente.ApellidoCliente}</p>
              <p><strong>Identidad:</strong> {factura.cliente.IdentidadCliente}</p>
            </div>
        </div>

       

        {/* Cliente */}
     

        {/* Empleado */}
 
        {/* Tabla de servicios */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Servicios</h3>
          {factura.servicios && factura.servicios.length > 0 ? (
            <table className="table-auto w-full text-xs">
              <thead className="border-b-2 border-zinc-600 ">
                <tr>
                  <th className="text-center p-2">Servicio</th>
                  <th className="text-center p-2">Precio</th>
                </tr>
              </thead>
              <tbody >
                {factura.servicios.map((servicio, index) => (
                  <tr className="border-b-2 border-zinc-300 " key={index}>
                    <td className="text-center p-2">{servicio.NombreServicio}</td>
                    <td className="text-center p-2">{servicio.PrecioServicio}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500">No hay servicios disponibles para esta cita.</p>
          )}
        </div>

        {/* Tabla de repuestos */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Repuestos</h3>
          {factura.repuestos && factura.repuestos.length > 0 ? (
            <table className=" table-auto w-full text-xs">
              <thead  className="border-b-2 border-zinc-600 ">
                <tr>
                  <th className="text-center p-2">Repuesto</th>
                  <th className="text-center p-2">Cantidad</th>
                  <th className="text-center p-2">Precio Unitario</th>
                  <th className="text-center p-2">Total</th>
                </tr>
              </thead>
              <tbody >
                {factura.repuestos.map((repuesto, index) => (
                  <tr className="border-b-2 border-zinc-300 " key={index}>
                    <td className="text-center p-2">{repuesto.NombreRepuesto}</td>
                    <td className="text-center p-2">{repuesto.Cantidad}</td>
                    <td className="text-center p-2">{repuesto.PrecioUnidad}</td>
                    <td className="text-center p-2">{repuesto.TotalRepuesto}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500">No hay repuestos disponibles para esta cita.</p>
          )}
        </div>
        <div className="flex justify-between">
          <div><p>Direccion del taller</p></div>
          <div>
          <p><strong>Subtotal:</strong> {factura.Subtotal}</p>
        <p><strong>Impuesto:</strong> {factura.Impuesto}</p>
        <p><strong>Total:</strong> {factura.Total}</p>
          </div>
        </div>


    
      </div>
    </div>
  )}
</div>






        {/* Seccion PARA AGREGAR UN REPUESTO*/}
        {/* MODAL PARA AGREGAR UN REPUESTO*/}
        <Modal
        isOpen={isRepuestosModalOpen}
        onRequestClose={cerrarRepuestosModal}
        style={{
          content: {
            backgroundColor: 'white',
            zIndex: 9999, // Asegúrate de que el modal tenga un valor alto de z-index
          },
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.80)',
            zIndex: 9998, // También ajusta el z-index del overlay para que esté por debajo del modal
          },}}
        contentLabel="Formulario de Repuestos"
        className="h-auto w-full absolute left-96 top-20 p-5 rounded-lg max-w-2xl mx-auto my-8"
        >
          <form onSubmit={handleRepuestosFormSubmit} className="flex flex-col justify-around text-center w-full h-full">
            <h2>Agregar Repuestos</h2>
            <div className="flex flex-col justify-between p-6 pt-0">
              {repuestosData.map((repuesto, index) => (
                <div key={index} className="flex flex-col my-4">
                  <div className="flex justify-between">
                    <select
                    className="h-12 block font-medium my-3 text-gray-900"
                    value={repuesto.id_inventario}
                    onChange={(e) => handleRepuestoChange(index, 'id_inventario', e.target.value)}
                    >
                      <option value="">Selecciona un repuesto</option>
                      {repuestosDisponibles.map((repuestoDisponible) => (
                      <option key={repuestoDisponible.Id_inventario} value={repuestoDisponible.Id_inventario}>
                      {repuestoDisponible.nombre_repuesto}
                      </option>
                      ))}
                    </select>
                    <input
                    type="number"
                    min="1"
                    placeholder="Cantidad"
                    className="h-12 block font-medium my-3 text-gray-900"
                    value={repuesto.cantidad}
                    onChange={(e) => handleRepuestoChange(index, 'cantidad', e.target.value)}
                    />
                  </div>
                </div>
              ))}
              
              <div className="flex justify-between">
                <button
                type="submit"
                className="h-11 w-44 my-5 mx-2 flex items-center justify-center rounded-sm bg-yellow-500 p-1 text-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  Agregar Repuestos
                </button>
                <button
                type="button"
                onClick={cerrarRepuestosModal}
                className="h-11 w-44 my-5 mx-2 flex items-center justify-center rounded-sm bg-gray-500 p-1 text-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </form>
        </Modal>

        {/*seccion de cambio de fecha */}
        {/* MODAL PARA REAGENDAR CITA */}
        <Modal
        isOpen={isFechaModalOpen}
        onRequestClose={cerrarFechaModal}
        style={{
          content: {
            backgroundColor: 'white',
            zIndex: 9999, // Asegúrate de que el modal tenga un valor alto de z-index
          },
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.80)',
            zIndex: 9998, // También ajusta el z-index del overlay para que esté por debajo del modal
          },}}
        contentLabel="Formulario de Reagendar Cita"
        className="h-auto w-full absolute left-96 top-20 p-5 rounded-lg max-w-2xl mx-auto my-8"
        >
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              console.log('Fecha seleccionada:', fecha);
              cerrarFechaModal();
            }} 
            className="flex flex-col justify-around text-center w-full h-full"
          >
            <h2>Reagendar Cita</h2>
            <div className="flex flex-col justify-between p-6 pt-0">
              <div className="my-4">
                <label className="block text-sm font-medium text-gray-700">
                  Selecciona una nueva fecha
                </label>
                <input
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  className="h-12 block font-medium my-3 text-gray-900 w-full border border-gray-300 rounded-md p-2"
                  required
                />
              </div>
              <div className="flex justify-between">
                <button
                type="button" // Cambiado de "submit" a "button"
                onClick={()=> actualizarFecha(idCitaSeleccionada)} // Llama a la función `actualizarFecha`
               className="h-11 w-44 my-5 mx-2 flex items-center justify-center rounded-sm bg-yellow-500 p-1 text-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  Guardar Fecha
                </button>
                <button
                type="button"
                onClick={cerrarFechaModal}
                className="h-11 w-44 my-5 mx-2 flex items-center justify-center rounded-sm bg-gray-500 p-1 text-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </form>
        </Modal>


            {/* MODAL PARA AGREGAR SERVICIOS*/}
            <Modal
            isOpen={isServiciosModalOpen}
            onRequestClose={cerrarServiciosModal}
            style={{
              content: {
                backgroundColor: 'white',
                zIndex: 9999, // Asegúrate de que el modal tenga un valor alto de z-index
              },
              overlay: {
                backgroundColor: 'rgba(0, 0, 0, 0.80)',
                zIndex: 9998, // También ajusta el z-index del overlay para que esté por debajo del modal
              },}}
                contentLabel="Formulario de Servicios"
                className="h-auto w-full absolute left-96 top-20 p-5 rounded-lg max-w-2xl mx-auto my-8"
              >
                <form
                  onSubmit={handleServiciosFormSubmit}
                  className="flex flex-col justify-around text-center w-full h-full"
                >
                  <h2>Agregar Servicios</h2>
                  <div className="flex flex-col justify-between p-6 pt-0">
                    {serviciosData.map((servicio, index) => (
                      <div key={index} className="flex flex-col my-4">
                        <select
                          className="h-12 block font-medium my-3 text-gray-900"
                          value={servicio.id_servicio || ''}
                          onChange={(e) => handleServicioChange(index, 'id_servicio', e.target.value)}
                        >
                          <option value="">Selecciona un servicio</option>
                          {serviciosDisponibles.map((servicioDisponible) => (
                            <option
                              key={servicioDisponible.Id_servicio}
                              value={servicioDisponible.Id_servicio}
                            >
                              {servicioDisponible.Nombre} - {servicioDisponible.Precio} Lps.
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  
                    <div className="flex justify-between">
                      <button
                        type="submit"
                        className="h-11 w-44 my-5 mx-2 flex items-center justify-center rounded-sm bg-yellow-500 p-1 text-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                      >
                        Agregar Servicios
                      </button>
                      <button
                        type="button"
                        onClick={cerrarServiciosModal}
                        className="h-11 w-44 my-5 mx-2 flex items-center justify-center rounded-sm bg-gray-500 p-1 text-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
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
              {error && <p className="text-red-600">{error}</p>}
              {loading && <p>Cargando citas...</p>}
              {!loading && citas.length === 0 && !error && <p>No tienes citas asignadas.</p>}
              {!loading && citas.length > 0 && (
              <div className="mt-10 grid gap-8 border-t border-gray-200 pt-10 sm:grid-cols-2 lg:grid-cols-3">
                {citas.map((cita) => (
                  <article
                    key={cita.Id_cita}
                    onClick={() => handleCitaSeleccionada(cita.Id_cita)}
                    className="border p-5 border-gray-300 shadow-lg rounded-lg flex flex-col items-start justify-between"
                  >
                    <div className="flex justify-between w-full items-center gap-x-4 text-xs text-gray-500">
                    <time dateTime={cita.Fecha_ingreso}>
                    {(() => {
                      // Validar la fecha antes de formatearla
                      const fecha = new Date(cita.Fecha_ingreso);
                      if (isNaN(fecha)) {
                        return "Fecha no válida"; // Mensaje en caso de que la fecha sea inválida
                      }
                      return new Intl.DateTimeFormat("es-ES", {
                        weekday: "long", // Día de la semana
                        year: "numeric",
                        month: "long",  // Mes en texto completo
                        day: "numeric",
                      }).format(fecha);
                    })()}
                  </time>

                      
                      <Popover className="relative">
                                    <PopoverButton className="inline-flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900">
                                        <span  
                                        className='flex items-center justify-start content-center text-gray-700  px-3 py-2 rounded-md text-sm font-medium'
                                        >Opciones  <ChevronDownIcon aria-hidden="true" className='h-5' /> </span>
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
                                                  
                                                <a href={item.href} className="font-semibold text-gray-900"
                                                onClick={(e) => {
                                                  // Si el ítem tiene una función onClick, se ejecuta
                                                  if (item.onClick) {
                                                    e.preventDefault();  // Evitar el comportamiento por defecto de los enlaces
                                                    item.onClick();       // Ejecutar la función onClick
                                                  }
                                                }}>
                                                    {item.name}
                                                    <span className="absolute inset-0"
                                                    />
                                                    
                                                </a>
                                                <p className="mt-1 text-gray-600">{item.description}</p>
                                                </div>
                                            </div>
                                            ))}
                                        </div>
                                        <div className="grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-50">
                                        <div>

                                            
                                          </div>
                                           
                                        </div>
                                        </div>
                                    </PopoverPanel>
                                    </Popover>
                                        </div>
                                        <div className="h-auto flex items-center content-centerw-full" >
                                        <h3 className="mt-3 mr-2  text-lg font-semibold text-gray-900 group-hover:text-gray-600">
                                          Cliente: </h3>
                                        <h4 className="mt-3 ">{cita.Nombre} {cita.Apellido}  </h4>
                                        </div>
                                        <div className="h-auto flex items-center content-centerw-full" >
                                        <h3 className="mt-3 mr-2 text-lg font-semibold text-gray-900 group-hover:text-gray-600">
                                          Placa del auto:
                                        </h3>
                                        <h4 className="mt-3 ">{cita.placa}</h4>
                                        </div>
                                        <p className="mt-5 line-clamp-3 text-sm text-gray-600">{cita.Descripcion}</p>
                                        <div className="mt-8 w-full flex flex-col items-center gap-x-4">
                                        <div className="h-auto w-full"> {/* Mostrar los servicios */}
                                        <div className="p-2">
                        {/* Boton para mostrar los serviciod*/}
                          <button
                            onClick={() => {handleMostrarServicios(cita.Id_cita);
                            
                            }}
                            className=" mb-1 flex px-4 w-full py-1 bg-gray-400 text-white rounded-md"
                          >
                            {citaServiciosSeleccionada === cita.Id_cita ?  (<><ChevronUpIcon aria-hidden="true" className="h-6 w-6" />  Ocultar</>) : (<><ChevronDownIcon aria-hidden="true" className="h-6 w-6" />  Ver</>)} Servicios
                          </button>
                          {citaServiciosSeleccionada === cita.Id_cita && (
                            <div className="mt-4 overflow-hidden transition-all duration-300 max-h-40">  
                            <div className="p-4 bg-gray-100 border border-gray-300 rounded-md">
                            {servicios.length > 0 ? (
                            <table className="table-row-group text-xs">
                                <thead>
                                  <tr>
                                    <th className="text-center m-2 p-2">Servicio</th>
                                    <th className="text-center m-2 p-2">Precio</th>
                                    <th className="text-center m-2 p-2"></th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {servicios.map((servicio) => (
                                    <tr key={servicio.id_cliente}>
                                      <td className="text-center m-2 p-2">{servicio.nombre_servicio}</td>
                                      <td className="text-center m-2 p-2">{servicio.precio_servicio}</td>
                                      <td className="text-center m-2 p-2">
                                      <button className="w-5 h-5 text-xs m-2 flex items-center justify-center rounded-md  p-1 text-black hover:text-red-600 "
                                      onClick={() => {
                                        console.log(`Botón presionado para eliminar servicio. ID Cita: ${idCitaSeleccionada}, ID Servicio: ${servicio.id_servicio}`);
                                        eliminarServicio(idCitaSeleccionada, servicio.id_servicio);
                                      }} >
                                            <TrashIcon aria-hidden="true" className="h-6 w-6" />
                                        </button>
                                        </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                              ) : (
                                <p className="text-gray-500">No hay servicios disponibles para esta cita.</p>
                              )}
                      
                            </div>
                          </div>)}

                          {/* Boton para mostrar los repuestos*/}
                          <button
                          onClick={() => handleMostrarRepuestos(cita.Id_cita)}
                          className="mb-1 flex px-4 w-full py-1 bg-gray-400 text-white rounded-md"
                          >
                            {citaRepuestosSeleccionada === cita.Id_cita ?  (<><ChevronUpIcon aria-hidden="true" className="h-6 w-6" />  Ocultar</>) : (<><ChevronDownIcon aria-hidden="true" className="h-6 w-6" />  Ver</>)} Repuestos
                          </button>

                          {/* Tabla de repuestos */}
                          
                          {citaRepuestosSeleccionada === cita.Id_cita && (
                            <div className="mt-4 overflow-hidden transition-all duration-300 max-h-40">
                            <div className="p-4 bg-gray-100 border border-gray-300 rounded-md">
                            <table className="table-row-group text-xs">
                                <thead>
                                  <tr>
                                    <th className="text-center m-2 p-2">Repuesto</th>
                                    <th className="text-center m-2 p-2">Cantidad</th>
                                    <th className="text-center m-2 p-2"></th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {repuestos.map((repuesto) => (
                                    <tr key={repuesto.id_cliente}>
                                      <td className="text-center m-2 p-2">{repuesto.nombre_repuesto}</td>
                                      <td className="text-center m-2 p-2">{repuesto.Cantidad_usada}</td>
                                      <td className="text-center m-2 p-2">
                                      <button className="w-5 h-5 text-xs m-2 flex items-center justify-center rounded-md  p-1 text-black hover:text-red-600 " 
                                      onClick={() => {
                                        console.log(`Intentando eliminar repuesto. ID Cita: ${idCitaSeleccionada}, ID Inventario: ${repuesto.id_inventario}`);
                                        eliminarRepuesto(idCitaSeleccionada, repuesto.id_inventario);
                                      }}>
                                            <TrashIcon aria-hidden="true" className="h-6 w-6" />
                                        </button>
                                        </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>)}

                        
                    {/*progressbar*/}
                    <div className="w-full max-w-2xl mx-auto">
                    
                    <div className="flex items-center justify-between">
                      {steps.map((step, index) => (
                        <React.Fragment key={index}>
                          {/* Step Circle */}
                          <div className="flex flex-col items-center">
                            <div
                              className={`w-8 h-8 flex items-center justify-center rounded-full font-bold ${
                                index <= (stepsState[cita.Id_cita] || 0) 
                                  ? "bg-amber-500 text-white"
                                  : "bg-gray-300 text-gray-500"
                              }`}
                            >
                              {index + 1}
                            </div>
                            <p className="mt-2 text-sm">{step.label}</p>
                          </div>
                          {/* Connecting Bar */}
                          {index < steps.length - 1 && (
                            <div className="flex-grow h-1 mx-2 relative">
                              <div
                                className={`absolute left-0 top-0 h-1 transition-all ${
                                  index < (stepsState[cita.Id_cita] || 0) ? "bg-blue-500 w-full" : "bg-gray-300 w-0"
                                }`}
                              ></div>
                              <div className="absolute left-0 top-0 h-1 w-full bg-gray-300"></div>
                            </div>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                    {/* Buttons */}
                    <div className="mt-8 flex justify-between">
                      <button
                        onClick={()=> handlePrev(cita.Id_cita)}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md disabled:opacity-50"
                        disabled={(stepsState[cita.Id_cita] || 0) === 0}
                      >
                          <ChevronLeftIcon aria-hidden="true" className="h-6 w-6" />
                      </button>
                      <button
                        onClick={() => handleNext(cita.Id_cita)}
                        className="px-4 py-2 bg-slate-900 text-white rounded-md disabled:opacity-50"
                        disabled={(stepsState[cita.Id_cita] || 0) === steps.length - 1}
                      >
                        <ChevronRightIcon aria-hidden="true" className="h-6 w-6" />
                      </button>
                    </div>
                    </div>

                    {/*fin progressbar*/}
                      </div>
       
                    </div>
                  

                  </div>
            </article>
            ))}
              </div>)}
              </div>
            </div>
          </div>
        </div>)}

      {role === 'Administrador' && (
     <div id='Vista_administrdor' className="h-4/5 bg-gray-100">

     <div className="grid grid-cols-2 gap-6 py-10 ">
     <div className="bg-gray-700 border-solid border-1 border-slate-400 h-24  text-white text-center p-4 rounded">Dashboard</div>
     <div className="bg-gray-700 border-solid border-1 border-slate-400 h-24 text-white text-center p-4 rounded">Citas para hoy
      <p>
      {cantidadCitasHoy}
      </p>
     </div>
     <div className="bg-gray-700 border-solid border-1 border-slate-400 h-24 text-white text-center p-4 rounded">Item 3</div>
     <div className="bg-gray-700 border-solid border-1 border-slate-400 h-24 text-white text-center p-4 rounded">Item 4</div>
     </div>

     <div id="Actividades" className="h-96 w-full flex flex-col justify-between overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
<h1 className="sticky top-0 bg-white text-lg font-bold border-b"><strong>Actividades</strong></h1>
<ul className="divide-y divide-gray-100">
 {empleados.map((empleado) => (
   <li key={empleado.idEmpleado} className="flex justify-between gap-x-6 py-5">
     <div className="flex min-w-0 gap-x-4">
       <img alt="" src={empleado.Identidad} className="h-12 w-12 flex-none rounded-full bg-gray-50" />
       <div className="min-w-0 flex-auto">
         <p className="text-sm font-semibold text-gray-900">{empleado.Nombre}</p>
         <p className="mt-1 truncate text-xs text-gray-500">{empleado.Email}</p>
       </div>
     </div>
     <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
       <p className="text-sm text-gray-900">Ultima vez</p>
       {empleado.Identidad ? (
         <p className="mt-1 text-xs text-gray-500">
          {/* Last seen <time dateTime={empleado.lastSeenDateTime}>{empleado.lastSeen}</time>*/} 
         </p>
       ) : (
         <div className="mt-1 flex items-center gap-x-1.5">
           <div className="flex-none rounded-full bg-emerald-500/20 p-1">
             <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
           </div>
           <p className="text-xs text-gray-500">Online</p>
         </div>
       )}
     </div>
   </li>
 ))}
</ul>
</div>


   </div>
   )}
   </div>
 </div>
      
  );
};

export default Home;
