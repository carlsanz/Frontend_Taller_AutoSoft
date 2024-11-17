import { Disclosure,  Menu } from '@headlessui/react'
import {  Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Modal from 'react-modal';
import logo from './styles/pictures/logo.PNG';
import { Link, useNavigate, useLocation  } from 'react-router-dom';
Modal.setAppElement('#root'); 

const Nav = () => {

    const navigation = [
        { name: 'Home', ruta: "/home" },
        { name: 'Citas', ruta: "/citas", rol: ['Administrador'] },
        { name: 'Servicios', ruta: "/servicios", rol: ['Administrador','Mecanico'] },
        { name: 'Inventario', ruta: "/inventario", rol: ['Administrador']},
        { name: 'Repuestos', ruta: "/repuestos", rol: ['Mecanico']},
        { name: 'Empleados', ruta: "/agregar-usuario", rol: ['Administrador'] },
        { name: 'Autos', ruta: "/autos", rol: ['Administrador','Mecanico'] },
        { name: 'Clientes', ruta: "/clientes", rol: ['Administrador','Mecanico']  },
    ];

    const role = localStorage.getItem('role') || '';

    const filteredNavigation = navigation.filter(
        (item) => !item.rol || item.rol.includes(role)
    );
    


    const navigate = useNavigate();
    const location = useLocation();

    function classNames(...classes) {
        return classes.filter(Boolean).join(' ');
    }

    const isLoginPage = location.pathname === '/';

    return (
        <div className="fixed top-0 z-50 ">
            {!isLoginPage && (
            <Disclosure as="nav" className="bg-gray-800 w-full top-0 fixed">
                {({ open }) => (
                    <>
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="relative flex h-16 items-center justify-between">
                                {/* Botón de menú móvil */}
                                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                                    <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                        <span className="sr-only">Open main menu</span>
                                        {open ? (
                                            <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                                        ) : (
                                            <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                                        )}
                                    </Disclosure.Button>
                                </div>
                                <div className="flex items-center justify-center sm:items-stretch sm:justify-start">
                                    <div className="flex-shrink-0">
                                        <img className="h-10 w-auto" src={logo} alt="Your Company" />
                                    </div>
                                    <div className="hidden sm:block sm:ml-6">
                                        <div className="flex space-x-4">
                                            {filteredNavigation.map((item) => (
                                                <button
                                                    key={item.name}
                                                    onClick={() => navigate(item.ruta)}
                                                    className={classNames(
                                                        'text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium'
                                                    )}
                                                >
                                                    {item.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                   

                                </div>
                                <div className="flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                                    <button
                                        type="button"
                                        className="bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                                    >
                                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                                    </button>
                                    <Menu as="div" className="ml-3 relative">
                                        <div>
                                            <Menu.Button className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                                                <img
                                                    className="h-8 w-8 rounded-full"
                                                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                                    alt=""
                                                />
                                            </Menu.Button>
                                        </div>
                                        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <Link
                                                        to="/cambiar-contraseña"
                                                        className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                                                    >
                                                        Cambiar contraseña
                                                    </Link>
                                                )}
                                            </Menu.Item>
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <button
                                                        onClick={() => navigate("/")}
                                                        className={classNames(active ? 'bg-gray-100' : '', 'block w-full text-left px-4 py-2 text-sm text-gray-700')}
                                                    >
                                                        Salir
                                                    </button>
                                                )}
                                            </Menu.Item>
                                        </Menu.Items>
                                    </Menu>
                                </div>
                            </div>
                        </div>

                        {/* Menú desplegable en vista móvil */}
                        <Disclosure.Panel className="sm:hidden">
                            <div className="px-2 pt-2 pb-3 space-y-1">
                                {navigation.map((item) => (
                                    <Disclosure.Button
                                        key={item.name}
                                        as="button"
                                        onClick={() => navigate(item.ruta)}
                                        className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                                    >
                                        {item.name}
                                    </Disclosure.Button>
                                ))}
                            </div>
                        </Disclosure.Panel>
                    </>
                )}
            </Disclosure>
            )}

        </div>
    );
};

export default Nav;
