
import React, { useState } from 'react';

const escenarios = {
  lectura: {
    nombre: 'Lectura de un archivo',
    descripcion: 'Una aplicación solicita leer información almacenada en un archivo.',
    pasos: [
      {
        modo: 'USUARIO',
        titulo: 'Aplicación en ejecución',
        detalle: 'La aplicación necesita consultar el contenido de un archivo.',
        evento: 'La aplicación prepara la operación de lectura.',
      },
      {
        modo: 'USUARIO',
        titulo: 'Solicitud de lectura',
        detalle: 'La aplicación utiliza una función como read() para solicitar datos.',
        evento: 'Se prepara la llamada al sistema read().',
      },
      {
        modo: 'NUCLEO',
        titulo: 'Transición al modo núcleo',
        detalle: 'El procesador entra al modo privilegiado mediante el mecanismo de llamada al sistema.',
        evento: 'El control pasa al kernel.',
      },
      {
        modo: 'NUCLEO',
        titulo: 'Validación de la solicitud',
        detalle: 'El kernel verifica el descriptor del archivo y los permisos de acceso correspondientes.',
        evento: 'El kernel valida la operación solicitada.',
      },
      {
        modo: 'NUCLEO',
        titulo: 'Lectura de información',
        detalle: 'El kernel obtiene los datos mediante los mecanismos del sistema de archivos.',
        evento: 'Se procesa la lectura del archivo.',
      },
      {
        modo: 'USUARIO',
        titulo: 'Retorno a la aplicación',
        detalle: 'La llamada finaliza y la aplicación recibe los datos o un resultado de error.',
        evento: 'El control regresa al modo usuario.',
      },
    ],
  },

  proceso: {
    nombre: 'Creación de un proceso',
    descripcion: 'Una aplicación solicita crear un proceso mediante servicios del sistema operativo.',
    pasos: [
      {
        modo: 'USUARIO',
        titulo: 'Programa en ejecución',
        detalle: 'Un programa necesita iniciar un nuevo proceso.',
        evento: 'El programa prepara la solicitud.',
      },
      {
        modo: 'USUARIO',
        titulo: 'Invocación de fork()',
        detalle: 'En un sistema tipo UNIX, el programa invoca fork() para solicitar la creación de un proceso hijo.',
        evento: 'Se invoca fork().',
      },
      {
        modo: 'NUCLEO',
        titulo: 'Entrada al kernel',
        detalle: 'El procesador cambia al modo núcleo para atender la llamada.',
        evento: 'El kernel recibe la solicitud de creación.',
      },
      {
        modo: 'NUCLEO',
        titulo: 'Creación del proceso',
        detalle: 'El sistema operativo prepara las estructuras y recursos necesarios para el proceso hijo.',
        evento: 'Se crea el proceso hijo.',
      },
      {
        modo: 'NUCLEO',
        titulo: 'Preparación para ejecución',
        detalle: 'El nuevo proceso queda disponible para ser planificado por el sistema operativo.',
        evento: 'El proceso hijo queda preparado.',
      },
      {
        modo: 'USUARIO',
        titulo: 'Retorno de fork()',
        detalle: 'Padre e hijo continúan su ejecución desde el retorno de fork(), con valores de retorno diferentes.',
        evento: 'La ejecución continúa en modo usuario.',
      },
    ],
  },

  proteccion: {
    nombre: 'Acceso no autorizado',
    descripcion: 'Una aplicación intenta ejecutar directamente una instrucción privilegiada.',
    pasos: [
      {
        modo: 'USUARIO',
        titulo: 'Aplicación en modo usuario',
        detalle: 'La aplicación se ejecuta con privilegios restringidos.',
        evento: 'El programa está funcionando normalmente.',
      },
      {
        modo: 'USUARIO',
        titulo: 'Intento de operación privilegiada',
        detalle: 'El programa intenta ejecutar una instrucción reservada para el modo núcleo.',
        evento: 'Se detecta un intento de operación privilegiada.',
      },
      {
        modo: 'NUCLEO',
        titulo: 'Excepción de protección',
        detalle: 'El procesador genera una excepción y transfiere el control al kernel para que la gestione.',
        evento: 'El hardware activa el mecanismo de protección.',
      },
      {
        modo: 'NUCLEO',
        titulo: 'Gestión de la excepción',
        detalle: 'El sistema operativo identifica la operación inválida y determina cómo responder.',
        evento: 'El kernel procesa la excepción.',
      },
      {
        modo: 'NUCLEO',
        titulo: 'Operación rechazada',
        detalle: 'La instrucción privilegiada no se ejecuta. El sistema puede finalizar el proceso responsable.',
        evento: 'El acceso directo queda bloqueado.',
      },
    ],
  },
};

const estilos = {
  contenedor: {
    border: '1px solid var(--ifm-color-emphasis-300)',
    borderRadius: 12,
    padding: 20,
    marginTop: 24,
    marginBottom: 24,
    background: 'var(--ifm-background-surface-color)',
  },
  panel: {
    border: '1px solid var(--ifm-color-emphasis-300)',
    borderRadius: 10,
    padding: 16,
    marginTop: 14,
  },
  boton: {
    padding: '10px 16px',
    borderRadius: 8,
    border: '1px solid var(--ifm-color-emphasis-400)',
    cursor: 'pointer',
    fontWeight: 600,
  },
};

export default function SimuladorLlamadasSistema() {
  const [escenario, setEscenario] = useState('lectura');
  const [indice, setIndice] = useState(0);

  const datos = escenarios[escenario];
  const paso = datos.pasos[indice];
  const terminado = indice === datos.pasos.length - 1;

  const cambiarEscenario = (valor) => {
    setEscenario(valor);
    setIndice(0);
  };

  const avanzar = () => {
    setIndice((actual) =>
      Math.min(actual + 1, datos.pasos.length - 1)
    );
  };

  const reiniciar = () => {
    setIndice(0);
  };

  const esNucleo = paso.modo === 'NUCLEO';

  return (
    <div style={estilos.contenedor}>
      <h3>Simulador de Llamadas al Sistema</h3>

      <p>
        Observa cómo una aplicación interactúa con el kernel
        y cómo el sistema operativo protege sus recursos.
      </p>

      <label htmlFor="escenario-syscall">
        <strong>Selecciona un escenario:</strong>
      </label>

      <select
        id="escenario-syscall"
        value={escenario}
        onChange={(e) => cambiarEscenario(e.target.value)}
        style={{
          width: '100%',
          padding: 10,
          marginTop: 8,
          borderRadius: 8,
          background: 'var(--ifm-background-color)',
          color: 'var(--ifm-font-color-base)',
          border: '1px solid var(--ifm-color-emphasis-400)',
        }}
      >
        {Object.entries(escenarios).map(([clave, valor]) => (
          <option key={clave} value={clave}>
            {valor.nombre}
          </option>
        ))}
      </select>

      <p style={{ marginTop: 14 }}>{datos.descripcion}</p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 12,
          marginTop: 16,
        }}
      >
        <div
          style={{
            ...estilos.panel,
            marginTop: 0,
            background: !esNucleo
              ? 'rgba(24, 144, 255, 0.12)'
              : 'transparent',
            borderColor: !esNucleo
              ? 'var(--ifm-color-primary)'
              : 'var(--ifm-color-emphasis-300)',
          }}
        >
          <strong>Modo usuario</strong>
          <p>Aplicación y funciones de biblioteca</p>
          <strong>{!esNucleo ? 'ACTIVO' : 'EN ESPERA'}</strong>
        </div>

        <div
          style={{
            ...estilos.panel,
            marginTop: 0,
            background: esNucleo
              ? 'rgba(255, 152, 0, 0.12)'
              : 'transparent',
            borderColor: esNucleo
              ? 'var(--ifm-color-warning)'
              : 'var(--ifm-color-emphasis-300)',
          }}
        >
          <strong>Modo núcleo</strong>
          <p>Kernel y servicios privilegiados</p>
          <strong>{esNucleo ? 'ACTIVO' : 'EN ESPERA'}</strong>
        </div>
      </div>

      <div style={estilos.panel} aria-live="polite">
        <p>
          <strong>
            Paso {indice + 1} de {datos.pasos.length}
          </strong>
        </p>

        <h4>{paso.titulo}</h4>
        <p>{paso.detalle}</p>

        <p>
          <strong>Modo actual: </strong>
          {esNucleo ? 'NÚCLEO' : 'USUARIO'}
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 10,
          marginTop: 16,
        }}
      >
        <button
          type="button"
          onClick={avanzar}
          disabled={terminado}
          style={{
            ...estilos.boton,
            background: 'var(--ifm-color-primary)',
            color: '#ffffff',
            opacity: terminado ? 0.5 : 1,
          }}
        >
          Siguiente paso
        </button>

        <button
          type="button"
          onClick={reiniciar}
          style={{
            ...estilos.boton,
            background: 'var(--ifm-background-color)',
            color: '#dc3333',
          }}
        >
          Reiniciar simulación
        </button>
      </div>

      <div style={estilos.panel}>
        <h4>Registro de eventos</h4>

        <ol>
          {datos.pasos.slice(0, indice + 1).map((item, i) => (
            <li key={`${escenario}-${i}`}>
              {item.evento}
            </li>
          ))}
        </ol>
      </div>

      {terminado && (
        <div
          style={{
            ...estilos.panel,
            borderLeft: '5px solid var(--ifm-color-primary)',
          }}
        >
          <strong>Resultado del escenario</strong>

          <p>
            {escenario === 'lectura'
              ? 'La solicitud de lectura fue atendida y el control regresó a la aplicación.'
              : escenario === 'proceso'
              ? 'El sistema operativo creó un proceso hijo y permitió continuar la ejecución.'
              : 'El mecanismo de protección impidió ejecutar una instrucción privilegiada desde modo usuario.'}
          </p>
        </div>
      )}
    </div>
  );
}
