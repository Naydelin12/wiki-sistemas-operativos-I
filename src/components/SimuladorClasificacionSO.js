
import React, { useState } from 'react';

const clasificaciones = {
  arquitectura: {
    titulo: 'Arquitecturas del Kernel',
    descripcion:
      'Compara cómo se organizan los servicios dentro del núcleo del sistema operativo.',
    opciones: [
      {
        id: 'monolitico',
        nombre: 'Kernel monolítico',
        descripcion:
          'Integra numerosos servicios del sistema operativo dentro del espacio del núcleo.',
        caracteristicas: [
          'Comunicación interna rápida entre componentes.',
          'Los controladores pueden ejecutarse en modo núcleo.',
          'Un fallo en un componente privilegiado puede afectar al sistema completo.',
        ],
        ejemplos: 'Linux y FreeBSD',
      },
      {
        id: 'microkernel',
        nombre: 'Microkernel',
        descripcion:
          'Mantiene funciones esenciales en el núcleo y ejecuta otros servicios en espacio de usuario.',
        caracteristicas: [
          'Favorece el aislamiento entre servicios.',
          'Puede facilitar la recuperación ante fallos de controladores.',
          'La comunicación entre componentes puede introducir sobrecarga.',
        ],
        ejemplos: 'MINIX 3 y QNX',
      },
      {
        id: 'hibrido',
        nombre: 'Kernel híbrido',
        descripcion:
          'Combina elementos de diferentes arquitecturas para equilibrar rendimiento y modularidad.',
        caracteristicas: [
          'Mantiene diversos servicios en modo núcleo.',
          'Utiliza una organización modular.',
          'Busca equilibrar rendimiento, compatibilidad y mantenimiento.',
        ],
        ejemplos: 'Windows NT y macOS (XNU)',
      },
    ],
  },

  administracion: {
    titulo: 'Administración de Tareas y Usuarios',
    descripcion:
      'Explora cómo los sistemas operativos administran tareas, usuarios y procesadores.',
    opciones: [
      {
        id: 'monotarea',
        nombre: 'Monotarea',
        descripcion:
          'Sistema diseñado para ejecutar una tarea principal a la vez.',
        caracteristicas: [
          'Modelo de ejecución sencillo.',
          'Capacidad limitada para alternar entre aplicaciones.',
          'Característico de algunos sistemas antiguos.',
        ],
        ejemplos: 'MS-DOS',
      },
      {
        id: 'multitarea',
        nombre: 'Multitarea',
        descripcion:
          'Permite gestionar varias tareas mediante planificación del procesador.',
        caracteristicas: [
          'Alterna la ejecución de diferentes procesos.',
          'Mejora la capacidad de respuesta.',
          'Puede aprovechar varios núcleos de procesamiento.',
        ],
        ejemplos: 'Windows, Linux y macOS',
      },
      {
        id: 'monousuario',
        nombre: 'Monousuario',
        descripcion:
          'Está orientado a atender a un usuario a la vez.',
        caracteristicas: [
          'Administración de usuarios sencilla.',
          'Puede ejecutar una o varias tareas.',
          'No implica necesariamente que sea monotarea.',
        ],
        ejemplos: 'MS-DOS',
      },
      {
        id: 'multiusuario',
        nombre: 'Multiusuario',
        descripcion:
          'Permite que varios usuarios utilicen los servicios del sistema.',
        caracteristicas: [
          'Gestiona cuentas y permisos.',
          'Protege los recursos de cada usuario.',
          'Permite sesiones simultáneas.',
        ],
        ejemplos: 'UNIX y Linux',
      },
      {
        id: 'monoprocesador',
        nombre: 'Monoprocesador',
        descripcion:
          'Sistema que utiliza una sola unidad de procesamiento para ejecutar instrucciones.',
        caracteristicas: [
          'Un solo procesador ejecuta instrucciones en cada instante.',
          'Puede utilizar planificación multitarea.',
          'No requiere múltiples procesadores.',
        ],
        ejemplos: 'Computadoras tradicionales con una CPU de un solo núcleo',
      },
      {
        id: 'multiprocesador',
        nombre: 'Multiprocesador',
        descripcion:
          'Sistema capaz de utilizar múltiples procesadores o núcleos.',
        caracteristicas: [
          'Permite ejecución paralela.',
          'Distribuye tareas entre unidades de procesamiento.',
          'Requiere coordinación y planificación.',
        ],
        ejemplos: 'Linux y Windows en equipos multinúcleo',
      },
    ],
  },

  proposito: {
    titulo: 'Tipos de Sistemas Operativos',
    descripcion:
      'Identifica sistemas según su organización y el entorno donde se utilizan.',
    opciones: [
      {
        id: 'centralizado',
        nombre: 'Centralizado',
        descripcion:
          'Administra los recursos de una computadora o sistema central.',
        caracteristicas: [
          'La administración principal se concentra en un sistema.',
          'Los procesos utilizan los recursos disponibles en ese equipo.',
          'Puede ofrecer servicios a terminales o clientes.',
        ],
        ejemplos: 'Sistemas de un servidor central',
      },
      {
        id: 'distribuido',
        nombre: 'Distribuido',
        descripcion:
          'Coordina varias computadoras conectadas para ofrecer servicios de forma integrada.',
        caracteristicas: [
          'Utiliza recursos de diferentes equipos.',
          'Requiere comunicación por red.',
          'Puede proporcionar transparencia en el acceso a recursos.',
        ],
        ejemplos: 'Amoeba y Plan 9',
      },
      {
        id: 'embebido',
        nombre: 'Embebido',
        descripcion:
          'Está diseñado para controlar dispositivos con funciones específicas.',
        caracteristicas: [
          'Se adapta a recursos limitados.',
          'Se integra en dispositivos electrónicos.',
          'Puede optimizar consumo energético y memoria.',
        ],
        ejemplos: 'FreeRTOS y Embedded Linux',
      },
      {
        id: 'tiemporeal',
        nombre: 'Tiempo real',
        descripcion:
          'Está diseñado para responder a determinados eventos dentro de límites temporales definidos.',
        caracteristicas: [
          'Prioriza el cumplimiento de plazos.',
          'Puede utilizar planificación basada en prioridades.',
          'Se emplea en aplicaciones de control y automatización.',
        ],
        ejemplos: 'QNX, VxWorks y FreeRTOS',
      },
    ],
  },
};

const preguntas = [
  {
    pregunta:
      '¿Qué arquitectura mantiene numerosos servicios dentro del espacio del núcleo?',
    opciones: [
      'Microkernel',
      'Kernel monolítico',
      'Sistema distribuido',
    ],
    correcta: 1,
    explicacion:
      'El kernel monolítico ejecuta numerosos servicios en el espacio privilegiado del núcleo.',
  },
  {
    pregunta:
      '¿Qué tipo de sistema permite gestionar varias tareas?',
    opciones: [
      'Monotarea',
      'Monousuario',
      'Multitarea',
    ],
    correcta: 2,
    explicacion:
      'La multitarea permite administrar diferentes tareas mediante la planificación del procesador.',
  },
  {
    pregunta:
      '¿Qué tipo de sistema coordina varias computadoras conectadas?',
    opciones: [
      'Distribuido',
      'Centralizado',
      'Monoprocesador',
    ],
    correcta: 0,
    explicacion:
      'Un sistema distribuido coordina recursos y servicios de diferentes computadoras.',
  },
  {
    pregunta:
      '¿Qué característica distingue a un sistema operativo de tiempo real?',
    opciones: [
      'Siempre utiliza una interfaz gráfica',
      'Cumple límites temporales definidos',
      'Solo permite un usuario',
    ],
    correcta: 1,
    explicacion:
      'En los sistemas de tiempo real es fundamental responder dentro de los plazos establecidos.',
  },
];

const panel = {
  border: '1px solid var(--ifm-color-emphasis-300)',
  borderRadius: 10,
  padding: 16,
  marginTop: 14,
};

const boton = {
  padding: '10px 14px',
  borderRadius: 8,
  cursor: 'pointer',
  border: '1px solid var(--ifm-color-emphasis-400)',
  background: 'var(--ifm-background-color)',
  color: 'var(--ifm-font-color-base)',
  fontWeight: 600,
};

export default function SimuladorClasificacionSO() {
  const [categoria, setCategoria] = useState('arquitectura');
  const [seleccion, setSeleccion] = useState('monolitico');
  const [comparacion, setComparacion] = useState(false);
  const [indicePregunta, setIndicePregunta] = useState(0);
  const [respuesta, setRespuesta] = useState(null);
  const [aciertos, setAciertos] = useState(0);

  const datos = clasificaciones[categoria];

  const actual = datos.opciones.find(
    (opcion) => opcion.id === seleccion
  ) || datos.opciones[0];

  const pregunta = preguntas[indicePregunta];
  const finalizado = indicePregunta === preguntas.length - 1;

  const cambiarCategoria = (nuevaCategoria) => {
    setCategoria(nuevaCategoria);
    setSeleccion(clasificaciones[nuevaCategoria].opciones[0].id);
    setComparacion(false);
  };

  const responder = (indice) => {
    if (respuesta !== null) return;

    setRespuesta(indice);

    if (indice === pregunta.correcta) {
      setAciertos((valor) => valor + 1);
    }
  };

  const siguientePregunta = () => {
    if (finalizado) return;
    setIndicePregunta((valor) => valor + 1);
    setRespuesta(null);
  };

  const reiniciarEvaluacion = () => {
    setIndicePregunta(0);
    setRespuesta(null);
    setAciertos(0);
  };

  return (
    <div
      style={{
        ...panel,
        marginTop: 24,
        marginBottom: 24,
        background: 'var(--ifm-background-surface-color)',
      }}
    >
      <h3>Simulador de Clasificación de Sistemas Operativos</h3>

      <p>
        Explora las características de diferentes sistemas
        operativos y comprueba tus conocimientos.
      </p>

      <div style={panel}>
        <label htmlFor="categoria-so">
          <strong>Selecciona una categoría:</strong>
        </label>

        <select
          id="categoria-so"
          value={categoria}
          onChange={(e) => cambiarCategoria(e.target.value)}
          style={{
            display: 'block',
            width: '100%',
            padding: 10,
            marginTop: 8,
            borderRadius: 8,
            background: 'var(--ifm-background-color)',
            color: 'var(--ifm-font-color-base)',
            border: '1px solid var(--ifm-color-emphasis-400)',
          }}
        >
          {Object.entries(clasificaciones).map(([clave, valor]) => (
            <option key={clave} value={clave}>
              {valor.titulo}
            </option>
          ))}
        </select>

        <p style={{ marginTop: 14 }}>{datos.descripcion}</p>

        <label htmlFor="tipo-so">
          <strong>Selecciona un tipo:</strong>
        </label>

        <select
          id="tipo-so"
          value={actual.id}
          onChange={(e) => {
            setSeleccion(e.target.value);
            setComparacion(false);
          }}
          style={{
            display: 'block',
            width: '100%',
            padding: 10,
            marginTop: 8,
            borderRadius: 8,
            background: 'var(--ifm-background-color)',
            color: 'var(--ifm-font-color-base)',
            border: '1px solid var(--ifm-color-emphasis-400)',
          }}
        >
          {datos.opciones.map((opcion) => (
            <option key={opcion.id} value={opcion.id}>
              {opcion.nombre}
            </option>
          ))}
        </select>
      </div>

      <div style={panel} aria-live="polite">
        <h4>{actual.nombre}</h4>
        <p>{actual.descripcion}</p>

        <strong>Características principales:</strong>

        <ul>
          {actual.caracteristicas.map((caracteristica, i) => (
            <li key={i}>{caracteristica}</li>
          ))}
        </ul>

        <p>
          <strong>Ejemplos: </strong>
          {actual.ejemplos}
        </p>
      </div>

      <div style={{ marginTop: 14 }}>
        <button
          type="button"
          style={boton}
          onClick={() => setComparacion((valor) => !valor)}
        >
          {comparacion
            ? 'Ocultar comparación'
            : 'Comparar todos los tipos'}
        </button>
      </div>

      {comparacion && (
        <div style={{ ...panel, overflowX: 'auto' }}>
          <h4>Comparación de la categoría</h4>

          <table>
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Descripción</th>
                <th>Ejemplos</th>
              </tr>
            </thead>

            <tbody>
              {datos.opciones.map((opcion) => (
                <tr key={opcion.id}>
                  <td>{opcion.nombre}</td>
                  <td>{opcion.descripcion}</td>
                  <td>{opcion.ejemplos}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={panel}>
        <h3>Comprueba tus conocimientos</h3>

        <p>
          <strong>
            Pregunta {indicePregunta + 1} de {preguntas.length}
          </strong>
        </p>

        <h4>{pregunta.pregunta}</h4>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          {pregunta.opciones.map((opcion, i) => (
            <button
              key={`${indicePregunta}-${i}`}
              type="button"
              disabled={respuesta !== null}
              onClick={() => responder(i)}
              style={{
                ...boton,
                textAlign: 'left',
                opacity:
                  respuesta !== null &&
                  i !== respuesta &&
                  i !== pregunta.correcta
                    ? 0.65
                    : 1,
                borderColor:
                  respuesta !== null && i === pregunta.correcta
                    ? 'var(--ifm-color-success)'
                    : respuesta === i &&
                      i !== pregunta.correcta
                    ? 'var(--ifm-color-danger)'
                    : 'var(--ifm-color-emphasis-400)',
              }}
            >
              {opcion}
            </button>
          ))}
        </div>

        {respuesta !== null && (
          <div style={panel} aria-live="polite">
            <strong>
              {respuesta === pregunta.correcta
                ? 'Respuesta correcta'
                : 'Respuesta incorrecta'}
            </strong>

            <p>{pregunta.explicacion}</p>

            {finalizado ? (
              <p>
                <strong>
                  Evaluación completada: {aciertos} de{' '}
                  {preguntas.length} respuestas correctas.
                </strong>
              </p>
            ) : (
              <button
                type="button"
                style={boton}
                onClick={siguientePregunta}
              >
                Siguiente pregunta
              </button>
            )}
          </div>
        )}

        <button
          type="button"
          style={{ ...boton, marginTop: 14 }}
          onClick={reiniciarEvaluacion}
        >
          Reiniciar evaluación
        </button>
      </div>
    </div>
  );
}
