import { Disclosure,  Menu,  Popover, PopoverButton, PopoverPanel  } from '@headlessui/react'
import { ChevronDownIcon, PhoneIcon, PlayCircleIcon } from '@heroicons/react/20/solid'
import { ChartPieIcon, CursorArrowRaysIcon,FingerPrintIcon,SquaresPlusIcon, ArrowPathIcon, Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Modal from 'react-modal';
import logo from './styles/pictures/logo.PNG';
import { Link, useNavigate, useLocation  } from 'react-router-dom';
Modal.setAppElement('#root'); 

const Nav = () => {

    const navigation = [
        { name: 'Home', ruta: "/home" },
        { name: 'Citas', ruta: "/citas", rol: ['Administrador','Mecanico'] },
        { name: 'Servicios', ruta: "/servicios", rol: ['Administrador','Mecanico'] },
        { name: 'Inventario', ruta: "/inventario", rol: ['Administrador']},
        { name: 'Repuestos', ruta: "/repuestos", rol: ['Administrador', 'Mecanico']},
        { name: 'Empleados', ruta: "/agregar-usuario", rol: ['Administrador'] },
        { name: 'Autos', ruta: "/autos", rol: ['Administrador','Mecanico'] },
        { name: 'Clientes', ruta: "/clientes", rol: ['Administrador','Mecanico']  },
    ];

    const role = localStorage.getItem('role') || '';
    console.log(localStorage.getItem('role'))

    const filteredNavigation = navigation.filter(
        (item) => !item.rol || item.rol.includes(role)
    );
    

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
