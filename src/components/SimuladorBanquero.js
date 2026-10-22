
import React, { useState } from "react";

const inicial = {
  available: [3, 3, 2],
  allocation: [
    [0, 1, 0],
    [2, 0, 0],
    [3, 0, 2],
    [2, 1, 1],
    [0, 0, 2]
  ],
  max: [
    [7, 5, 3],
    [3, 2, 2],
    [9, 0, 2],
    [2, 2, 2],
    [4, 3, 3]
  ]
};

const copiar = (estado) => ({
  available: [...estado.available],
  allocation: estado.allocation.map((fila) => [...fila]),
  max: estado.max.map((fila) => [...fila])
});

const calcularNeed = (estado) =>
  estado.max.map((fila, i) =>
    fila.map((valor, j) => valor - estado.allocation[i][j])
  );

function verificarSeguridad(estado) {
  const work = [...estado.available];
  const need = calcularNeed(estado);
  const finish = Array(5).fill(false);
  const secuencia = [];
  const pasos = [];

  let progreso = true;

  while (progreso) {
    progreso = false;

    for (let i = 0; i < 5; i++) {
      if (
        !finish[i] &&
        need[i].every((valor, j) => valor <= work[j])
      ) {
        const antes = [...work];

        for (let j = 0; j < 3; j++) {
          work[j] += estado.allocation[i][j];
        }

        finish[i] = true;
        secuencia.push(`P${i}`);
        pasos.push(
          `P${i}: Work [${antes.join(", ")}] → [${work.join(", ")}]`
        );

        progreso = true;
      }
    }
  }

  return {
    seguro: finish.every(Boolean),
    secuencia,
    pasos,
    pendientes: finish
      .map((valor, i) => (!valor ? `P${i}` : null))
      .filter(Boolean)
  };
}

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
  padding: "9px 12px",
  color: "#081512",
  fontWeight: "bold",
  cursor: "pointer"
};

export default function SimuladorBanquero() {
  const [estado, setEstado] = useState(() => copiar(inicial));
  const [proceso, setProceso] = useState(0);
  const [solicitud, setSolicitud] = useState(["0", "0", "0"]);
  const [resultado, setResultado] = useState(null);
  const [historial, setHistorial] = useState([
    "Sistema iniciado. Available = [3, 3, 2]."
  ]);

  const need = calcularNeed(estado);

  const registrar = (mensaje) => {
    setHistorial((anterior) => [...anterior, mensaje]);
  };

  const comprobar = () => {
    const analisis = verificarSeguridad(estado);
    setResultado({
      ...analisis,
      titulo: analisis.seguro
        ? "ESTADO SEGURO"
        : "ESTADO INSEGURO"
    });

    registrar(
      analisis.seguro
        ? `Verificación: estado seguro. Secuencia: ${analisis.secuencia.join(" → ")}.`
        : "Verificación: no existe una secuencia segura."
    );
  };

  const solicitar = () => {
    const valores = solicitud.map(Number);

    if (
      solicitud.some((valor) => valor.trim() === "") ||
      valores.some((valor) => !Number.isInteger(valor) || valor < 0)
    ) {
      registrar("Solicitud inválida: ingresa enteros no negativos.");
      setResultado({
        titulo: "SOLICITUD INVÁLIDA",
        error: true
      });
      return;
    }

    if (valores.every((valor) => valor === 0)) {
      registrar("Solicitud sin cambios: [0, 0, 0].");
      setResultado({
        titulo: "SIN CAMBIOS",
        error: true
      });
      return;
    }

    if (valores.some((valor, j) => valor > need[proceso][j])) {
      registrar(`P${proceso}: solicitud superior a su necesidad.`);
      setResultado({
        titulo: "SOLICITUD INVÁLIDA",
        error: true,
        mensaje: "La solicitud supera la necesidad declarada."
      });
      return;
    }

    if (valores.some((valor, j) => valor > estado.available[j])) {
      registrar(`P${proceso}: recursos insuficientes. Debe esperar.`);
      setResultado({
        titulo: "RECURSOS INSUFICIENTES",
        error: true,
        mensaje: "No existen suficientes recursos disponibles."
      });
      return;
    }

    const temporal = copiar(estado);

    for (let j = 0; j < 3; j++) {
      temporal.available[j] -= valores[j];
      temporal.allocation[proceso][j] += valores[j];
    }

    const analisis = verificarSeguridad(temporal);

    if (analisis.seguro) {
      setEstado(temporal);
      setResultado({
        ...analisis,
        titulo: "SOLICITUD APROBADA",
        mensaje: "La asignación mantiene el sistema seguro."
      });

      registrar(
        `P${proceso} solicita [${valores.join(", ")}]: APROBADA.`
      );
    } else {
      setResultado({
        ...analisis,
        titulo: "SOLICITUD POSPUESTA",
        error: true,
        mensaje: "La asignación produciría un estado inseguro."
      });

      registrar(
        `P${proceso} solicita [${valores.join(", ")}]: POSPUESTA por seguridad.`
      );
    }
  };

  const reiniciar = () => {
    setEstado(copiar(inicial));
    setProceso(0);
    setSolicitud(["0", "0", "0"]);
    setResultado(null);
    setHistorial([
      "Sistema restablecido. Available = [3, 3, 2]."
    ]);
  };

  const tabla = (titulo, datos) => (
    <div style={{ flex: 1, minWidth: 190 }}>
      <h4>{titulo}</h4>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", fontSize: 13 }}>
          <thead>
            <tr>
              <th>Proceso</th>
              <th>A</th>
              <th>B</th>
              <th>C</th>
            </tr>
          </thead>
          <tbody>
            {datos.map((fila, i) => (
              <tr key={i}>
                <td>P{i}</td>
                {fila.map((valor, j) => (
                  <td key={j}>{valor}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
        Simulador Interactivo del Algoritmo del Banquero
      </h3>

      <p>
        Comprueba estados seguros y evalúa solicitudes
        de recursos mediante el Algoritmo del Banquero.
      </p>

      <h4>Estado actual del sistema</h4>

      <div style={{
        ...panel,
        textAlign: "center",
        marginBottom: 15
      }}>
        <strong>Recursos disponibles (Available)</strong>
        <h2 style={{ color: "#20bfa6", marginTop: 10 }}>
          [{estado.available.join(", ")}]
        </h2>
        <p>Tipos de recursos: A, B y C</p>
      </div>

      <h4>Matrices del sistema</h4>

      <div style={{
        display: "flex",
        gap: 12,
        flexWrap: "wrap"
      }}>
        {tabla("Allocation", estado.allocation)}
        {tabla("Max", estado.max)}
        {tabla("Need", need)}
      </div>

      <h4>Verificación de seguridad</h4>

      <button onClick={comprobar} style={boton}>
        Verificar estado seguro
      </button>

      <h4>Solicitud de recursos</h4>

      <div style={panel}>
        <label>
          <strong>Seleccionar proceso</strong>
        </label>

        <select
          value={proceso}
          onChange={(e) => setProceso(Number(e.target.value))}
          style={{
            width: "100%",
            padding: 8,
            marginTop: 8,
            background: "#333",
            color: "white"
          }}
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <option key={i} value={i}>P{i}</option>
          ))}
        </select>

        <p style={{ marginTop: 12 }}>
          Solicitud de recursos (A, B, C)
        </p>

        <div style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap"
        }}>
          {solicitud.map((valor, j) => (
            <label key={j} style={{ flex: 1, minWidth: 65 }}>
              {["A", "B", "C"][j]}
              <input
                type="number"
                min="0"
                step="1"
                value={valor}
                onChange={(e) => {
                  const copia = [...solicitud];
                  copia[j] = e.target.value;
                  setSolicitud(copia);
                }}
                style={{
                  width: "100%",
                  padding: 8,
                  background: "#333",
                  color: "white",
                  border: "1px solid #777",
                  borderRadius: 4
                }}
              />
            </label>
          ))}
        </div>

        <button
          onClick={solicitar}
          style={{ ...boton, marginTop: 12 }}
        >
          Solicitar recursos
        </button>
      </div>

      {resultado && (
        <div style={{
          ...panel,
          marginTop: 15,
          borderColor: resultado.error
            ? "#ef4444"
            : "#20bfa6"
        }}>
          <strong style={{
            color: resultado.error
              ? "#ef4444"
              : "#20bfa6"
          }}>
            {resultado.titulo}
          </strong>

          {resultado.mensaje && <p>{resultado.mensaje}</p>}

          {resultado.secuencia && (
            <>
              <p>
                Secuencia encontrada:{" "}
                {resultado.secuencia.length
                  ? resultado.secuencia.join(" → ")
                  : "Ninguna"}
              </p>

              <strong>Pasos del análisis:</strong>

              <div style={{
                maxHeight: 170,
                overflowY: "auto",
                marginTop: 8
              }}>
                {resultado.pasos.map((paso, i) => (
                  <p key={i}>{i + 1}. {paso}</p>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <h4>Historial de decisiones</h4>

      <div style={{
        ...panel,
        background: "#1b1e23",
        maxHeight: 180,
        overflowY: "auto"
      }}>
        {historial.map((mensaje, i) => (
          <div key={i} style={{
            padding: "8px 0",
            borderBottom: "1px solid #454b55"
          }}>
            {i + 1}. {mensaje}
          </div>
        ))}
      </div>

      <button
        onClick={reiniciar}
        style={{
          ...boton,
          background: "#ff3045",
          color: "white",
          marginTop: 15
        }}
      >
        Reiniciar simulación
      </button>
    </div>
  );
}
