import React, { useState } from 'react';

const hitos = [
  {
    era: '1940 - 1955',
    titulo: 'Generación Cero',
    subtitulo: 'Sin Sistema Operativo (Bare Metal)',
    detalles: [
      'Uso de tubos al vacío y tableros de conmutadores.',
      'Programación en código máquina binario.',
      'Configuración eléctrica manual mediante cables.'
    ],
    icono: '⚡'
  },
  {
    era: '1955 - 1965',
    titulo: 'Primera Generación',
    subtitulo: 'Sistemas por Lotes (Batch)',
    detalles: [
      'Nace el Monitor Residente para automatizar la carga de tarjetas perforadas.',
      'Transistores reemplazan los tubos al vacío.',
      'Nace el GM-NAA I/O para el ordenador IBM 704.'
    ],
    icono: '📜'
  },
  {
    era: '1965 - 1980',
    titulo: 'Segunda Generación',
    subtitulo: 'Multiprogramación y Tiempo Compartido',
    detalles: [
      'Uso de Circuitos Integrados (Chips).',
      'Surgimiento de UNIX (1969/1973) por Thompson y Ritchie en Lenguaje C.',
      'Nace el concepto de Tiempo Compartido (Time-Sharing).'
    ],
    icono: '💻'
  },
  {
    era: '1980 - 1990',
    titulo: 'Tercera Generación',
    subtitulo: 'PCs e Interfaces Gráficas (GUI)',
    detalles: [
      'Revolución de las Computadoras Personales con microprocesadores.',
      'Dominio de MS-DOS en línea de comandos.',
      'Lanzamiento de Apple Macintosh (1984) y Windows 1.0 (1985).'
    ],
    icono: '🖥️'
  },
  {
    era: '1990 - Presente',
    titulo: 'Cuarta Generación',
    subtitulo: 'Open Source, Redes y Móviles',
    detalles: [
      'Nacimiento del Kernel GNU/Linux por Linus Torvalds (1991).',
      'Consolidación de Windows NT/XP y arquitecturas multinúcleo.',
      'Dominio de sistemas móviles táctiles: Android y iOS.'
    ],
    icono: '🌐'
  }
];

export function LineaTiempoSO() {
  const [indexActivo, setIndexActivo] = useState(0);
  const seleccionado = hitos[indexActivo];

  return (
    <div style={{
      backgroundColor: '#1b1b1d',
      color: '#f5f6f7',
      borderRadius: '8px',
      padding: '20px',
      border: '1px solid #333',
      margin: '25px 0'
    }}>
      {/* Selector de Generaciones */}
      <div style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        paddingBottom: '12px',
        borderBottom: '1px solid #333'
      }}>
        {hitos.map((item, idx) => (
          <button
            key={idx}
            onClick={() => setIndexActivo(idx)}
            style={{
              backgroundColor: indexActivo === idx ? '#3578e5' : '#242526',
              color: '#fff',
              border: 'none',
              padding: '8px 14px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
              whiteSpace: 'nowrap',
              transition: 'background-color 0.2s'
            }}
          >
            {item.icono} {item.era}
          </button>
        ))}
      </div>

      {/* Tarjeta de Contenido */}
      <div style={{ marginTop: '20px' }}>
        <span style={{
          backgroundColor: '#3578e522',
          color: '#3578e5',
          fontSize: '0.85em',
          fontWeight: 'bold',
          padding: '4px 8px',
          borderRadius: '4px'
        }}>
          {seleccionado.era}
        </span>
        <h3 style={{ margin: '10px 0 5px 0', color: '#fff' }}>{seleccionado.titulo}</h3>
        <h4 style={{ margin: '0 0 15px 0', color: '#aaa', fontWeight: 'normal' }}>{seleccionado.subtitulo}</h4>

        <ul style={{ paddingLeft: '20px', margin: 0 }}>
          {seleccionado.detalles.map((detalle, dIdx) => (
            <li key={dIdx} style={{ marginBottom: '8px', color: '#e3e3e3' }}>
              {detalle}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}