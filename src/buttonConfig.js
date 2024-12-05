// buttonConfig.js
export const buttonConfig = {
    '/home': {
      Mecanico: [
        { label: 'Revisar Vehículos', action: () => {/* acción para este botón */} },
        { label: 'Registrar Incidencia', action: () => {/* acción para este botón */} }
      ],
      Administrador: [
        { label: 'Gestionar Usuarios', action: () => {/* acción para este botón */} },
        { label: 'Ver Reportes', action: () => {/* acción para este botón */} }
      ]
    },
    '/about': {
      Mecanico: [
        { label: 'Historial de Revisiones', action: () => {/* acción */} }
      ],
      Administrador: [
        { label: 'Configurar Parámetros', action: () => {/* acción */} }
      ]
    }
    // Agrega más rutas y botones según sea necesario
  };
  