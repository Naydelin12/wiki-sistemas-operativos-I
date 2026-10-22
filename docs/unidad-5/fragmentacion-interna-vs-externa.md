---
sidebar_position: 5
title: Fragmentación Interna vs. Fragmentación Externa
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Fragmentación Interna vs. Fragmentación Externa

La **fragmentación de memoria** es un problema que aparece cuando el espacio disponible en la memoria principal (RAM) no se aprovecha de manera eficiente. Esto puede ocurrir durante la asignación y liberación de memoria de los procesos, especialmente cuando el sistema operativo debe administrar diferentes tamaños de solicitudes.

Existen dos tipos principales: **fragmentación interna** y **fragmentación externa**. Para comprender la diferencia, es importante recordar que el sistema operativo asigna regiones de memoria a los procesos y debe controlar qué espacios están ocupados y cuáles permanecen disponibles.

La fragmentación no significa necesariamente que toda la memoria esté ocupada. En algunos casos, existe espacio sin utilizar dentro de una región asignada; en otros, la memoria libre está repartida en varios bloques separados.

## Dos tipos de fragmentación

<Tabs>
  <TabItem value="interna" label="Fragmentación interna" default>

    <div style={{textAlign: 'center'}}>

      **Espacio sin utilizar dentro de un bloque asignado**

      <div style={{maxWidth: 420, margin: '16px auto', border: '2px solid #64748b', borderRadius: 12, overflow: 'hidden'}}>
        <div style={{background: '#D8F0E7', color: '#205C49', padding: 24, fontWeight: 600}}>
          Memoria utilizada por el proceso
          <div style={{fontSize: 14, fontWeight: 400, marginTop: 6}}>70 MB</div>
        </div>
        <div style={{background: '#DCE7F5', color: '#243D63', padding: 22, borderTop: '2px solid #64748b', fontWeight: 600}}>
          Espacio desperdiciado
          <div style={{fontSize: 14, fontWeight: 400, marginTop: 6}}>30 MB</div>
        </div>
      </div>

      <div style={{color: 'var(--ifm-color-emphasis-700)', fontSize: 14}}>Tamaño total del bloque asignado: 100 MB</div>

    </div>

    **¿Cómo se produce?**

    La fragmentación interna ocurre cuando un proceso recibe un bloque de memoria más grande que la cantidad que necesita. La parte que no utiliza queda dentro del bloque que se le asignó.

    Por ejemplo, si un proceso necesita 70 MB y el sistema le asigna una partición fija de 100 MB, quedan 30 MB sin utilizar. Aunque esos 30 MB están físicamente presentes en la RAM, pertenecen a la partición asignada y no pueden entregarse directamente a otro proceso mientras se mantenga esa asignación.

    **¿Por qué sucede?**

    Una causa habitual es utilizar particiones de tamaño fijo. Como sus límites están establecidos de antemano, el tamaño de la partición puede no coincidir con las necesidades exactas del proceso. También puede aparecer en otros sistemas de asignación que utilizan unidades o bloques de tamaño definido.

    **¿Qué consecuencia tiene?**

    La memoria desperdiciada reduce el espacio que el sistema puede aprovechar para otros procesos. Si se repite en varias particiones, la suma de esos espacios puede representar una cantidad importante de RAM que no está disponible para nuevas asignaciones.

  </TabItem>
  <TabItem value="externa" label="Fragmentación externa">

    <div style={{textAlign: 'center'}}>

      **Memoria libre repartida en varios bloques**

      <div style={{maxWidth: 420, margin: '16px auto', border: '2px solid #64748b', borderRadius: 12, overflow: 'hidden'}}>
        <div style={{background: '#D8F0E7', color: '#205C49', padding: 17, fontWeight: 600}}>
          Bloque libre: 20 MB
        </div>
        <div style={{background: '#F1F5F9', color: '#475569', padding: 13, borderTop: '2px solid #64748b'}}>
          Región ocupada
        </div>
        <div style={{background: '#D8F0E7', color: '#205C49', padding: 17, borderTop: '2px solid #64748b', fontWeight: 600}}>
          Bloque libre: 40 MB
        </div>
        <div style={{background: '#F1F5F9', color: '#475569', padding: 13, borderTop: '2px solid #64748b'}}>
          Región ocupada
        </div>
        <div style={{background: '#D8F0E7', color: '#205C49', padding: 17, borderTop: '2px solid #64748b', fontWeight: 600}}>
          Bloque libre: 50 MB
        </div>
      </div>

      <div style={{color: 'var(--ifm-color-emphasis-700)', fontSize: 14}}>Espacio libre total: 110 MB, dividido en tres bloques.</div>

    </div>

    **¿Cómo se produce?**

    La fragmentación externa ocurre cuando el espacio libre de la memoria queda dividido en regiones separadas por bloques ocupados. Puede aparecer cuando se asignan y liberan procesos de diferentes tamaños y los espacios que quedan disponibles no se encuentran juntos.

    Por ejemplo, hay tres bloques libres de 20 MB, 40 MB y 50 MB. En total existen 110 MB disponibles. Sin embargo, si un proceso necesita 80 MB de memoria contigua, no puede utilizar ninguno de los tres bloques, porque el más grande solo tiene 50 MB.

    **¿Por qué sucede?**

    Es habitual en esquemas de asignación contigua con particiones variables. Los procesos reciben regiones de memoria de acuerdo con sus necesidades y, cuando terminan, liberan esas regiones. Con el tiempo, pueden quedar espacios libres entre procesos que continúan ocupando memoria.

    **¿Qué consecuencia tiene?**

    Puede impedir que un proceso obtenga una región contigua suficientemente grande, aunque la suma de toda la memoria libre sea superior a su solicitud. Por eso, la cantidad total de memoria disponible no siempre indica si una nueva asignación será posible.

  </TabItem>
</Tabs>

## ¿En qué se diferencian?

| Característica | Fragmentación interna | Fragmentación externa |
|---|---|---|
| Ubicación del espacio desperdiciado | Dentro de un bloque asignado | En bloques libres separados entre regiones ocupadas |
| Causa habitual | El bloque asignado es mayor que la necesidad del proceso | La memoria libre queda dividida en regiones no contiguas |
| Ejemplo | Se asignan 100 MB y se utilizan 70 MB | Hay 110 MB libres, pero distribuidos en bloques de 20, 40 y 50 MB |
| ¿El espacio está libre para otro proceso? | No directamente, porque forma parte del bloque asignado | Sí, pero cada bloque solo puede utilizarse según su tamaño y el tipo de asignación |
| Relación con las particiones | Es común en las particiones fijas | Es común en las particiones variables con asignación contigua |
| Posible estrategia para reducirla | Ajustar el tamaño de las unidades o particiones de asignación | Compactar la memoria, si el sistema lo permite, o utilizar otro esquema de asignación |

Es importante recordar que ambas fragmentaciones pueden reducir el aprovechamiento de la RAM, pero no se solucionan necesariamente de la misma manera. En la interna, el desperdicio se encuentra dentro de un bloque asignado; en la externa, el problema está en la distribución de los espacios libres.

## Ejemplo práctico

Supongamos que el sistema operativo debe asignar memoria a dos situaciones diferentes. En la primera, un proceso recibe una partición más grande de lo que necesita. En la segunda, existe suficiente memoria libre en total, pero está dividida en varios bloques.

<Tabs>
  <TabItem value="ejemplo-interna" label="Caso interno" default>

    <div style={{padding: 16, borderRadius: 12, background: 'var(--ifm-color-emphasis-100)', textAlign: 'center'}}>

      **Datos del problema**

      - Memoria de la partición: 100 MB.
      - Memoria que necesita el proceso: 70 MB.

      <div style={{margin: '12px 0'}}>↓</div>

      **Paso 1.** Restar la memoria utilizada al tamaño de la partición.

      <div style={{padding: 12, margin: '12px auto', maxWidth: 300, background: 'var(--ifm-background-color)', borderRadius: 8, fontWeight: 600}}>
        100 MB − 70 MB = 30 MB
      </div>

      **Paso 2.** Interpretar el resultado.

      <div style={{maxWidth: 360, margin: '16px auto', display: 'flex', height: 44, borderRadius: 8, overflow: 'hidden'}}>
        <div style={{width: '70%', background: '#3B806D', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 12}}>70 MB usados</div>
        <div style={{width: '30%', background: '#DCE7F5', color: '#243D63', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 12}}>30 MB</div>
      </div>

      Los 30 MB representan fragmentación interna porque permanecen dentro de la partición asignada. No pueden asignarse de forma independiente a otro proceso en este esquema.

    </div>

  </TabItem>
  <TabItem value="ejemplo-externa" label="Caso externo">

    <div style={{padding: 16, borderRadius: 12, background: 'var(--ifm-color-emphasis-100)', textAlign: 'center'}}>

      **Datos del problema**

      - Bloque libre 1: 20 MB.
      - Bloque libre 2: 40 MB.
      - Bloque libre 3: 50 MB.
      - Memoria solicitada por el proceso: 80 MB.

      <div style={{margin: '12px 0'}}>↓</div>

      **Paso 1.** Sumar los bloques libres.

      <div style={{padding: 12, margin: '12px auto', maxWidth: 300, background: 'var(--ifm-background-color)', borderRadius: 8, fontWeight: 600}}>
        20 + 40 + 50 = 110 MB
      </div>

      **Paso 2.** Comparar cada bloque con la solicitud.

      <div style={{maxWidth: 360, margin: '16px auto', display: 'flex', gap: 5, alignItems: 'stretch'}}>
        <div style={{flex: 20, background: '#D8F0E7', color: '#205C49', padding: '12px 2px', borderRadius: 6, fontWeight: 600, fontSize: 12}}>20 MB</div>
        <div style={{flex: 40, background: '#DCE7F5', color: '#243D63', padding: '12px 2px', borderRadius: 6, fontWeight: 600, fontSize: 12}}>40 MB</div>
        <div style={{flex: 50, background: '#B9DCD2', color: '#205C49', padding: '12px 2px', borderRadius: 6, fontWeight: 600, fontSize: 12}}>50 MB</div>
      </div>

      **Paso 3.** Determinar si el proceso puede ubicarse.

      Ningún bloque individual alcanza los 80 MB solicitados. Por tanto, el proceso no puede recibir una región contigua de ese tamaño con la distribución actual, aunque haya 110 MB libres en total.

    </div>

  </TabItem>
</Tabs>

Los ejemplos muestran que no basta con conocer cuánta memoria queda sin utilizar. También hay que identificar **dónde se encuentra ese espacio y cómo está organizado**. Esa diferencia es fundamental para comprender por qué una asignación puede fallar aun cuando la memoria libre total parece suficiente.

## ¿Cómo se puede reducir la fragmentación?

No existe una única solución para todos los casos. La estrategia depende de cómo el sistema operativo organiza y asigna la memoria.

<Tabs>
  <TabItem value="reducir-interna" label="Reducir la interna" default>

    **Ajustar mejor el tamaño de asignación**

    Una forma de reducir la fragmentación interna consiste en evitar que los bloques asignados sean mucho mayores que las necesidades de los procesos, siempre que el sistema permita ajustar su tamaño.

    Por ejemplo, si un proceso necesita 70 MB y se le asignan 100 MB, quedan 30 MB sin aprovechar. Si el esquema permitiera asignarle una región de 72 MB, el desperdicio dentro de esa región sería de solo 2 MB.

    <div style={{maxWidth: 360, margin: '16px auto', border: '1px solid #cbd5e1', borderRadius: 10, overflow: 'hidden'}}>
      <div style={{background: '#D8F0E7', color: '#205C49', padding: 12, fontWeight: 600, textAlign: 'center'}}>70 MB utilizados</div>
      <div style={{background: '#DCE7F5', color: '#243D63', padding: 10, borderTop: '1px solid #cbd5e1', textAlign: 'center'}}>2 MB sin utilizar</div>
    </div>

    Esta es una comparación ilustrativa: en un sistema real, el tamaño mínimo de asignación, la alineación y las restricciones del administrador de memoria pueden impedir asignar exactamente la cantidad deseada.

  </TabItem>
  <TabItem value="reducir-externa" label="Reducir la externa">

    **Compactación de memoria**

    Cuando el sistema utiliza asignación contigua y puede reubicar procesos, la **compactación** permite mover las regiones ocupadas para reunir varios espacios libres separados en un único bloque de mayor tamaño.

    Imagina que existen tres espacios libres de 20 MB, 40 MB y 50 MB, separados por regiones ocupadas. Si el sistema puede mover esas regiones sin afectar la ejecución de los procesos, puede reunir los 110 MB en un solo bloque libre.

    <div style={{maxWidth: 360, margin: '16px auto', border: '1px solid #cbd5e1', borderRadius: 10, overflow: 'hidden'}}>
      <div style={{background: '#D8F0E7', color: '#205C49', padding: 12, fontWeight: 600, textAlign: 'center'}}>Bloque libre reunido: 110 MB</div>
    </div>

    En ese escenario, un proceso que necesita 80 MB sí podría recibir un bloque contiguo de ese tamaño, si no existen otras restricciones.

    La compactación requiere trabajo adicional y no siempre puede realizarse. Otra alternativa es utilizar técnicas de administración que no requieran que todo el espacio asignado a un proceso sea físicamente contiguo, como la paginación.

  </TabItem>
</Tabs>

La compactación y la paginación no son lo mismo. La compactación reorganiza la ubicación física de las regiones ocupadas para reunir espacio libre. La paginación divide la memoria lógica de un proceso en páginas y la memoria física en marcos, lo que permite ubicar sus páginas en marcos no contiguos. Esto elimina la necesidad de encontrar un único bloque físico grande para todo el proceso, aunque puede existir desperdicio dentro del último marco de una página.

## Comprueba lo aprendido

Selecciona una respuesta para cada pregunta. Al terminar, pulsa **Comprobar respuestas** para revisar tu resultado.

<div className="quiz-memoria quiz-fragmentacion">

  <p><strong>1. Un proceso necesita 70 MB y recibe una partición fija de 100 MB. ¿Qué tipo de fragmentación aparece si los 30 MB restantes no pueden asignarse a otro proceso?</strong></p>

  <label><input type="radio" name="fragmentacion-pregunta1" value="a" /> Fragmentación externa.</label>

  <label><input type="radio" name="fragmentacion-pregunta1" value="b" /> Fragmentación interna.</label>

  <label><input type="radio" name="fragmentacion-pregunta1" value="c" /> Ninguna, porque toda la partición está asignada.</label>

  <p><strong>2. Hay bloques libres de 20 MB, 40 MB y 50 MB. Un proceso necesita una región contigua de 80 MB. ¿Por qué no puede ubicarse con la distribución actual?</strong></p>

  <label><input type="radio" name="fragmentacion-pregunta2" value="a" /> Porque la memoria libre total es inferior a 80 MB.</label>

  <label><input type="radio" name="fragmentacion-pregunta2" value="b" /> Porque la memoria libre solo puede utilizarse para el sistema operativo.</label>

  <label><input type="radio" name="fragmentacion-pregunta2" value="c" /> Porque ningún bloque individual tiene el tamaño suficiente, aunque en total hay 110 MB libres.</label>

  <p><strong>3. ¿Qué puede hacer la compactación en un sistema que permite reubicar procesos?</strong></p>

  <label><input type="radio" name="fragmentacion-pregunta3" value="a" /> Reunir espacios libres separados en un bloque mayor.</label>

  <label><input type="radio" name="fragmentacion-pregunta3" value="b" /> Aumentar automáticamente la capacidad física de la RAM.</label>

  <label><input type="radio" name="fragmentacion-pregunta3" value="c" /> Eliminar cualquier tipo de fragmentación en todos los sistemas.</label>

  <div style={{textAlign: 'center', marginTop: '24px'}}>
    <button
      type="button"
      className="button button--primary"
      onClick={() => {
        const root = document.querySelector('.quiz-fragmentacion');
        const correctas = ['b', 'c', 'a'];
        let puntuacion = 0;
        let completas = true;

        correctas.forEach((correcta, i) => {
          const seleccionada = root.querySelector(`input[name="fragmentacion-pregunta${i + 1}"]:checked`);

          if (!seleccionada) {
            completas = false;
          } else if (seleccionada.value === correcta) {
            puntuacion++;
          }
        });

        const resultado = root.querySelector('.resultado-fragmentacion');

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
        const root = document.querySelector('.quiz-fragmentacion');

        root.querySelectorAll('input[type="radio"]').forEach(input => {
          input.checked = false;
        });

        root.querySelector('.resultado-fragmentacion').textContent = '';
      }}
    >
      Reiniciar cuestionario
    </button>
  </div>

  <p className="resultado-fragmentacion resultado-quiz" aria-live="polite" style={{textAlign: 'center'}}></p>

</div>

## Idea clave

La **fragmentación interna** aparece cuando una parte del bloque asignado queda sin utilizar; la **fragmentación externa** aparece cuando el espacio libre se encuentra dividido en bloques separados. Para analizar estos problemas, no basta con sumar la memoria disponible: también hay que considerar el tamaño de cada bloque, el esquema de asignación y si el sistema puede reorganizar la memoria o utilizar técnicas como la paginación.