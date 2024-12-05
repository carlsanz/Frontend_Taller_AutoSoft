import React, { useEffect } from 'react';

const Mensaje = ({ mensaje, tipo, onClose, onConfirm }) => {
  useEffect(() => {
    if (tipo !== 'confirm') {
      const timer = setTimeout(() => {
        onClose(); // Cierra automáticamente después de 3 segundos si no es confirmación
      }, 3000);

      return () => clearTimeout(timer); // Limpia el temporizador al desmontar
    }
  }, [mensaje, tipo, onClose]);

  if (!mensaje) return null; // Si no hay mensaje, no renderiza nada

  // Define íconos según el tipo de mensaje
  const Icono = (() => {
    switch (tipo) {
      case 'success':
        return (
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
        );
      case 'error':
        return (
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
        );
      case 'alert':
        return (
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
        );
      case 'confirm':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-blue-800"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12h6m2 0a8 8 0 11-16 0 8 8 0 0116 0z"
            />
          </svg>
        );
      default:
        return null;
    }
  })();

  return (
    <div
      className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 p-4 rounded-lg shadow-lg text-center max-w-sm w-full flex flex-col items-center gap-4 ${
        tipo === 'success'
          ? 'bg-white text-green-800 border border-green-300'
          : tipo === 'error'
          ? 'bg-white text-red-800 border border-red-300'
          : tipo === 'alert'
          ? 'bg-white text-yellow-800 border border-yellow-300'
          : tipo === 'confirm'
          ? 'bg-white text-blue-800 border border-blue-300'
          : ''
      }`}
    >
      {Icono}
      <span>{mensaje}</span>
      {tipo === 'confirm' && (
        <div className="flex gap-2 mt-2">
          <button
            className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
            onClick={onConfirm}
          >
            Confirmar
          </button>
          <button
            className="bg-gray-300 text-black px-4 py-1 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
};

export default Mensaje;
