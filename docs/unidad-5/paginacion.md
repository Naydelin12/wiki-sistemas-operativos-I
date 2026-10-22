---
sidebar_position: 7
title: Paginación
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Paginación

La **paginación** es una técnica de administración de memoria que permite que un proceso se almacene en diferentes partes de la memoria física, sin necesidad de ocupar un espacio continuo.

Para lograrlo, el sistema operativo divide la memoria lógica de un proceso en bloques llamados **páginas** y la memoria física (RAM) en bloques del mismo tamaño llamados **marcos** o *frames*. Una tabla de páginas relaciona cada página con el marco en el que se encuentra.

De esta manera, un proceso puede utilizar varios espacios disponibles en la RAM, aunque estén separados entre sí. Esto facilita la asignación de memoria y reduce los problemas de fragmentación externa.

## ¿Cómo se divide la memoria?

Las páginas y los marcos tienen el mismo tamaño, pero pertenecen a espacios diferentes: las páginas forman parte de la memoria lógica del proceso y los marcos forman parte de la memoria física.

<Tabs>
  <TabItem value="logica" label="Memoria lógica" default>

    <div style={{textAlign: 'center'}}>

      **Páginas de un proceso**

      <div style={{maxWidth: 420, margin: '16px auto', border: '2px solid #64748b', borderRadius: 12, overflow: 'hidden'}}>
        <div style={{background: '#DCE7F5', color: '#243D63', padding: 18, fontWeight: 600, borderBottom: '2px solid #64748b'}}>
          Página 0
        </div>
        <div style={{background: '#D8F0E7', color: '#205C49', padding: 18, fontWeight: 600, borderBottom: '2px solid #64748b'}}>
          Página 1
        </div>
        <div style={{background: '#DCE7F5', color: '#243D63', padding: 18, fontWeight: 600, borderBottom: '2px solid #64748b'}}>
          Página 2
        </div>
        <div style={{background: '#D8F0E7', color: '#205C49', padding: 18, fontWeight: 600}}>
          Página 3
        </div>
      </div>

    </div>

    La memoria lógica representa el espacio de direcciones que utiliza un proceso. El sistema la divide en páginas de tamaño fijo y les asigna números para identificarlas.

  </TabItem>
  <TabItem value="fisica" label="Memoria física">

    <div style={{textAlign: 'center'}}>

      **Marcos disponibles en la RAM**

      <div style={{maxWidth: 420, margin: '16px auto', border: '2px solid #64748b', borderRadius: 12, overflow: 'hidden'}}>
        <div style={{background: '#DCE7F5', color: '#243D63', padding: 14, fontWeight: 600, borderBottom: '2px solid #64748b'}}>
          Marco 0: Página 2
        </div>
        <div style={{background: '#F1F5F9', color: '#475569', padding: 14, borderBottom: '2px solid #64748b'}}>
          Marco 1: Libre
        </div>
        <div style={{background: '#D8F0E7', color: '#205C49', padding: 14, fontWeight: 600, borderBottom: '2px solid #64748b'}}>
          Marco 2: Página 0
        </div>
        <div style={{background: '#F1F5F9', color: '#475569', padding: 14, borderBottom: '2px solid #64748b'}}>
          Marco 3: Otro uso
        </div>
        <div style={{background: '#DCE7F5', color: '#243D63', padding: 14, fontWeight: 600, borderBottom: '2px solid #64748b'}}>
          Marco 4: Página 3
        </div>
        <div style={{background: '#D8F0E7', color: '#205C49', padding: 14, fontWeight: 600}}>
          Marco 5: Página 1
        </div>
      </div>

    </div>

    La memoria física se divide en marcos del mismo tamaño que las páginas. Como se observa, las páginas de un proceso pueden estar ubicadas en marcos diferentes y no necesitan ocupar posiciones consecutivas.

  </TabItem>
</Tabs>

**¿Por qué las páginas y los marcos tienen el mismo tamaño?**

Porque cualquier página puede ocupar un marco disponible sin necesitar un bloque físico continuo de un tamaño especial. Esto simplifica la asignación de memoria y permite aprovechar los marcos libres.

## ¿Cómo funciona la tabla de páginas?

La **tabla de páginas** es una estructura que permite localizar cada página de un proceso en la memoria física. El sistema operativo mantiene esta correspondencia para que el hardware pueda traducir las direcciones lógicas a direcciones físicas.

<Tabs>
  <TabItem value="relacion" label="Relación entre páginas y marcos" default>

    En este ejemplo, cada página del proceso está asociada a un marco específico.

    | Página | Marco asignado |
    |---|---:|
    | Página 0 | Marco 2 |
    | Página 1 | Marco 5 |
    | Página 2 | Marco 0 |
    | Página 3 | Marco 4 |

    La tabla permite encontrar el marco correspondiente sin importar que las páginas estén almacenadas en posiciones físicas separadas.

  </TabItem>
  <TabItem value="recorrido" label="Recorrido de una dirección">

    <div style={{maxWidth: 460, margin: '16px auto', textAlign: 'center'}}>

      <div style={{padding: 16, border: '2px solid #64748b', borderRadius: 10, background: '#DCE7F5', color: '#243D63', fontWeight: 600}}>
        Dirección lógica
        <div style={{fontWeight: 400}}>Número de página + desplazamiento</div>
      </div>

      <div style={{fontSize: 24, padding: 6, color: '#2878a8'}}>↓</div>

      <div style={{padding: 16, border: '2px solid #3A9DAD', borderRadius: 10, background: '#D8F0E7', color: '#205C49', fontWeight: 600}}>
        Tabla de páginas
        <div style={{fontWeight: 400}}>Localiza el marco asignado</div>
      </div>

      <div style={{fontSize: 24, padding: 6, color: '#2878a8'}}>↓</div>

      <div style={{padding: 16, border: '2px solid #64748b', borderRadius: 10, background: '#F1F5F9', color: '#334155', fontWeight: 600}}>
        Dirección física
        <div style={{fontWeight: 400}}>Número de marco + desplazamiento</div>
      </div>

    </div>

    El número de página permite consultar la tabla. Una vez localizado el marco, se conserva el desplazamiento para identificar la posición exacta dentro de él.

  </TabItem>
</Tabs>

## ¿Cómo se traduce una dirección?

Una dirección lógica se divide en dos partes:

- **Número de página:** identifica la página en la que se encuentra la dirección solicitada.
- **Desplazamiento (*offset*):** indica la posición dentro de esa página.

El sistema utiliza el número de página para consultar la tabla y obtener el marco correspondiente. Después, combina el número del marco con el desplazamiento para calcular la dirección física.

## Ejemplo práctico

Supongamos que un proceso utiliza páginas de **100 bytes** y necesita acceder a la dirección lógica **250**. La tabla de páginas indica que la página 2 se encuentra en el marco 7.

Para este ejemplo, las páginas y los marcos comienzan a numerarse desde cero.

<Tabs>
  <TabItem value="datos" label="Datos del ejemplo" default>

    | Elemento | Valor |
    |---|---:|
    | Tamaño de página | 100 bytes |
    | Dirección lógica | 250 |
    | Número de página | 2 |
    | Desplazamiento | 50 bytes |
    | Marco asignado a la página 2 | 7 |

    Como cada página tiene 100 bytes, la página 0 abarca las direcciones 0–99, la página 1 las direcciones 100–199 y la página 2 las direcciones 200–299.

    Por eso, la dirección lógica 250 pertenece a la página 2 y está a 50 bytes del inicio de esa página.

  </TabItem>
  <TabItem value="calculo" label="Cálculo paso a paso">

    **Paso 1. Encontrar el número de página**

    Dividimos la dirección lógica entre el tamaño de página y tomamos la parte entera:

    ```text
    250 ÷ 100 = 2, con residuo 50
    ```

    El número de página es 2 y el desplazamiento es 50.

    **Paso 2. Consultar la tabla de páginas**

    La tabla indica que la página 2 está ubicada en el marco 7.

    **Paso 3. Calcular la dirección física**

    Multiplicamos el número de marco por el tamaño del marco y sumamos el desplazamiento:

    ```text
    Dirección física = (marco × tamaño) + desplazamiento

    Dirección física = (7 × 100) + 50

    Dirección física = 750 bytes
    ```

    **Resultado:** la dirección lógica 250 corresponde a la dirección física 750.

  </TabItem>
  <TabItem value="visual" label="Representación">

    <div style={{maxWidth: 440, margin: '16px auto', textAlign: 'center'}}>

      <div style={{padding: 16, border: '2px solid #64748b', borderRadius: 10, background: '#DCE7F5', color: '#243D63'}}>
        <strong>Dirección lógica</strong>
        <div style={{display: 'flex', gap: 8, marginTop: 10}}>
          <div style={{flex: 1, padding: 10, background: '#FFFFFF', borderRadius: 6}}>Página 2</div>
          <div style={{flex: 1, padding: 10, background: '#FFFFFF', borderRadius: 6}}>Offset 50</div>
        </div>
      </div>

      <div style={{fontSize: 24, padding: 8, color: '#2878a8'}}>↓</div>

      <div style={{padding: 16, border: '2px solid #3A9DAD', borderRadius: 10, background: '#D8F0E7', color: '#205C49'}}>
        <strong>Tabla de páginas</strong>
        <div style={{marginTop: 8}}>Página 2 → Marco 7</div>
      </div>

      <div style={{fontSize: 24, padding: 8, color: '#2878a8'}}>↓</div>

      <div style={{padding: 16, border: '2px solid #64748b', borderRadius: 10, background: '#F1F5F9', color: '#334155'}}>
        <strong>Dirección física</strong>
        <div style={{marginTop: 8}}>(7 × 100) + 50 = 750 bytes</div>
      </div>

    </div>

    El desplazamiento se conserva durante la traducción. Lo que cambia es el número de página por el número del marco correspondiente.

  </TabItem>
</Tabs>

## Ventajas y limitaciones de la paginación

La paginación facilita la asignación de memoria, aunque requiere estructuras y operaciones adicionales para traducir las direcciones.

| Ventajas | Limitaciones |
|---|---|
| Permite almacenar un proceso en marcos no consecutivos. | Se necesita memoria adicional para las tablas de páginas. |
| Evita la fragmentación externa en la asignación de marcos. | Puede existir fragmentación interna en la última página asignada. |
| Facilita la asignación de marcos disponibles. | La traducción de direcciones requiere trabajo adicional. |
| Permite organizar de forma flexible la memoria física. | Si faltan marcos disponibles, el sistema debe gestionar la falta de memoria. |

La paginación **no elimina toda la fragmentación**. Por ejemplo, si un proceso necesita 230 bytes y el tamaño de página es de 100 bytes, necesitará tres páginas, con una capacidad total de 300 bytes. Quedarán 70 bytes sin utilizar en la última página, lo que constituye fragmentación interna en este ejemplo.

Para acelerar la traducción, muchos sistemas utilizan una **TLB** (*Translation Lookaside Buffer*), una memoria caché especializada que conserva traducciones recientes de direcciones. Cuando encuentra una traducción disponible, puede evitar una consulta adicional a la tabla de páginas en la memoria principal.

## Comprueba lo aprendido

Selecciona una respuesta para cada pregunta. Después, pulsa **Comprobar respuestas** para revisar tu resultado.

<div className="quiz-memoria quiz-paginacion">

  <p><strong>1. ¿Cuál es la diferencia entre una página y un marco?</strong></p>

  <label><input type="radio" name="paginacion-pregunta1" value="a" /> Ambos pertenecen a la memoria física.</label>

  <label><input type="radio" name="paginacion-pregunta1" value="b" /> Las páginas pertenecen a la memoria lógica del proceso y los marcos a la memoria física.</label>

  <label><input type="radio" name="paginacion-pregunta1" value="c" /> Las páginas siempre son más grandes que los marcos.</label>

  <p><strong>2. ¿Para qué sirve la tabla de páginas?</strong></p>

  <label><input type="radio" name="paginacion-pregunta2" value="a" /> Para decidir qué proceso debe terminar primero.</label>

  <label><input type="radio" name="paginacion-pregunta2" value="b" /> Para aumentar el tamaño físico de la RAM.</label>

  <label><input type="radio" name="paginacion-pregunta2" value="c" /> Para relacionar cada página con el marco físico donde se encuentra.</label>

  <p><strong>3. Si el tamaño de página es 100 bytes, la dirección lógica es 250 y la página 2 está en el marco 7, ¿cuál es la dirección física?</strong></p>

  <label><input type="radio" name="paginacion-pregunta3" value="a" /> 750 bytes.</label>

  <label><input type="radio" name="paginacion-pregunta3" value="b" /> 250 bytes.</label>

  <label><input type="radio" name="paginacion-pregunta3" value="c" /> 700 bytes.</label>

  <div style={{textAlign: 'center', marginTop: '24px'}}>

    <button
      className="button button--primary"
      onClick={() => {
        const root = document.querySelector('.quiz-paginacion');
        const correctas = ['b', 'c', 'a'];
        let puntuacion = 0;
        let completas = true;

        correctas.forEach((correcta, i) => {
          const seleccionada = root.querySelector('input[name="paginacion-pregunta' + (i + 1) + '"]:checked');

          if (!seleccionada) {
            completas = false;
          } else if (seleccionada.value === correcta) {
            puntuacion++;
          }
        });

        const resultado = root.querySelector('.resultado-paginacion');

        if (!completas) {
          resultado.textContent = 'Responde las tres preguntas antes de comprobar.';
        } else {
          resultado.textContent = 'Resultado: ' + puntuacion + ' de 3 respuestas correctas.';
        }
      }}
    >
      Comprobar respuestas
    </button>

    <button
      className="button button--secondary"
      style={{marginLeft: '12px', backgroundColor: '#3A9DAD', borderColor: '#3A9DAD', color: '#FFFFFF'}}
      onClick={() => {
        const root = document.querySelector('.quiz-paginacion');

        root.querySelectorAll('input[type="radio"]').forEach(input => {
          input.checked = false;
        });

        root.querySelector('.resultado-paginacion').textContent = '';
      }}
    >
      Reiniciar cuestionario
    </button>

  </div>

  <p className="resultado-quiz resultado-paginacion" aria-live="polite" style={{textAlign: 'center'}}></p>

</div>

## Idea clave

La paginación divide la memoria lógica de un proceso en páginas y la memoria física en marcos del mismo tamaño. Gracias a la tabla de páginas, cada página puede ubicarse en un marco diferente de la RAM, sin exigir que todo el proceso ocupe un espacio físico continuo.

**Recuerda:** el número de página permite encontrar el marco correspondiente, mientras que el desplazamiento indica la posición exacta dentro de ese marco.