import React, { useState } from 'react';

const CAPACIDAD = 3;
const PROCESOS = ['P1', 'P2'];

const crearEstado = () => ({
  modo: 'asincrono',
  entradas: { P1: '', P2: '' },
  buzones: { P1: [], P2: [] },
  pendientes: { P1: null, P2: null },
  esperandoRecepcion: { P1: false, P2: false },
  eventos: ['Simulación iniciada en modo asíncrono.'],
  siguienteId: 1
});

const estilos = {
  panel: {
    border: '1px solid var(--ifm-color-emphasis-300)',
    borderRadius: 12,
    padding: 16,
    background: 'var(--ifm-background-surface-color)'
  },
  boton: {
    marginTop: 10,
    marginRight: 8
  }
};

export default function SimuladorPasoMensajes() {
  const [sistema, setSistema] = useState(crearEstado);

  const cambiarModo = (modo) => {
    setSistema({
      ...crearEstado(),
      modo,
      eventos: [
        `Simulación iniciada en modo ${
          modo === 'sincrono' ? 'síncrono' : 'asíncrono'
        }.`
      ]
    });
  };

  const actualizarEntrada = (id, valor) => {
    setSistema(anterior => ({
      ...anterior,
      entradas: {
        ...anterior.entradas,
        [id]: valor
      }
    }));
  };

  const enviar = (emisor) => {
    setSistema(anterior => {
      const receptor = emisor === 'P1' ? 'P2' : 'P1';
      const contenido = anterior.entradas[emisor].trim();

      if (!contenido) return anterior;

      if (anterior.pendientes[emisor]) return anterior;

      const nuevo = {
        ...anterior,
        entradas: { ...anterior.entradas },
        buzones: {
          P1: [...anterior.buzones.P1],
          P2: [...anterior.buzones.P2]
        },
        pendientes: { ...anterior.pendientes },
        esperandoRecepcion: { ...anterior.esperandoRecepcion },
        eventos: [...anterior.eventos]
      };

      const mensaje = {
        id: nuevo.siguienteId,
        emisor,
        receptor,
        contenido
      };

      if (nuevo.modo === 'asincrono') {
        if (nuevo.buzones[receptor].length >= CAPACIDAD) {
          nuevo.eventos.push(
            `${emisor} no puede enviar: el buzón de ${receptor} está lleno.`
          );
          return nuevo;
        }

        nuevo.buzones[receptor].push(mensaje);
        nuevo.eventos.push(
          `${emisor} ejecuta send(): mensaje ${mensaje.id} almacenado en el buzón de ${receptor}.`
        );
      } else {
        if (nuevo.esperandoRecepcion[receptor]) {
          nuevo.esperandoRecepcion[receptor] = false;
          nuevo.eventos.push(
            `${emisor} ejecuta send(): ${receptor} recibe inmediatamente el mensaje ${mensaje.id}.`
          );
        } else {
          nuevo.pendientes[emisor] = mensaje;
          nuevo.eventos.push(
            `${emisor} ejecuta send(): queda bloqueado esperando a ${receptor}.`
          );
        }
      }

      nuevo.entradas[emisor] = '';
      nuevo.siguienteId++;

      return nuevo;
    });
  };

  const recibir = (receptor) => {
    setSistema(anterior => {
      const emisor = receptor === 'P1' ? 'P2' : 'P1';

      const nuevo = {
        ...anterior,
        buzones: {
          P1: [...anterior.buzones.P1],
          P2: [...anterior.buzones.P2]
        },
        pendientes: { ...anterior.pendientes },
        esperandoRecepcion: { ...anterior.esperandoRecepcion },
        eventos: [...anterior.eventos]
      };

      if (nuevo.modo === 'asincrono') {
        if (nuevo.buzones[receptor].length === 0) {
          nuevo.eventos.push(
            `${receptor} ejecuta receive(): no hay mensajes disponibles.`
          );
        } else {
          const mensaje = nuevo.buzones[receptor].shift();
          nuevo.eventos.push(
            `${receptor} ejecuta receive(): recibe de ${mensaje.emisor} el mensaje ${mensaje.id}: "${mensaje.contenido}".`
          );
        }
      } else {
        if (nuevo.pendientes[emisor]) {
          const mensaje = nuevo.pendientes[emisor];
          nuevo.pendientes[emisor] = null;

          nuevo.eventos.push(
            `${receptor} ejecuta receive(): recibe el mensaje ${mensaje.id} de ${emisor}: "${mensaje.contenido}".`
          );
          nuevo.eventos.push(
            `${emisor} finaliza send() y deja de estar bloqueado.`
          );
        } else {
          nuevo.esperandoRecepcion[receptor] = true;
          nuevo.eventos.push(
            `${receptor} ejecuta receive(): queda bloqueado esperando un mensaje.`
          );
        }
      }

      return nuevo;
    });
  };

  const obtenerEstado = (id) => {
    if (sistema.modo === 'sincrono') {
      if (sistema.pendientes[id]) return 'BLOQUEADO EN ENVÍO';
      if (sistema.esperandoRecepcion[id]) {
        return 'BLOQUEADO EN RECEPCIÓN';
      }
    }
    return 'LISTO';
  };

  const colorEstado = (estado) =>
    estado === 'LISTO' ? '#2563eb' : '#d97706';

  const reiniciar = () => cambiarModo(sistema.modo);

  return (
    <div style={{
      border: '1px solid var(--ifm-color-emphasis-300)',
      borderRadius: 14,
      padding: 20,
      margin: '24px 0'
    }}>
      <h2>Simulador Interactivo de Paso de Mensajes</h2>

      <p>
        Explora cómo dos procesos intercambian información
        mediante las operaciones send() y receive().
      </p>

      <h3>Configuración de la comunicación</h3>

      <label htmlFor="modo-mensajes">
        <strong>Tipo de comunicación</strong>
      </label>

      <select
        id="modo-mensajes"
        className="button button--secondary"
        style={{
          display: 'block',
          width: '100%',
          marginTop: 10,
          marginBottom: 20
        }}
        value={sistema.modo}
        onChange={(e) => cambiarModo(e.target.value)}
      >
        <option value="asincrono">Comunicación asíncrona</option>
        <option value="sincrono">Comunicación síncrona</option>
      </select>

      <h3>Procesos del sistema</h3>

      <div style={{
        display: 'grid',
        gridTemplateColumns:
          'repeat(auto-fit, minmax(230px, 1fr))',
        gap: 14,
        marginBottom: 20
      }}>
        {PROCESOS.map(id => {
          const estado = obtenerEstado(id);
          const receptor = id === 'P1' ? 'P2' : 'P1';

          return (
            <div key={id} style={estilos.panel}>
              <h4>Proceso {id}</h4>

              <div style={{
                padding: 10,
                borderRadius: 8,
                textAlign: 'center',
                background: colorEstado(estado),
                color: '#fff',
                fontWeight: 'bold',
                marginBottom: 12
              }}>
                {estado}
              </div>

              <label htmlFor={`mensaje-${id}`}>
                Mensaje para {receptor}
              </label>

              <input
                id={`mensaje-${id}`}
                type="text"
                value={sistema.entradas[id]}
                onChange={(e) =>
                  actualizarEntrada(id, e.target.value)
                }
                placeholder="Escribe un mensaje"
                disabled={estado !== 'LISTO'}
                style={{
                  width: '100%',
                  padding: 10,
                  borderRadius: 6,
                  marginTop: 6,
                  marginBottom: 10,
                  background: 'var(--ifm-background-color)',
                  color: 'var(--ifm-font-color-base)',
                  border: '1px solid var(--ifm-color-emphasis-300)'
                }}
              />

              <button
                className="button button--primary button--sm"
                style={estilos.boton}
                disabled={estado !== 'LISTO'}
                onClick={() => enviar(id)}
              >
                send()
              </button>

              <button
                className="button button--secondary button--sm"
                style={estilos.boton}
                disabled={estado !== 'LISTO'}
                onClick={() => recibir(id)}
              >
                receive()
              </button>
            </div>
          );
        })}
      </div>

      <h3>
        {sistema.modo === 'asincrono'
          ? 'Buzones de mensajes'
          : 'Mensajes pendientes de entrega'}
      </h3>

      <div style={{
        display: 'grid',
        gridTemplateColumns:
          'repeat(auto-fit, minmax(230px, 1fr))',
        gap: 14,
        marginBottom: 20
      }}>
        {PROCESOS.map(id => {
          const mensajes = sistema.modo === 'asincrono'
            ? sistema.buzones[id]
            : Object.values(sistema.pendientes)
                .filter(m => m && m.receptor === id);

          return (
            <div key={id} style={estilos.panel}>
              <h4>
                {sistema.modo === 'asincrono'
                  ? `Buzón de ${id}`
                  : `Destino ${id}`}
              </h4>

              {sistema.modo === 'asincrono' && (
                <p>
                  Capacidad: {mensajes.length} / {CAPACIDAD}
                </p>
              )}

              {mensajes.length === 0 ? (
                <p>No hay mensajes pendientes.</p>
              ) : (
                mensajes.map(mensaje => (
                  <div key={mensaje.id} style={{
                    padding: 10,
                    marginBottom: 8,
                    borderRadius: 6,
                    background: 'rgba(37,99,235,0.12)',
                    border: '1px solid var(--ifm-color-emphasis-300)',
                    overflowWrap: 'anywhere'
                  }}>
                    <strong>Mensaje {mensaje.id}</strong>
                    <div>{mensaje.emisor} → {mensaje.receptor}</div>
                    <div>{mensaje.contenido}</div>
                  </div>
                ))
              )}
            </div>
          );
        })}
      </div>

      <h3>Registro de eventos</h3>

      <div
        aria-live="polite"
        style={{
          maxHeight: 260,
          overflowY: 'auto',
          padding: 15,
          borderRadius: 8,
          background: 'var(--ifm-color-emphasis-100)',
          marginBottom: 20
        }}
      >
        {sistema.eventos.map((evento, i) => (
          <div key={i} style={{
            padding: '7px 0',
            borderBottom:
              '1px solid var(--ifm-color-emphasis-200)',
            overflowWrap: 'anywhere'
          }}>
            <strong>{i + 1}.</strong> {evento}
          </div>
        ))}
      </div>

      <button
        className="button button--danger"
        onClick={reiniciar}
      >
        Reiniciar simulación
      </button>
    </div>
  );
}
