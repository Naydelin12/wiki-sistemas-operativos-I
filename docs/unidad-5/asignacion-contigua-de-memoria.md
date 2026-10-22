---
sidebar_position: 2
title: Asignación Contigua de Memoria
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Asignación Contigua de Memoria

La **asignación contigua de memoria** es una técnica de gestión en la que cada proceso ocupa un único bloque continuo de direcciones de memoria principal (RAM). Es decir, el espacio reservado para un proceso se encuentra en una sola región, sin dividirse en bloques separados.

Esta técnica facilita la organización de la memoria, pero requiere controlar qué espacios están ocupados y cuáles permanecen disponibles.

## ¿Cómo funciona?

Cuando un proceso necesita ejecutarse, el sistema operativo busca una región de memoria suficientemente grande para alojarlo. Si encuentra un espacio adecuado, asigna ese bloque al proceso y registra qué parte de la memoria está ocupada.

<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px', margin: '24px 0' }}>
  <div style={{ border: '1px solid #C8DEE2', borderRadius: '12px', overflow: 'hidden', background: 'var(--ifm-background-surface-color)' }}>
    <div style={{ background: '#236B63', color: '#FFFFFF', padding: '12px', textAlign: 'center', fontWeight: 700 }}>Memoria principal (RAM)</div>
    <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <div style={{ background: '#E8E1F5', color: '#513C78', padding: '14px 8px', textAlign: 'center', borderRadius: '6px' }}>Sistema operativo</div>
      <div style={{ background: '#3A9DAD', color: '#FFFFFF', padding: '22px 8px', textAlign: 'center', borderRadius: '6px' }}>Proceso A</div>
      <div style={{ background: '#FCE7D9', color: '#884A2C', padding: '20px 8px', textAlign: 'center', border: '1px dashed #D99A76', borderRadius: '6px' }}>Espacio libre</div>
    </div>
  </div>
  <div style={{ border: '1px solid #C8DEE2', borderRadius: '12px', padding: '18px', background: 'var(--ifm-background-surface-color)' }}>
    <h3 style={{ marginTop: 0, color: '#236B63' }}>Idea principal</h3>
    <p>El proceso A ocupa una sola región continua de memoria. Las direcciones que utiliza dentro de esa región son consecutivas.</p>
    <p style={{ marginBottom: 0 }}>El espacio libre puede utilizarse para cargar otro proceso si tiene el tamaño adecuado.</p>
  </div>
</div>

## Características principales

- **Bloque único:** cada proceso se almacena en una región continua de memoria.
- **Direcciones consecutivas:** las posiciones asignadas al proceso forman una secuencia dentro del bloque.
- **Control de ocupación:** el sistema operativo debe conocer las regiones asignadas y los espacios disponibles.
- **Protección:** es necesario impedir que un proceso acceda indebidamente a la memoria de otro proceso o del sistema operativo.
- **Espacio suficiente:** para cargar un proceso, debe existir una región libre que cumpla con los requisitos de la técnica utilizada.

## Ejemplo de asignación

Supongamos que, después de reservar espacio para el sistema operativo, quedan **800 MB disponibles** para procesos. Un programa necesita 250 MB y otro necesita 300 MB.

Si se asignan ambos procesos en regiones contiguas, la distribución puede representarse así:

<div style={{ border: '1px solid #D8D5E8', borderRadius: '12px', padding: '18px', margin: '20px 0', background: 'var(--ifm-background-surface-color)' }}>
  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '8px', marginBottom: '10px', fontWeight: 600 }}>
    <span>Distribución de memoria</span>
    <span>800 MB</span>
  </div>
  <div style={{ display: 'flex', minHeight: '68px', borderRadius: '8px', overflow: 'hidden' }}>
    <div style={{ width: '31.25%', background: '#7866A6', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '5px', fontSize: '0.85rem', overflowWrap: 'anywhere' }}>Proceso A<br />250 MB</div>
    <div style={{ width: '37.5%', background: '#258779', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '5px', fontSize: '0.85rem', overflowWrap: 'anywhere' }}>Proceso B<br />300 MB</div>
    <div style={{ width: '31.25%', background: '#F2C879', color: '#594217', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '5px', fontSize: '0.85rem', overflowWrap: 'anywhere' }}>Libre<br />250 MB</div>
  </div>
  <p style={{ marginTop: '12px', marginBottom: 0 }}>Memoria utilizada por los procesos: 550 MB. Memoria libre restante: 250 MB.</p>
</div>

El ejemplo muestra que los dos procesos tienen bloques propios y continuos. La memoria que queda libre puede aprovecharse más adelante si se solicita una asignación compatible con ese espacio.

## Ventajas y limitaciones

| Ventajas | Limitaciones |
|---|---|
| Es sencilla de comprender y administrar. | Puede ser difícil encontrar un bloque libre suficientemente grande. |
| Cada proceso ocupa una región claramente delimitada. | Puede producir fragmentación externa cuando existen huecos libres separados. |
| Permite organizar y controlar las regiones de memoria. | El tamaño y la ubicación de los bloques condicionan las asignaciones posibles. |

## Relación con la fragmentación

En la asignación contigua, la **fragmentación externa** aparece cuando la memoria libre se divide en varios espacios pequeños. Aunque la suma de esos espacios sea suficiente para un proceso, puede que ninguno de ellos sea lo bastante grande por sí solo.

Por ejemplo, si hay tres espacios libres de 100 MB, 150 MB y 200 MB, suman 450 MB. Sin embargo, un proceso que necesita un bloque continuo de 350 MB no puede ubicarse en ninguno de ellos.

Esta situación ayuda a comprender por qué existen diferentes técnicas y algoritmos para administrar la memoria.

## ¿Por qué importa el tamaño de los espacios libres?

No basta con que exista suficiente memoria libre en total. En la asignación contigua, cada proceso necesita encontrar un único bloque continuo donde pueda almacenarse.

<Tabs>
  <TabItem value="bloque-grande" label="Situación 1: bloque grande">

    <div style={{ background: '#EDF7EE', border: '1px solid #B8DCC0', borderRadius: '12px', padding: '18px', margin: '12px 0' }}>
      <p style={{ color: '#245B38', fontWeight: 'bold', marginBottom: '12px' }}>Memoria libre: 400 MB</p>
      <div style={{ display: 'flex', minHeight: '58px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #9AC7A5' }}>
        <div style={{ width: '87.5%', background: '#3C9B70', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', textAlign: 'center', padding: '4px', fontSize: '0.85rem' }}>Proceso: 350 MB</div>
        <div style={{ width: '12.5%', minWidth: '42px', background: '#F4C66A', color: '#5C4211', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold' }}>50</div>
      </div>
      <p style={{ color: '#245B38', marginTop: '12px', marginBottom: 0 }}>El proceso necesita 350 MB y encuentra un bloque de 400 MB. <strong>Sí puede ser asignado.</strong></p>
    </div>

    **¿Qué observamos?**

    - Hay un solo bloque libre de 400 MB.
    - El proceso ocupa 350 MB.
    - Quedan 50 MB contiguos disponibles.

  </TabItem>
  <TabItem value="espacios-separados" label="Situación 2: espacios separados">

    <div style={{ background: '#FFF1ED', border: '1px solid #F0C1B8', borderRadius: '12px', padding: '18px', margin: '12px 0' }}>
      <p style={{ color: '#8C342B', fontWeight: 'bold', marginBottom: '12px' }}>Memoria libre total: 450 MB</p>
      <div style={{ display: 'grid', gridTemplateColumns: '100fr 70fr 150fr 70fr 200fr', gap: '4px' }}>
        <div style={{ minWidth: 0, minHeight: '78px', background: '#E99A79', borderRadius: '6px', color: '#54271F', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontWeight: 'bold', fontSize: '0.75rem', padding: '3px', overflowWrap: 'anywhere' }}>Libre<br />100 MB</div>
        <div style={{ minWidth: 0, minHeight: '78px', background: '#8174B8', borderRadius: '6px', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontSize: '0.7rem', padding: '3px', overflowWrap: 'anywhere' }}>Proceso<br />ocupado</div>
        <div style={{ minWidth: 0, minHeight: '78px', background: '#E99A79', borderRadius: '6px', color: '#54271F', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontWeight: 'bold', fontSize: '0.75rem', padding: '3px', overflowWrap: 'anywhere' }}>Libre<br />150 MB</div>
        <div style={{ minWidth: 0, minHeight: '78px', background: '#8174B8', borderRadius: '6px', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontSize: '0.7rem', padding: '3px', overflowWrap: 'anywhere' }}>Proceso<br />ocupado</div>
        <div style={{ minWidth: 0, minHeight: '78px', background: '#E99A79', borderRadius: '6px', color: '#54271F', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontWeight: 'bold', fontSize: '0.75rem', padding: '3px', overflowWrap: 'anywhere' }}>Libre<br />200 MB</div>
      </div>
      <p style={{ color: '#8C342B', marginTop: '12px', marginBottom: 0 }}>Aunque hay 450 MB libres en total, el proceso de 350 MB <strong>no puede ser asignado</strong>: ningún bloque individual es suficientemente grande.</p>
    </div>

    **¿Qué observamos?**

    - Los espacios libres están separados por áreas ocupadas.
    - Ningún bloque alcanza los 350 MB que necesita el proceso.
    - Esta situación es un ejemplo de **fragmentación externa**.

  </TabItem>
</Tabs>

### Comparación de las dos situaciones

| Característica | Bloque grande | Espacios separados |
|---|---|---|
| Memoria libre total | 400 MB | 450 MB |
| Tamaño del bloque más grande | 400 MB | 200 MB |
| ¿Cabe un proceso de 350 MB? | Sí | No |
| ¿La fragmentación externa impide asignarlo? | No | Sí |

**Idea clave:** en la asignación contigua, importa tanto la cantidad de memoria libre como el tamaño del bloque continuo más grande disponible.

## Comprueba lo aprendido

Selecciona una respuesta para cada pregunta. Al terminar, pulsa **Comprobar respuestas**.

<div className="quiz-memoria">

  <p><strong>1. ¿Qué caracteriza a la asignación contigua de memoria?</strong></p>

  <label><input type="radio" name="pregunta1" value="a" /> Cada proceso se divide obligatoriamente en páginas separadas.</label>

  <label><input type="radio" name="pregunta1" value="b" /> Cada proceso ocupa un único bloque continuo de memoria.</label>

  <label><input type="radio" name="pregunta1" value="c" /> Todos los procesos comparten las mismas direcciones de memoria.</label>

  <p><strong>2. Después de asignar 250 MB y 300 MB de un espacio disponible de 800 MB, ¿cuánto queda libre?</strong></p>

  <label><input type="radio" name="pregunta2" value="a" /> 250 MB.</label>

  <label><input type="radio" name="pregunta2" value="b" /> 300 MB.</label>

  <label><input type="radio" name="pregunta2" value="c" /> 550 MB.</label>

  <p><strong>3. ¿Por qué puede ocurrir fragmentación externa?</strong></p>

  <label><input type="radio" name="pregunta3" value="a" /> Porque un proceso utiliza menos memoria de la que se le asignó dentro de su bloque.</label>

  <label><input type="radio" name="pregunta3" value="b" /> Porque la memoria RAM pierde físicamente parte de su capacidad.</label>

  <label><input type="radio" name="pregunta3" value="c" /> Porque el espacio libre queda dividido en huecos separados y ninguno es suficientemente grande.</label>

  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px', marginTop: '24px' }}>
    <button
      className="button button--primary"
      onClick={() => {
        const root = document.querySelector('.quiz-memoria');
        const correctas = ['b', 'a', 'c'];
        let puntuacion = 0;
        let completas = true;

        correctas.forEach((correcta, i) => {
          const seleccionada = root.querySelector(`input[name="pregunta${i + 1}"]:checked`);
          if (!seleccionada) {
            completas = false;
          } else if (seleccionada.value === correcta) {
            puntuacion++;
          }
        });

        const resultado = root.querySelector('.resultado-quiz');

        if (!completas) {
          resultado.textContent = 'Responde las tres preguntas antes de comprobar.';
          resultado.style.backgroundColor = '#FFF0D5';
          resultado.style.color = '#805719';
        } else {
          resultado.textContent = `Resultado: ${puntuacion} de 3 respuestas correctas.`;
          resultado.style.backgroundColor = puntuacion === 3 ? '#DDF3E4' : '#FCE7D9';
          resultado.style.color = puntuacion === 3 ? '#245B38' : '#884A2C';
        }
      }}
    >
      Comprobar respuestas
    </button>

    <button
      className="button button--secondary"
      style={{ backgroundColor: '#3A9DAD', borderColor: '#3A9DAD', color: '#FFFFFF' }}
      onClick={() => {
        const root = document.querySelector('.quiz-memoria');
        root.querySelectorAll('input[type="radio"]').forEach(input => {
          input.checked = false;
        });
        const resultado = root.querySelector('.resultado-quiz');
        resultado.textContent = '';
        resultado.style.backgroundColor = '';
        resultado.style.color = '';
      }}
    >
      Reiniciar cuestionario
    </button>
  </div>

  <p className="resultado-quiz" aria-live="polite" style={{ textAlign: 'center', padding: '12px', borderRadius: '8px', fontWeight: 700 }}></p>

</div>

## Idea clave

La asignación contigua reserva para cada proceso un único bloque continuo de memoria. Su administración es relativamente sencilla, pero encontrar espacios adecuados y evitar la fragmentación externa son desafíos importantes.
