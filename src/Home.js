import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import React from 'react';

const Home = () => {
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
    <div style={{ width: '100vw', overflowX: 'hidden' }} className="flex-col h-screen">
      <div className="-z-10 bg-gray-100 min-h-full relative max-w-full">
        {/* Imagen de fondo */}
        <img className="relative h-96 w-full m-0 p-0" src="image/vehiculo.jpg" alt="vehículo" />

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
            type="button"
            className="w-11 h-11 mx-2 flex items-center justify-center rounded-md bg-amber-500 text-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
          >
            <PlusIcon aria-hidden="true" className="h-6 w-6" />
          </button>
        </div>

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
      </div>
    </div>
  );
};

export default Home;
