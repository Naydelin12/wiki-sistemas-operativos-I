
import React, { useState } from "react";

const escenarios = {
  sin: {
    nombre: "Sin prevención",
    descripcion: "Los procesos adquieren recursos en distinto orden y terminan bloqueados.",
    pasos: [
      { p1: "LISTO", p2: "LISTO", r1: null, r2: null, mensaje: "Sistema iniciado sin prevención." },
      { p1: "EJECUTANDO", p2: "LISTO", r1: "P1", r2: null, mensaje: "P1 adquiere R1." },
      { p1: "EJECUTANDO", p2: "EJECUTANDO", r1: "P1", r2: "P2", mensaje: "P2 adquiere R2." },
      { p1: "BLOQUEADO", p2: "EJECUTANDO", r1: "P1", r2: "P2", espera1: "R2", mensaje: "P1 solicita R2, ocupado por P2." },
      { p1: "BLOQUEADO", p2: "BLOQUEADO", r1: "P1", r2: "P2", espera1: "R2", espera2: "R1", mensaje: "P2 solicita R1. Se forma una espera circular.", resultado: "INTERBLOQUEO DETECTADO" }
    ]
  },
  anticipada: {
    nombre: "Solicitud anticipada",
    descripcion: "Cada proceso solicita todos sus recursos antes de comenzar.",
    pasos: [
      { p1: "LISTO", p2: "LISTO", r1: null, r2: null, mensaje: "Sistema iniciado con solicitud anticipada." },
      { p1: "EJECUTANDO", p2: "LISTO", r1: "P1", r2: "P1", mensaje: "P1 obtiene R1 y R2 conjuntamente." },
      { p1: "EJECUTANDO", p2: "ESPERANDO", r1: "P1", r2: "P1", espera2: "R1 y R2", mensaje: "P2 espera sin conservar ningún recurso." },
      { p1: "FINALIZADO", p2: "ESPERANDO", r1: null, r2: null, espera2: "R1 y R2", mensaje: "P1 termina y libera ambos recursos." },
      { p1: "FINALIZADO", p2: "EJECUTANDO", r1: "P2", r2: "P2", mensaje: "P2 obtiene ambos recursos." },
      { p1: "FINALIZADO", p2: "FINALIZADO", r1: null, r2: null, mensaje: "P2 termina y libera los recursos.", resultado: "INTERBLOQUEO PREVENIDO" }
    ]
  },
  orden: {
    nombre: "Orden global",
    descripcion: "Los procesos deben adquirir primero R1 y después R2.",
    pasos: [
      { p1: "LISTO", p2: "LISTO", r1: null, r2: null, mensaje: "Se establece el orden R1 → R2." },
      { p1: "EJECUTANDO", p2: "LISTO", r1: "P1", r2: null, mensaje: "P1 adquiere R1." },
      { p1: "EJECUTANDO", p2: "ESPERANDO", r1: "P1", r2: null, espera2: "R1", mensaje: "P2 solicita R1 y espera sin adquirir R2." },
      { p1: "EJECUTANDO", p2: "ESPERANDO", r1: "P1", r2: "P1", espera2: "R1", mensaje: "P1 adquiere R2 respetando el orden." },
      { p1: "FINALIZADO", p2: "ESPERANDO", r1: null, r2: null, espera2: "R1", mensaje: "P1 finaliza y libera los recursos." },
      { p1: "FINALIZADO", p2: "EJECUTANDO", r1: "P2", r2: "P2", mensaje: "P2 obtiene R1 y después R2." },
      { p1: "FINALIZADO", p2: "FINALIZADO", r1: null, r2: null, mensaje: "P2 finaliza y libera los recursos.", resultado: "INTERBLOQUEO PREVENIDO" }
    ]
  },
  recuperacion: {
    nombre: "Recuperación controlada",
    descripcion: "El sistema puede retirar recursos recuperables de forma segura.",
    pasos: [
      { p1: "LISTO", p2: "LISTO", r1: null, r2: null, mensaje: "Sistema iniciado con expropiación controlada." },
      { p1: "EJECUTANDO", p2: "EJECUTANDO", r1: "P1", r2: "P2", mensaje: "P1 obtiene R1 y P2 obtiene R2." },
      { p1: "ESPERANDO", p2: "EJECUTANDO", r1: "P1", r2: "P2", espera1: "R2", mensaje: "P1 solicita R2, pero está ocupado." },
      { p1: "ESPERANDO", p2: "EJECUTANDO", r1: null, r2: "P2", espera1: "R1 y R2", mensaje: "El sistema guarda el estado de P1 y recupera R1 de forma segura." },
      { p1: "ESPERANDO", p2: "EJECUTANDO", r1: "P2", r2: "P2", espera1: "R1 y R2", mensaje: "P2 obtiene R1 y continúa." },
      { p1: "ESPERANDO", p2: "FINALIZADO", r1: null, r2: null, espera1: "R1 y R2", mensaje: "P2 termina y libera ambos recursos." },
      { p1: "EJECUTANDO", p2: "FINALIZADO", r1: "P1", r2: "P1", mensaje: "P1 recupera su ejecución con ambos recursos." },
      { p1: "FINALIZADO", p2: "FINALIZADO", r1: null, r2: null, mensaje: "P1 termina y libera los recursos.", resultado: "INTERBLOQUEO PREVENIDO" }
    ]
  }
};

const colores = {
  LISTO: "#2563eb",
  EJECUTANDO: "#15803d",
  ESPERANDO: "#d97706",
  BLOQUEADO: "#dc2626",
  FINALIZADO: "#64748b"
};

export default function SimuladorPrevencion() {
  const [tipo, setTipo] = useState("sin");
  const [paso, setPaso] = useState(0);

  const escenario = escenarios[tipo];
  const actual = escenario.pasos[paso];
  const terminado = paso === escenario.pasos.length - 1;

  const cambiarTipo = (valor) => {
    setTipo(valor);
    setPaso(0);
  };

  const siguiente = () => {
    if (!terminado) setPaso((anterior) => anterior + 1);
  };

  const reiniciar = () => setPaso(0);

  const panel = {
    border: "1px solid #59616d",
    borderRadius: 7,
    padding: 12,
    background: "#242424"
  };

  const boton = {
    background: "#20bfa6",
    border: "none",
    borderRadius: 4,
    padding: "9px 13px",
    color: "#081512",
    fontWeight: "bold",
    cursor: "pointer"
  };

  const proceso = (id, estado, espera) => (
    <div style={{ ...panel, flex: 1, minWidth: 190 }}>
      <strong>Proceso {id}</strong>
      <div style={{
        background: colores[estado],
        textAlign: "center",
        padding: 10,
        borderRadius: 5,
        marginTop: 12,
        color: "white",
        fontWeight: "bold"
      }}>
        {estado}
      </div>
      <p style={{ fontSize: 13, marginTop: 10 }}>
        Recurso solicitado: {espera || "Ninguno"}
      </p>
    </div>
  );

  const recurso = (id, propietario) => (
    <div style={{ ...panel, flex: 1, minWidth: 190, textAlign: "center" }}>
      <strong>Recurso {id}</strong>
      <p style={{ fontSize: 13, marginTop: 12 }}>
        {propietario ? `Asignado a ${propietario}` : "DISPONIBLE"}
      </p>
    </div>
  );

  return (
    <div style={{
      background: "#1c1c1c",
      color: "#f4f4f5",
      padding: 15,
      border: "1px solid #59616d",
      borderRadius: 8,
      fontSize: 14
    }}>
      <h3 style={{ color: "white" }}>
        Simulador Interactivo de Prevención de Interbloqueos
      </h3>

      <p>
        Compara diferentes estrategias de prevención y observa
        cómo cambia la asignación de recursos.
      </p>

      <h4>Configuración de la simulación</h4>

      <label htmlFor="tipo-prevencion">
        <strong>Estrategia de prevención</strong>
      </label>

      <select
        id="tipo-prevencion"
        value={tipo}
        onChange={(e) => cambiarTipo(e.target.value)}
        style={{
          width: "100%",
          marginTop: 8,
          padding: 9,
          background: "#333",
          color: "white",
          border: "1px solid #777"
        }}
      >
        {Object.entries(escenarios).map(([clave, valor]) => (
          <option key={clave} value={clave}>
            {valor.nombre}
          </option>
        ))}
      </select>

      <p style={{ marginTop: 12 }}>{escenario.descripcion}</p>

      <h4>Procesos del sistema</h4>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {proceso("P1", actual.p1, actual.espera1)}
        {proceso("P2", actual.p2, actual.espera2)}
      </div>

      <h4 style={{ marginTop: 15 }}>Recursos compartidos</h4>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {recurso("R1", actual.r1)}
        {recurso("R2", actual.r2)}
      </div>

      <h4 style={{ marginTop: 15 }}>Ejecución paso a paso</h4>

      <p>
        Paso {paso + 1} de {escenario.pasos.length}
      </p>

      <div style={{
        ...panel,
        background: "#1b1e23",
        maxHeight: 190,
        overflowY: "auto"
      }}>
        {escenario.pasos.slice(0, paso + 1).map((evento, indice) => (
          <div
            key={indice}
            style={{
              padding: "8px 0",
              borderBottom: "1px solid #454b55",
              fontSize: 13
            }}
          >
            {indice + 1}. {evento.mensaje}
          </div>
        ))}
      </div>

      {actual.resultado && (
        <div style={{
          ...panel,
          marginTop: 12,
          borderColor: tipo === "sin" ? "#ef4444" : "#20bfa6"
        }}>
          <strong style={{
            color: tipo === "sin" ? "#ef4444" : "#20bfa6"
          }}>
            {actual.resultado}
          </strong>
          <p style={{ marginTop: 8 }}>
            {tipo === "sin"
              ? "P1 espera R2 y P2 espera R1. Ambos conservan sus recursos y no pueden continuar."
              : "La estrategia aplicada impide que se mantenga una espera circular bloqueante en este escenario."}
          </p>
        </div>
      )}

      <div style={{
        display: "flex",
        gap: 8,
        marginTop: 15,
        flexWrap: "wrap"
      }}>
        <button
          onClick={siguiente}
          disabled={terminado}
          style={{
            ...boton,
            opacity: terminado ? 0.5 : 1,
            cursor: terminado ? "not-allowed" : "pointer"
          }}
        >
          Siguiente paso
        </button>

        <button
          onClick={reiniciar}
          style={{
            ...boton,
            background: "#ff3045",
            color: "white"
          }}
        >
          Reiniciar simulación
        </button>
      </div>

      <p style={{ fontSize: 11, marginTop: 12, color: "#aeb6c2" }}>
        Simulación educativa simplificada. La recuperación controlada
        solo es aplicable a recursos que admiten expropiación segura.
      </p>
    </div>
  );
}
