import React, { useState } from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

export default function AnalogiaAutomovil() {
  const [modo, setModo] = useState('conSO');
  const [anguloVolante, setAnguloVolante] = useState(0);
  const [pasoSinSO, setPasoSinSO] = useState(0); // Seguimiento del progreso manual (0, 1, 2)
  const [mensaje, setMensaje] = useState('🚗 Sistema listo. Prueba girar el volante.');
  const [estadoError, setEstadoError] = useState(false);

  // --- Lógica CON SO ---
  const girarConSO = () => {
    setAnguloVolante(90);
    setMensaje('✨ [SO] Dirección asistida activada. Girando ruedas 90° de forma fluida.');
    setEstadoError(false);
    setTimeout(() => setAnguloVolante(0), 1500); // Regresa solo
  };

  // --- Lógica SIN SO (Secuencia Manual) ---
  const ejecutarPasoManual = (pasoCorrecto, nombreAccion) => {
    if (pasoSinSO === pasoCorrecto) {
      const nuevoPaso = pasoSinSO + 1;
      setPasoSinSO(nuevoPaso);
      setEstadoError(false);

      if (nuevoPaso === 1) {
        setMensaje('1/3 🗜️ Presión hidráulica liberada. Siguiente: Engranar cremallera.');
      } else if (nuevoPaso === 2) {
        setMensaje('2/3 ⚙️ Cremallera engranada. Siguiente: Aplicar fuerza mecánica.');
      } else if (nuevoPaso === 3) {
        setAnguloVolante(90);
        setMensaje('🎉 ¡ÉXITO! Lograste girar manualmente tras 3 comandos directos de hardware.');
        setTimeout(() => {
          setAnguloVolante(0);
          setPasoSinSO(0);
        }, 2000);
      }
    } else {
      // Error si presiona fuera de orden
      setEstadoError(true);
      setMensaje(`🚨 ¡ERROR DE HARDWARE! Intentaste "${nombreAccion}" fuera de secuencia. ¡Reinicio de válvulas!`);
      setPasoSinSO(0);
    }
  };

  const cambiarModo = (nuevoModo) => {
    setModo(nuevoModo);
    setAnguloVolante(0);
    setPasoSinSO(0);
    setEstadoError(false);
    setMensaje(
      nuevoModo === 'conSO'
        ? '🚗 Modo CON SO: Controles limpios y automáticos.'
        : '⚠️ Modo SIN SO: Volante bloqueado. Debes ejecutar la secuencia exacta de componentes.'
    );
  };

  return (
    <div style={{
      border: '2px solid #2e7d32',
      borderRadius: '12px',
      padding: '20px',
      margin: '20px 0',
      backgroundColor: '#1b1e23',
      color: '#ffffff',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <h3 style={{ marginTop: 0, color: '#81c784', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>🏎️</span> Simulador Dinámico: La Dirección del Auto
      </h3>

      {/* Switch Con SO / Sin SO */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', justifyContent: 'center' }}>
        <button
          onClick={() => cambiarModo('conSO')}
          style={{
            padding: '8px 18px',
            borderRadius: '20px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold',
            backgroundColor: modo === 'conSO' ? '#2e7d32' : '#333',
            color: 'white',
            transition: 'all 0.3s'
          }}
        >
          ✨ CON Sistema Operativo
        </button>
        <button
          onClick={() => cambiarModo('sinSO')}
          style={{
            padding: '8px 18px',
            borderRadius: '20px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold',
            backgroundColor: modo === 'sinSO' ? '#c62828' : '#333',
            color: 'white',
            transition: 'all 0.3s'
          }}
        >
          ⚠️ SIN Sistema Operativo (Bare Metal)
        </button>
      </div>

      {/* Panel Central Visual (Volante Animado) */}
      <div style={{
        backgroundColor: '#0d1117',
        borderRadius: '10px',
        padding: '25px',
        textAlign: 'center',
        border: '1px solid #30363d',
        marginBottom: '15px'
      }}>
        {/* El Volante que realmente gira */}
        <div style={{
          fontSize: '90px',
          display: 'inline-block',
          transform: `rotate(${anguloVolante}deg)`,
          transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)', // Animación fluida de giro
          filter: modo === 'sinSO' && pasoSinSO < 3 ? 'grayscale(0.8)' : 'none'
        }}>
          <img 
            src={useBaseUrl('/img/volante.png')} 
            alt="Volante" 
            style={{ width: '100px', height: '100px', objectFit: 'contain' }} 
            />
        </div>

        {/* Indicador de bloqueo en Sin SO */}
        {modo === 'sinSO' && pasoSinSO < 3 && (
          <div style={{ color: '#ff7b72', fontSize: '0.85em', marginTop: '5px' }}>
            🔒 Volante Bloqueado Mecánicamente
          </div>
        )}

        {/* CONTROLES MODO CON SO */}
        {modo === 'conSO' && (
          <div style={{ marginTop: '20px' }}>
            <button
              onClick={girarConSO}
              style={{
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#1f6beb',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1em',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(31, 107, 235, 0.4)'
              }}
            >
              ↪️ Girar a la Derecha (1 Clic)
            </button>
          </div>
        )}

        {/* CONTROLES INTERACTIVOS MODO SIN SO (PASO A PASO) */}
        {modo === 'sinSO' && (
          <div style={{ marginTop: '20px' }}>
            <p style={{ fontSize: '0.85em', color: '#8b949e', marginBottom: '10px' }}>
              Secuencia obligatoria de hardware (Paso {pasoSinSO} de 3):
            </p>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => ejecutarPasoManual(0, 'Liberar Presión')}
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #444',
                  backgroundColor: pasoSinSO === 0 ? '#388bfd' : '#21262d',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                🗜️ Abrir Válvula de Aceite
              </button>

              <button
                onClick={() => ejecutarPasoManual(1, 'Engranar Cremallera')}
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #444',
                  backgroundColor: pasoSinSO === 1 ? '#388bfd' : '#21262d',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                ⚙️ Mover Cremallera Física
              </button>

              <button
                onClick={() => ejecutarPasoManual(2, 'Forzar Palanca')}
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #444',
                  backgroundColor: pasoSinSO === 2 ? '#388bfd' : '#21262d',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                📐 Forzar Ángulo de Rueda
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Caja de Estado / Feedback */}
      <div style={{
        padding: '12px',
        borderRadius: '6px',
        backgroundColor: estadoError ? '#3d1214' : '#161b22',
        borderLeft: `4px solid ${estadoError ? '#f85149' : '#3fb950'}`,
        color: estadoError ? '#ff7b72' : '#e6edf3',
        fontSize: '0.9em'
      }}>
        {mensaje}
      </div>
    </div>
  );
}