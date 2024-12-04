import { TrashIcon, PlusIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import {  Popover, PopoverButton, PopoverPanel  } from '@headlessui/react'
import {ChevronLeftIcon, ChevronUpIcon, ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/20/solid'
import { WrenchScrewdriverIcon, ArrowPathRoundedSquareIcon ,NoSymbolIcon,Cog8ToothIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import React, { useEffect, useState } from 'react';
 // Asegúrate de tener este icono

const Facturas = () => {
    const [facturas, setFacturas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFactura, setSelectedFactura] = useState(null); // Para almacenar la factura seleccionada
    const [showModal, setShowModal] = useState(false); // Para controlar el estado del modal
    const [facturaError, setFacturaError] = useState(null); // Para mostrar errores

    useEffect(() => {
        const idEmpleado = localStorage.getItem('idEmpleados');
        const rol = localStorage.getItem('role');

        if (!idEmpleado || !rol) {
            console.error('No se encontró el idEmpleado o el rol en el localStorage');
            return;
        }

        let url;
        if (rol === 'Administrador') {
            url = `http://localhost:5000/factura/admin/${idEmpleado}`;
        } else if (rol === 'Mecanico') {
            url = `http://localhost:5000/factura/mecanico/${idEmpleado}`;
        } else {
            console.error('Rol desconocido');
            return;
        }

        const fetchFacturas = async () => {
            try {
                const response = await fetch(url);
                const data = await response.json();

                if (response.ok) {
                    setFacturas(data.datosFacturas);
                } else {
                    setFacturaError(data.message); // Mostrar error si lo hay
                }
            } catch (error) {
                setFacturaError('Error al hacer la solicitud: ' + error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFacturas();
    }, []);

    const openModal = (factura) => {
        setSelectedFactura(factura);
        setShowModal(true); // Abrir el modal
    };

    const closeModal = () => {
        setShowModal(false); // Cerrar el modal
        setSelectedFactura(null); // Limpiar la factura seleccionada
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Facturas Generadas</h2>
            {facturaError && <p style={{ color: 'red' }}>{facturaError}</p>}
            {facturas.length === 0 ? (
                <p>No se encontraron facturas.</p>
            ) : (
                <table className="min-w-full table-auto border-collapse">
                    <thead>
                        <tr>
                            <th className="border px-4 py-2">Cliente</th>
                            <th className="border px-4 py-2">Empleado</th>
                            <th className="border px-4 py-2">Total</th>
                            <th className="border px-4 py-2">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {facturas.map((factura) => (
                            <tr key={factura.Id_cita}>
                                <td className="border px-4 py-2">
                                    {factura.cliente.NombreCliente} {factura.cliente.ApellidoCliente}
                                </td>
                                <td className="border px-4 py-2">
                                    {factura.empleado.NombreEmpleado} {factura.empleado.ApellidoEmpleado}
                                </td>
                                <td className="border px-4 py-2">{factura.Total}</td>
                                <td className="border px-4 py-2">
                                    <button
                                        className="text-blue-500"
                                        onClick={() => openModal(factura)}
                                    >
                                        Ver Cita
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Modal de la factura */}
            {showModal && selectedFactura && (
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
                        className="modal-content p-11 py-5 h-full w-1/2 flex flex-col justify-between overflow-y-auto scrollbar-thin max-w-full"
                        style={{
                            backgroundColor: 'white',
                            borderRadius: '8px',
                            margin: 'auto',
                        }}
                    >
                        {/* Botón para cerrar el modal */}
                        <div className="flex items-baseline justify-between">
                            <h2 className="text-2xl">Factura</h2>
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 text-black rounded-md mt-4"
                            >
                                <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                            </button>
                        </div>
                        <p><strong>Fecha:</strong> {new Date(selectedFactura.Fecha).toLocaleString()}</p>
                        <div className="flex justify-between">
                            <div>
                                <div className="mt-4">
                                    <p><strong>No. Factura:</strong> {selectedFactura.Id_cita}</p>
                                    <p><strong>Empleado:</strong> {selectedFactura.empleado.NombreEmpleado} {selectedFactura.empleado.ApellidoEmpleado}</p>
                                </div>
                            </div>
                            <div className="mt-4">
                                <p><strong>Cliente:</strong> {selectedFactura.cliente.NombreCliente} {selectedFactura.cliente.ApellidoCliente}</p>
                                <p><strong>Identidad:</strong> {selectedFactura.cliente.IdentidadCliente}</p>
                            </div>
                        </div>

                        {/* Tabla de servicios */}
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold">Servicios</h3>
                            {selectedFactura.servicios && selectedFactura.servicios.length > 0 ? (
                                <table className="table-auto w-full text-xs">
                                    <thead className="border-b-2 border-zinc-600 ">
                                        <tr>
                                            <th className="text-center p-2">Servicio</th>
                                            <th className="text-center p-2">Precio</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedFactura.servicios.map((servicio, index) => (
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
                            {selectedFactura.repuestos && selectedFactura.repuestos.length > 0 ? (
                                <table className="table-auto w-full text-xs">
                                    <thead className="border-b-2 border-zinc-600 ">
                                        <tr>
                                            <th className="text-center p-2">Repuesto</th>
                                            <th className="text-center p-2">Cantidad</th>
                                            <th className="text-center p-2">Precio Unitario</th>
                                            <th className="text-center p-2">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedFactura.repuestos.map((repuesto, index) => (
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

                        {/* Totales */}
                        <div className="flex justify-between">
                            <div><p>Dirección del taller</p></div>
                            <div>
                                <p><strong>Subtotal:</strong> {selectedFactura.Subtotal}</p>
                                <p><strong>Impuesto:</strong> {selectedFactura.Impuesto}</p>
                                <p><strong>Total:</strong> {selectedFactura.Total}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Facturas;

