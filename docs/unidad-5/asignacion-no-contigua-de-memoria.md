---
sidebar_position: 6
title: Asignación No Contigua de Memoria
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Asignación No Contigua de Memoria

La **asignación no contigua de memoria** es una técnica de administración de memoria en la que las partes de un proceso pueden ubicarse en diferentes regiones de la memoria física, sin necesidad de estar todas juntas.

A diferencia de la asignación contigua, que necesita una región continua suficientemente grande, la asignación no contigua permite aprovechar espacios físicos separados. El sistema operativo mantiene la información necesaria para localizar cada parte del proceso y acceder a ella cuando se ejecuta.

Esta técnica permite utilizar la memoria con mayor flexibilidad. Dos mecanismos importantes que la emplean son la **paginación** y la **segmentación**, aunque organizan la memoria de manera diferente.

## Dos formas de organizar la memoria

<Tabs>
  <TabItem value="contigua" label="Asignación contigua" default>

    <div style={{textAlign: 'center'}}>

      **Un proceso ocupa una región continua**

      <div style={{maxWidth: 420, margin: '16px auto', border: '2px solid #64748b', borderRadius: 12, overflow: 'hidden'}}>
        <div style={{background: '#DCE7F5', color: '#243D63', padding: 15, fontWeight: 600}}>Sistema operativo</div>
        <div style={{background: '#F1F5F9', color: '#475569', padding: 12, borderTop: '2px solid #64748b'}}>Espacio ocupado</div>
        <div style={{background: '#D8F0E7', color: '#205C49', padding: 28, borderTop: '2px solid #64748b', fontWeight: 600}}>
          Proceso A
          <div style={{fontSize: 13, fontWeight: 400, marginTop: 5}}>Toda la región permanece junta</div>
        </div>
        <div style={{background: '#F1F5F9', color: '#475569', padding: 12, borderTop: '2px solid #64748b'}}>Espacio libre</div>
      </div>

    </div>

    **¿Cómo funciona?**

    El sistema operativo asigna al proceso una única región continua de memoria física. Si el proceso necesita 100 MB, debe encontrar un bloque contiguo que tenga capacidad suficiente.

    **Limitación:** puede resultar difícil ubicar un proceso grande cuando la memoria libre está dividida en varios bloques separados.

  </TabItem>
  <TabItem value="no-contigua" label="Asignación no contigua">

    <div style={{textAlign: 'center'}}>

      **Un proceso se distribuye en distintas regiones físicas**

      <div style={{maxWidth: 420, margin: '16px auto', border: '2px solid #64748b', borderRadius: 12, overflow: 'hidden'}}>
        <div style={{background: '#DCE7F5', color: '#243D63', padding: 13, fontWeight: 600}}>Sistema operativo</div>
        <div style={{display: 'flex', borderTop: '2px solid #64748b'}}>
          <div style={{background: '#D8F0E7', color: '#205C49', padding: 17, flex: 1, fontWeight: 600}}>Parte 1</div>
          <div style={{background: '#F1F5F9', color: '#475569', padding: 17, flex: 1}}>Otro proceso</div>
        </div>
        <div style={{background: '#F1F5F9', color: '#475569', padding: 13, borderTop: '2px solid #64748b'}}>Espacio ocupado</div>
        <div style={{display: 'flex', borderTop: '2px solid #64748b'}}>
          <div style={{background: '#D8F0E7', color: '#205C49', padding: 17, flex: 1, fontWeight: 600}}>Parte 2</div>
          <div style={{background: '#F1F5F9', color: '#475569', padding: 17, flex: 1}}>Espacio libre</div>
        </div>
        <div style={{background: '#DCE7F5', color: '#243D63', padding: 13, borderTop: '2px solid #64748b'}}>Tabla de traducción o estructuras de control</div>
      </div>

    </div>

    **¿Cómo funciona?**

    Las partes del proceso se ubican en diferentes regiones físicas. El sistema operativo utiliza estructuras de control para saber dónde se encuentra cada una y cómo acceder a ella.

    **Ventaja:** el proceso no necesita encontrar un único bloque físico grande. Puede aprovechar regiones separadas, de acuerdo con el mecanismo de asignación utilizado.

  </TabItem>
</Tabs>

## ¿Cómo se organiza la asignación no contigua?

Existen dos mecanismos importantes. Ambos permiten que un proceso utilice regiones físicas separadas, pero dividen y organizan su espacio de forma diferente.

<Tabs>
  <TabItem value="paginacion" label="Paginación" default>

    <div style={{padding: 16, borderRadius: 12, background: 'var(--ifm-color-emphasis-100)'}}>

      **El proceso se divide en páginas**

      La paginación divide el espacio lógico de un proceso en bloques de tamaño fijo llamados **páginas**. La memoria física también se divide en bloques del mismo tamaño llamados **marcos de página**.

      El sistema operativo mantiene una tabla de páginas que relaciona cada página con el marco físico donde está almacenada.

      <div style={{maxWidth: 380, margin: '18px auto', display: 'flex', gap: 8, alignItems: 'stretch'}}>
        <div style={{flex: 1, textAlign: 'center'}}>
          <div style={{fontWeight: 600, marginBottom: 8}}>Páginas</div>
          <div style={{background: '#D8F0E7', color: '#205C49', padding: 10, borderRadius: 6, marginBottom: 5}}>Pág. 0</div>
          <div style={{background: '#D8F0E7', color: '#205C49', padding: 10, borderRadius: 6, marginBottom: 5}}>Pág. 1</div>
          <div style={{background: '#D8F0E7', color: '#205C49', padding: 10, borderRadius: 6}}>Pág. 2</div>
        </div>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2878A8', fontWeight: 700, fontSize: 22}}>→</div>
        <div style={{flex: 1, textAlign: 'center'}}>
          <div style={{fontWeight: 600, marginBottom: 8}}>Marcos físicos</div>
          <div style={{background: '#DCE7F5', color: '#243D63', padding: 10, borderRadius: 6, marginBottom: 5}}>Marco 4</div>
          <div style={{background: '#DCE7F5', color: '#243D63', padding: 10, borderRadius: 6, marginBottom: 5}}>Marco 1</div>
          <div style={{background: '#DCE7F5', color: '#243D63', padding: 10, borderRadius: 6}}>Marco 7</div>
        </div>
      </div>

      Las páginas de un proceso pueden quedar en marcos físicos no consecutivos. La tabla de páginas permite localizar cada una.

    </div>

  </TabItem>
  <TabItem value="segmentacion" label="Segmentación">

    <div style={{padding: 16, borderRadius: 12, background: 'var(--ifm-color-emphasis-100)'}}>

      **El proceso se divide en segmentos lógicos**

      La segmentación divide el espacio lógico en unidades de tamaño variable que representan partes del programa, como el código, los datos o la pila.

      Cada segmento tiene información de ubicación y tamaño. El sistema utiliza una tabla de segmentos para traducir las direcciones lógicas y comprobar que el acceso se encuentre dentro de los límites permitidos.

      <div style={{maxWidth: 380, margin: '18px auto'}}>
        <div style={{background: '#D8F0E7', color: '#205C49', padding: 15, borderRadius: 6, marginBottom: 7, fontWeight: 600}}>
          Segmento de código
          <div style={{fontSize: 13, fontWeight: 400}}>Instrucciones del programa</div>
        </div>
        <div style={{background: '#DCE7F5', color: '#243D63', padding: 15, borderRadius: 6, marginBottom: 7, fontWeight: 600}}>
          Segmento de datos
          <div style={{fontSize: 13, fontWeight: 400}}>Información utilizada por el programa</div>
        </div>
        <div style={{background: '#E5EAF0', color: '#40566B', padding: 15, borderRadius: 6, fontWeight: 600}}>
          Segmento de pila
          <div style={{fontSize: 13, fontWeight: 400}}>Datos temporales de ejecución</div>
        </div>
      </div>

      Los segmentos tienen tamaños distintos porque representan unidades lógicas diferentes. En la memoria física pueden ubicarse separados unos de otros.

    </div>

  </TabItem>
</Tabs>

## ¿En qué se diferencian?

| Característica | Asignación contigua | Asignación no contigua |
|---|---|---|
| Ubicación del proceso | En una región continua | En distintas regiones físicas |
| Espacio físico requerido | Necesita un bloque suficientemente grande | Puede utilizar varios bloques separados |
| Control de ubicación | Puede utilizar una dirección base y límites | Necesita estructuras para localizar las partes |
| Fragmentación externa | Puede aparecer en esquemas de particiones variables | La paginación la evita como requisito para asignar un proceso; otros mecanismos no necesariamente eliminan toda fragmentación |
| Complejidad | Más sencilla en sus formas básicas | Requiere mecanismos de traducción y control |
| Ejemplos | Particiones fijas y variables | Paginación y segmentación |

La asignación no contigua ofrece mayor flexibilidad, pero necesita traducir las direcciones lógicas del proceso a ubicaciones físicas. Este trabajo es gestionado por el sistema operativo y, con frecuencia, por componentes de hardware como la unidad de gestión de memoria (MMU).

## Ejemplo práctico

Supongamos que un proceso necesita 100 MB y la memoria física tiene tres bloques libres separados de 40 MB, 35 MB y 25 MB. Para simplificar, ignoraremos el espacio reservado para el sistema operativo y las estructuras de control.

<Tabs>
  <TabItem value="ejemplo-contigua" label="Asignación contigua" default>

    <div style={{padding: 16, borderRadius: 12, background: 'var(--ifm-color-emphasis-100)', textAlign: 'center'}}>

      **Datos disponibles**

      - Memoria solicitada: 100 MB.
      - Bloques libres: 40 MB, 35 MB y 25 MB.

      <div style={{margin: '12px 0'}}>↓</div>

      **Paso 1.** Revisar el tamaño de cada bloque.

      Ninguno de los tres bloques tiene 100 MB.

      <div style={{margin: '12px 0'}}>↓</div>

      **Resultado:** el proceso no puede ubicarse en un único bloque contiguo con la distribución actual.

      <div style={{maxWidth: 360, margin: '16px auto', display: 'flex', gap: 5}}>
        <div style={{flex: 40, background: '#D8F0E7', color: '#205C49', padding: 12, borderRadius: 6, fontWeight: 600, fontSize: 12}}>40 MB</div>
        <div style={{flex: 35, background: '#DCE7F5', color: '#243D63', padding: 12, borderRadius: 6, fontWeight: 600, fontSize: 12}}>35 MB</div>
        <div style={{flex: 25, background: '#E5EAF0', color: '#40566B', padding: 12, borderRadius: 6, fontWeight: 600, fontSize: 12}}>25 MB</div>
      </div>

      Aunque los tres bloques suman 100 MB, están separados y no forman una sola región continua.

    </div>

  </TabItem>
  <TabItem value="ejemplo-no-contigua" label="Asignación no contigua">

    <div style={{padding: 16, borderRadius: 12, background: 'var(--ifm-color-emphasis-100)', textAlign: 'center'}}>

      **Datos disponibles**

      - Memoria solicitada: 100 MB.
      - Bloques libres: 40 MB, 35 MB y 25 MB.

      <div style={{margin: '12px 0'}}>↓</div>

      **Paso 1.** Sumar la capacidad de los bloques.

      <div style={{padding: 12, margin: '12px auto', maxWidth: 280, background: 'var(--ifm-background-color)', borderRadius: 8, fontWeight: 600}}>
        40 + 35 + 25 = 100 MB
      </div>

      **Paso 2.** Distribuir las partes del proceso.

      <div style={{maxWidth: 360, margin: '16px auto', display: 'flex', gap: 5}}>
        <div style={{flex: 40, background: '#3B806D', color: '#FFFFFF', padding: 12, borderRadius: 6, fontWeight: 600, fontSize: 12}}>Parte A<br/>40 MB</div>
        <div style={{flex: 35, background: '#2878A8', color: '#FFFFFF', padding: 12, borderRadius: 6, fontWeight: 600, fontSize: 12}}>Parte B<br/>35 MB</div>
        <div style={{flex: 25, background: '#647B91', color: '#FFFFFF', padding: 12, borderRadius: 6, fontWeight: 600, fontSize: 12}}>Parte C<br/>25 MB</div>
      </div>

      **Resultado:** un mecanismo de asignación no contigua puede distribuir el proceso entre esos bloques, siempre que el esquema utilizado permita esas asignaciones y tenga espacio para sus estructuras de control.

    </div>

  </TabItem>
</Tabs>

Este ejemplo ilustra la diferencia principal: la asignación contigua exige una única región de 100 MB, mientras que la no contigua puede aprovechar distintas regiones físicas. En una implementación real de paginación, las páginas y los marcos tienen tamaños definidos; por ello, la distribución debe respetar esos tamaños y puede existir un pequeño desperdicio en la última página.

## Comprueba lo aprendido

Selecciona una respuesta para cada pregunta. Al terminar, pulsa **Comprobar respuestas** para revisar tu resultado.

<div className="quiz-memoria quiz-no-contigua">

  <p><strong>1. ¿Cuál es la característica principal de la asignación no contigua?</strong></p>

  <label><input type="radio" name="nocontigua-pregunta1" value="a" /> El proceso debe ocupar una única región continua.</label>

  <label><input type="radio" name="nocontigua-pregunta1" value="b" /> Las partes del proceso pueden ubicarse en distintas regiones de la memoria física.</label>

  <label><input type="radio" name="nocontigua-pregunta1" value="c" /> El sistema operativo deja de controlar las direcciones de memoria.</label>

  <p><strong>2. ¿Qué estructura utiliza la paginación para relacionar las páginas con los marcos físicos?</strong></p>

  <label><input type="radio" name="nocontigua-pregunta2" value="a" /> Una tabla de páginas.</label>

  <label><input type="radio" name="nocontigua-pregunta2" value="b" /> Una cola de impresión.</label>

  <label><input type="radio" name="nocontigua-pregunta2" value="c" /> Una partición fija para todo el proceso.</label>

  <p><strong>3. Hay bloques libres separados de 40 MB, 35 MB y 25 MB. ¿Por qué un proceso de 100 MB no puede ubicarse en un único bloque mediante asignación contigua?</strong></p>

  <label><input type="radio" name="nocontigua-pregunta3" value="a" /> Porque la memoria libre total es menor que 100 MB.</label>

  <label><input type="radio" name="nocontigua-pregunta3" value="b" /> Porque la memoria no contigua solo permite procesos de 50 MB.</label>

  <label><input type="radio" name="nocontigua-pregunta3" value="c" /> Porque ningún bloque individual tiene 100 MB, aunque la suma sea 100 MB.</label>

  <div style={{textAlign: 'center', marginTop: '24px'}}>
    <button
      type="button"
      className="button button--primary"
      onClick={() => {
        const root = document.querySelector('.quiz-no-contigua');
        const correctas = ['b', 'a', 'c'];
        let puntuacion = 0;
        let completas = true;

        correctas.forEach((correcta, i) => {
          const seleccionada = root.querySelector(`input[name="nocontigua-pregunta${i + 1}"]:checked`);

          if (!seleccionada) {
            completas = false;
          } else if (seleccionada.value === correcta) {
            puntuacion++;
          }
        });

        const resultado = root.querySelector('.resultado-no-contigua');

        if (!completas) {
          resultado.textContent = 'Responde las tres preguntas antes de comprobar.';
        } else {
          resultado.textContent = `Resultado: ${puntuacion} de 3 respuestas correctas.`;
        }
      }}
    >
      Comprobar respuestas
    </button>

    <button
      type="button"
      className="button button--secondary"
      style={{
        marginLeft: '12px',
        backgroundColor: '#3A9DAD',
        borderColor: '#3A9DAD',
        color: '#FFFFFF'
      }}
      onClick={() => {
        const root = document.querySelector('.quiz-no-contigua');

        root.querySelectorAll('input[type="radio"]').forEach(input => {
          input.checked = false;
        });

        root.querySelector('.resultado-no-contigua').textContent = '';
      }}
    >
      Reiniciar cuestionario
    </button>
  </div>

  <p className="resultado-no-contigua resultado-quiz" aria-live="polite" style={{textAlign: 'center'}}></p>

</div>

## Idea clave

La **asignación no contigua** permite que las partes de un proceso ocupen regiones físicas separadas, en lugar de exigir un único bloque continuo. La paginación organiza esas partes en páginas de tamaño fijo, mientras que la segmentación las organiza en unidades lógicas de tamaño variable. Ambos mecanismos necesitan información de traducción para localizar las partes del proceso en la memoria física.