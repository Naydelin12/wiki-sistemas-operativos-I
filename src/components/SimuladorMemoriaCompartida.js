
import React, { useState } from 'react';

const crearProcesos = () => ({
  P1: { paso: 0, local: null, esperando: false },
  P2: { paso: 0, local: null, esperando: false }
});

const instrucciones = [
  'Leer memoria compartida',
  'Incrementar valor local',
  'Escribir en memoria compartida',
  'Finalizado'
];

const estilos = {
  contenedor: {
    border: '1px solid #606875',
    borderRadius: '12px',
    padding: '20px',
    marginTop: '20px'
  },
  tarjetas: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '15px',
    marginTop: '15px'
  },
  tarjeta: {
    border: '1px solid #606875',
    borderRadius: '10px',
    padding: '16px',
    backgroundColor: '#242526'
  },
  estado: {
    color: 'white',
    padding: '12px',
    borderRadius: '7px',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  memoria: {
    border: '1px dashed #808894',
    borderRadius: '10px',
    padding: '20px',
    marginTop: '20px',
    textAlign: 'center'
  },
  boton: {
    backgroundColor: '#20bfa5',
    color: '#000',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginTop: '10px'
  },
  registro: {
    backgroundColor: '#1c1e22',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '15px',
    maxHeight: '220px',
    overflowY: 'auto'
  }
};

export default function SimuladorMemoriaCompartida() {
  const [modo, setModo] = useState('sin');
  const [contador, setContador] = useState(10);
  const [procesos, setProcesos] = useState(crearProcesos);
  const [mutex, setMutex] = useState(null);
  const [eventos, setEventos] = useState([
    'Simulación iniciada. Contador compartido = 10.'
  ]);

  const registrar = (mensaje) => {
    setEventos(prev => [...prev, mensaje]);
  };

  const ejecutarPaso = (id) => {
    const proceso = procesos[id];

    if (proceso.paso >= 3) return;

    const nuevos = {
      P1: { ...procesos.P1 },
      P2: { ...procesos.P2 }
    };

    // Control del mutex.
    if (modo === 'con') {
      if (mutex !== null && mutex !== id) {
        if (!proceso.esperando) {
          nuevos[id].esperando = true;
          setProcesos(nuevos);
          registrar(
            `${id} queda bloqueado: el mutex pertenece a ${mutex}.`
          );
        }
        return;
      }

      if (mutex === null) {
        setMutex(id);
        nuevos[id].esperando = false;
        registrar(`${id} adquiere el mutex.`);
      }
    }

    let mensaje = '';

    if (proceso.paso === 0) {
      nuevos[id].local = contador;
      mensaje = `${id} lee el valor ${contador} de memoria compartida.`;
    }

    if (proceso.paso === 1) {
      nuevos[id].local = proceso.local + 1;
      mensaje = `${id} incrementa su valor local a ${proceso.local + 1}.`;
    }

    if (proceso.paso === 2) {
      setContador(proceso.local);
      mensaje = `${id} escribe ${proceso.local} en memoria compartida.`;

      if (modo === 'con') {
        setMutex(null);
        registrar(`${id} libera el mutex.`);
      }
    }

    nuevos[id].paso += 1;
    nuevos[id].esperando = false;

    setProcesos(nuevos);
    registrar(mensaje);
  };

  const reiniciar = () => {
    setContador(10);
    setProcesos(crearProcesos());
    setMutex(null);
    setEventos([
      'Simulación reiniciada. Contador compartido = 10.'
    ]);
  };

  const cambiarModo = (nuevoModo) => {
    setModo(nuevoModo);
    reiniciar();
  };

  const renderProceso = (id) => {
    const proceso = procesos[id];
    const finalizado = proceso.paso === 3;
    const propietario = modo === 'con' && mutex === id;

    let estado = 'LISTO';
    let color = '#2563eb';

    if (propietario) {
      estado = 'EN SECCIÓN CRÍTICA';
      color = '#15803d';
    }

    if (proceso.esperando) {
      estado = 'BLOQUEADO';
      color = '#d97706';
    }

    if (finalizado) {
      estado = 'FINALIZADO';
      color = '#64748b';
    }

    return (
      <div style={estilos.tarjeta} key={id}>
        <h3>Proceso {id}</h3>

        <div style={{
          ...estilos.estado,
          backgroundColor: color
        }}>
          {estado}
        </div>

        <p>
          <strong>Valor local:</strong>{' '}
          {proceso.local ?? '—'}
        </p>

        <p>
          <strong>Instrucción actual:</strong>{' '}
          {instrucciones[proceso.paso]}
        </p>

        <button
          type="button"
          style={{
            ...estilos.boton,
            opacity: finalizado || (proceso.esperando && mutex !== null)
            ? 0.5
            : 1,

            cursor: finalizado || (proceso.esperando && mutex !== null)
            ? 'not-allowed'
            : 'pointer'
          }}
          onClick={() => ejecutarPaso(id)}
        disabled={
        finalizado ||
        (proceso.esperando && mutex !== null)
        }
        >
          Ejecutar siguiente instrucción
        </button>
      </div>
    );
  };

  return (
    <div style={estilos.contenedor}>
      <h2>Simulador Interactivo de Memoria Compartida</h2>

      <p>
        Observa cómo dos procesos acceden a una región de
        memoria compartida y cómo la sincronización evita
        las condiciones de carrera.
      </p>

      <h3>Configuración de la simulación</h3>

      <label htmlFor="modo-memoria">
        <strong>Modo de ejecución</strong>
      </label>

      <select
        id="modo-memoria"
        value={modo}
        onChange={(e) => cambiarModo(e.target.value)}
        style={{
          display: 'block',
          width: '100%',
          padding: '10px',
          marginTop: '10px',
          marginBottom: '20px'
        }}
      >
        <option value="sin">Sin sincronización</option>
        <option value="con">Con sincronización (Mutex)</option>
      </select>

      <h3>Procesos del sistema</h3>

      <div style={estilos.tarjetas}>
        {renderProceso('P1')}
        {renderProceso('P2')}
      </div>

      <div style={estilos.memoria}>
        <h3>Región de memoria compartida</h3>

        <p>Variable: contador</p>

        <h2 style={{ fontSize: '32px' }}>
          {contador}
        </h2>

        <p>
          <strong>Modo:</strong>{' '}
          {modo === 'sin'
            ? 'Sin sincronización'
            : 'Con sincronización (Mutex)'}
        </p>

        {modo === 'con' && (
          <p>
            <strong>Estado del mutex:</strong>{' '}
            {mutex === null
              ? 'LIBRE'
              : `OCUPADO POR ${mutex}`}
          </p>
        )}
      </div>

      <h3 style={{ marginTop: '20px' }}>
        Registro de eventos
      </h3>

      <div style={estilos.registro}>
        {eventos.map((evento, indice) => (
          <div
            key={indice}
            style={{
              padding: '8px 0',
              borderBottom:
                indice < eventos.length - 1
                  ? '1px solid #454b54'
                  : 'none'
            }}
          >
            <strong>{indice + 1}.</strong> {evento}
          </div>
        ))}
      </div>

      <button
        type="button"
        style={{
          ...estilos.boton,
          backgroundColor: '#ff3344'
        }}
        onClick={reiniciar}
      >
        Reiniciar simulación
      </button>
    </div>
  );
}
