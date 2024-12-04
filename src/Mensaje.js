import React, { useEffect } from 'react';

const Mensaje = ({ mensaje, tipo, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(); // Cierra el mensaje automáticamente después de 3 segundos
    }, 3000);

    return () => clearTimeout(timer); // Limpia el temporizador al desmontar
  }, [mensaje, onClose]);

  if (!mensaje) return null; // Si no hay mensaje, no renderiza nada

  // Define íconos según el tipo de mensaje
  const Icono =
    tipo === 'success' ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-green-800"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M5 13l4 4L19 7"
        />
      </svg>
    ) : tipo === 'error' ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-red-800"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    ) : tipo === 'alert' ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-yellow-800"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 16h-1v-4h-1m0-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
        />
      </svg>
    ) : null;

  return (
    <div
      className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 p-4 rounded-lg shadow-lg text-center max-w-sm w-full flex items-center gap-4 ${
        tipo === 'success'
          ? ' bg-white  text-green-800 border border-green-300'
          : tipo === 'error'
          ? ' bg-white text-red-800 border border-red-300'
          : tipo === 'alert'
          ? ' bg-white text-yellow-800 border border-yellow-300'
          : ''
      }`}
    >
      {Icono}
      <span>{mensaje}</span>
    </div>
  );
};

export default Mensaje;
