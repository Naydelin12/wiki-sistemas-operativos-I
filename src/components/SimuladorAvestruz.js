
import React, { useState } from "react";

const escenarios = {
  normal: {
    nombre: "Funcionamiento normal",
    descripcion:
      "Los procesos utilizan los recursos y finalizan sin que ocurra un interbloqueo.",
    pasos: [
      {
        p1: "LISTO",
        p2: "LISTO",
        r1: null,
        r2: null,
        espera1: null,
        espera2: null,
        evento: "Sistema iniciado. Ambos procesos están listos.",
      },
      {
        p1: "EJECUTANDO",
        p2: "LISTO",
        r1: "P1",
        r2: null,
        espera1: null,
        espera2: null,
        evento: "P1 adquiere R1.",
      },
      {
        p1: "EJECUTANDO",
        p2: "LISTO",
        r1: "P1",
        r2: "P1",
        espera1: null,
        espera2: null,
        evento: "P1 adquiere R2 y continúa ejecutándose.",
      },
      {
        p1: "FINALIZADO",
        p2: "LISTO",
        r1: null,
        r2: null,
        espera1: null,
        espera2: null,
        evento: "P1 finaliza y libera R1 y R2.",
      },
      {
        p1: "FINALIZADO",
        p2: "EJECUTANDO",
        r1: "P2",
        r2: "P2",
        espera1: null,
        espera2: null,
        evento: "P2 adquiere R1 y R2.",
      },
      {
        p1: "FINALIZADO",
        p2: "FINALIZADO",
        r1: null,
        r2: null,
        espera1: null,
        espera2: null,
        evento: "P2 finaliza y libera ambos recursos.",
        resultado: "EJECUCIÓN COMPLETADA",
        detalle:
          "Los procesos finalizaron sin interbloqueo y sin utilizar mecanismos específicos de prevención o detección.",
        peligro: false,
      },
    ],
  },

  ignorado: {
    nombre: "Interbloqueo ignorado",
    descripcion:
      "Los procesos quedan bloqueados y no existe un mecanismo automático que resuelva la situación.",
    pasos: [
      {
        p1: "LISTO",
        p2: "LISTO",
        r1: null,
        r2: null,
        espera1: null,
        espera2: null,
        evento: "Sistema iniciado. Ambos procesos están listos.",
      },
      {
        p1: "EJECUTANDO",
        p2: "LISTO",
        r1: "P1",
        r2: null,
        espera1: null,
        espera2: null,
        evento: "P1 adquiere R1.",
      },
      {
        p1: "EJECUTANDO",
        p2: "EJECUTANDO",
        r1: "P1",
        r2: "P2",
        espera1: null,
        espera2: null,
        evento: "P2 adquiere R2.",
      },
      {
        p1: "BLOQUEADO",
        p2: "EJECUTANDO",
        r1: "P1",
        r2: "P2",
        espera1: "R2",
        espera2: null,
        evento: "P1 solicita R2 y queda esperando.",
      },
      {
        p1: "BLOQUEADO",
        p2: "BLOQUEADO",
        r1: "P1",
        r2: "P2",
        espera1: "R2",
        espera2: "R1",
        evento: "P2 solicita R1 y también queda esperando.",
      },
      {
        p1: "BLOQUEADO",
        p2: "BLOQUEADO",
        r1: "P1",
        r2: "P2",
        espera1: "R2",
        espera2: "R1",
        evento:
          "Ambos procesos permanecen bloqueados. El sistema no ejecuta detección ni recuperación automática.",
        resultado: "INTERBLOQUEO SIN TRATAMIENTO",
        detalle:
          "Existe una espera circular, pero el sistema no aplica mecanismos automáticos para resolverla.",
        peligro: true,
      },
    ],
  },

  intervencion: {
    nombre: "Intervención externa",
    descripcion:
      "Un administrador interviene para liberar recursos y permitir que el sistema continúe.",
    pasos: [
      {
        p1: "LISTO",
        p2: "LISTO",
        r1: null,
        r2: null,
        espera1: null,
        espera2: null,
        evento: "Sistema iniciado. Ambos procesos están listos.",
      },
      {
        p1: "EJECUTANDO",
        p2: "EJECUTANDO",
        r1: "P1",
        r2: "P2",
        espera1: null,
        espera2: null,
        evento: "P1 adquiere R1 y P2 adquiere R2.",
      },
      {
        p1: "BLOQUEADO",
        p2: "EJECUTANDO",
        r1: "P1",
        r2: "P2",
        espera1: "R2",
        espera2: null,
        evento: "P1 solicita R2 y queda bloqueado.",
      },
      {
        p1: "BLOQUEADO",
        p2: "BLOQUEADO",
        r1: "P1",
        r2: "P2",
        espera1: "R2",
        espera2: "R1",
        evento: "P2 solicita R1 y también queda bloqueado.",
      },
      {
        p1: "BLOQUEADO",
        p2: "BLOQUEADO",
        r1: "P1",
        r2: "P2",
        espera1: "R2",
        espera2: "R1",
        evento:
          "Los procesos siguen bloqueados. No hay recuperación automática.",
      },
      {
        p1: "BLOQUEADO",
        p2: "TERMINADO",
        r1: "P1",
        r2: null,
        espera1: "R2",
        espera2: null,
        evento:
          "Un administrador finaliza P2. El recurso R2 queda disponible.",
      },
      {
        p1: "EJECUTANDO",
        p2: "TERMINADO",
        r1: "P1",
        r2: "P1",
        espera1: null,
        espera2: null,
        evento:
          "P1 obtiene R2 y reanuda su ejecución.",
      },
      {
        p1: "FINALIZADO",
        p2: "TERMINADO",
        r1: null,
        r2: null,
        espera1: null,
        espera2: null,
        evento:
          "P1 finaliza y libera los recursos. El sistema vuelve a funcionar.",
        resultado: "SISTEMA RECUPERADO",
        detalle:
          "La recuperación fue posible gracias a una intervención externa. P2 fue terminado sin completar su trabajo.",
        peligro: false,
      },
    ],
  },
};

const estilos = {
  contenedor: {
    background: "#1c1c1c",
    color: "#f4f4f5",
    padding: 16,
    border: "1px solid #59616d",
    borderRadius: 8,
    fontSize: 14,
  },
  panel: {
    background: "#242424",
    border: "1px solid #59616d",
    borderRadius: 7,
    padding: 12,
  },
  boton: {
    background: "#20bfa6",
    color: "#081512",
    border: "none",
    borderRadius: 5,
    padding: "10px 14px",
    fontWeight: "bold",
    cursor: "pointer",
  },
};

function colorEstado(estado) {
  if (estado === "BLOQUEADO") return "#ef4444";
  if (estado === "FINALIZADO") return "#20bfa6";
  if (estado === "TERMINADO") return "#fb923c";
  if (estado === "EJECUTANDO") return "#facc15";
  return "#d1d5db";
}

export default function SimuladorAvestruz() {
  const [tipo, setTipo] = useState("normal");
  const [indice, setIndice] = useState(0);

  const escenario = escenarios[tipo];
  const paso = escenario.pasos[indice];
  const ultimo = indice === escenario.pasos.length - 1;

  const cambiarEscenario = (evento) => {
    setTipo(evento.target.value);
    setIndice(0);
  };

  const avanzar = () => {
    setIndice((actual) =>
      Math.min(actual + 1, escenario.pasos.length - 1)
    );
  };

  const reiniciar = () => {
    setIndice(0);
  };

  const eventos = escenario.pasos.slice(0, indice + 1);

  const procesoPanel = (nombre, estado, espera) => (
    <div style={{ ...estilos.panel, flex: 1, minWidth: 180 }}>
      <h4 style={{ marginTop: 0 }}>{nombre}</h4>

      <p>
        Estado:{" "}
        <strong style={{ color: colorEstado(estado) }}>
          {estado}
        </strong>
      </p>

      <p>
        Esperando: <strong>{espera || "Ninguno"}</strong>
      </p>
    </div>
  );

  const recursoPanel = (nombre, propietario) => (
    <div style={{ ...estilos.panel, flex: 1, minWidth: 180 }}>
      <h4 style={{ marginTop: 0 }}>{nombre}</h4>

      <p>
        Asignado a:{" "}
        <strong
          style={{
            color: propietario ? "#facc15" : "#20bfa6",
          }}
        >
          {propietario || "DISPONIBLE"}
        </strong>
      </p>
    </div>
  );

  const esperaCircular =
    paso.espera1 === "R2" &&
    paso.espera2 === "R1" &&
    paso.r1 === "P1" &&
    paso.r2 === "P2";

  return (
    <div style={estilos.contenedor}>
      <h3 style={{ color: "white", marginTop: 0 }}>
        Simulador del Enfoque del Avestruz
      </h3>

      <p>
        Observa qué ocurre cuando un sistema no aplica
        mecanismos automáticos de tratamiento de interbloqueos.
      </p>

      <div style={estilos.panel}>
        <label htmlFor="escenario-avestruz">
          <strong>Seleccionar escenario</strong>
        </label>

        <select
          id="escenario-avestruz"
          value={tipo}
          onChange={cambiarEscenario}
          style={{
            width: "100%",
            padding: 9,
            marginTop: 8,
            background: "#333",
            color: "white",
            border: "1px solid #777",
            borderRadius: 5,
          }}
        >
          {Object.entries(escenarios).map(([clave, valor]) => (
            <option key={clave} value={clave}>
              {valor.nombre}
            </option>
          ))}
        </select>

        <p style={{ marginBottom: 0 }}>
          {escenario.descripcion}
        </p>
      </div>

      <h4>Estado de los procesos</h4>

      <div style={{
        display: "flex",
        gap: 12,
        flexWrap: "wrap",
      }}>
        {procesoPanel("P1", paso.p1, paso.espera1)}
        {procesoPanel("P2", paso.p2, paso.espera2)}
      </div>

      <h4>Estado de los recursos</h4>

      <div style={{
        display: "flex",
        gap: 12,
        flexWrap: "wrap",
      }}>
        {recursoPanel("R1", paso.r1)}
        {recursoPanel("R2", paso.r2)}
      </div>

      <h4>Dependencias entre procesos</h4>

      <div style={{
        ...estilos.panel,
        textAlign: "center",
      }}>
        {esperaCircular ? (
          <>
            <p style={{
              color: "#ef4444",
              fontSize: 18,
              fontWeight: "bold",
            }}>
              P1 → P2 → P1
            </p>

            <p style={{ color: "#ef4444" }}>
              Espera circular presente
            </p>

            <p style={{ fontSize: 12 }}>
              Esta visualización es educativa.
              No representa un detector automático del sistema.
            </p>
          </>
        ) : (
          <p>
            {paso.espera1
              ? "P1 → P2"
              : paso.espera2
              ? "P2 → P1"
              : "Sin dependencias de espera"}
          </p>
        )}
      </div>

      <h4>Control de simulación</h4>

      <div style={{
        ...estilos.panel,
        display: "flex",
        alignItems: "center",
        gap: 12,
        flexWrap: "wrap",
      }}>
        <button
          onClick={avanzar}
          disabled={ultimo}
          style={{
            ...estilos.boton,
            opacity: ultimo ? 0.5 : 1,
            cursor: ultimo ? "not-allowed" : "pointer",
          }}
        >
          Siguiente paso
        </button>

        <button
          onClick={reiniciar}
          style={{
            ...estilos.boton,
            background: "#ef4444",
            color: "white",
          }}
        >
          Reiniciar simulación
        </button>

        <strong>
          Paso {indice + 1} de {escenario.pasos.length}
        </strong>
      </div>

      {paso.resultado && (
        <div style={{
          ...estilos.panel,
          marginTop: 15,
          borderColor: paso.peligro
            ? "#ef4444"
            : "#20bfa6",
        }}>
          <h4 style={{
            marginTop: 0,
            color: paso.peligro
              ? "#ef4444"
              : "#20bfa6",
          }}>
            {paso.resultado}
          </h4>

          <p style={{ marginBottom: 0 }}>
            {paso.detalle}
          </p>
        </div>
      )}

      <h4>Registro de eventos</h4>

      <div style={{
        ...estilos.panel,
        background: "#1b1e23",
        maxHeight: 240,
        overflowY: "auto",
      }}>
        {eventos.map((evento, i) => (
          <div key={i} style={{
            padding: "9px 0",
            borderBottom: "1px solid #454b55",
          }}>
            <strong>{i + 1}.</strong> {evento.evento}
          </div>
        ))}
      </div>
    </div>
  );
}
