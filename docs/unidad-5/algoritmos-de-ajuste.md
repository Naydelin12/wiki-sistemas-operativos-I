---
sidebar_position: 4
title: Algoritmos de Ajuste
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Algoritmos de Ajuste

Los **algoritmos de ajuste** son métodos que utiliza el sistema operativo para seleccionar un bloque de memoria libre donde pueda ubicarse un proceso. Se emplean en la asignación de memoria con particiones variables y buscan aprovechar el espacio disponible.

Existen tres algoritmos principales: **First Fit, Best Fit y Worst Fit**. Aunque todos buscan un bloque que pueda alojar al proceso, cada uno utiliza un criterio diferente para seleccionarlo.

## Tres formas de seleccionar un bloque

<Tabs>
  <TabItem value="first" label="First Fit" default>

    <div style={{textAlign: 'center'}}>

      **Primer ajuste**

      <div style={{maxWidth: 420, margin: '16px auto', border: '2px solid #64748b', borderRadius: 12, overflow: 'hidden'}}>
        <div style={{background: '#DCE7F5', color: '#243D63', padding: 14, fontWeight: 600}}>
          Bloque 1: 100 KB
        </div>
        <div style={{background: '#D8F0E7', color: '#205C49', padding: 20, borderTop: '2px solid #64748b', fontWeight: 600}}>
          Bloque 2: 500 KB
          <div style={{fontSize: 13, fontWeight: 400, marginTop: 5}}>Primer bloque suficiente: seleccionado</div>
        </div>
        <div style={{background: '#F1F5F9', color: '#475569', padding: 14, borderTop: '2px solid #64748b'}}>
          Bloques siguientes: no es necesario revisarlos
        </div>
      </div>

    </div>

    **¿Cómo funciona?**

    Recorre los bloques libres desde el principio y selecciona el primero que tenga capacidad suficiente para el proceso. Al encontrarlo, detiene la búsqueda.

    **Ejemplo:** si un proceso necesita 212 KB, el bloque de 100 KB no es suficiente. Al encontrar el bloque de 500 KB, First Fit lo selecciona sin continuar con los siguientes bloques.

  </TabItem>
  <TabItem value="best" label="Best Fit">

    <div style={{textAlign: 'center'}}>

      **Mejor ajuste**

      <div style={{maxWidth: 420, margin: '16px auto', border: '2px solid #64748b', borderRadius: 12, overflow: 'hidden'}}>
        <div style={{background: '#F1F5F9', color: '#475569', padding: 14, fontWeight: 600}}>
          Bloque de 500 KB
        </div>
        <div style={{background: '#D8F0E7', color: '#205C49', padding: 20, borderTop: '2px solid #64748b', fontWeight: 600}}>
          Bloque de 300 KB
          <div style={{fontSize: 13, fontWeight: 400, marginTop: 5}}>El más pequeño que puede utilizarse</div>
        </div>
        <div style={{background: '#F1F5F9', color: '#475569', padding: 14, borderTop: '2px solid #64748b'}}>
          Bloque de 600 KB
        </div>
      </div>

    </div>

    **¿Cómo funciona?**

    Busca el bloque libre más pequeño que pueda contener al proceso. Para encontrarlo, normalmente debe comparar los bloques disponibles.

    **Ejemplo:** si el proceso necesita 212 KB y hay bloques de 300 KB, 500 KB y 600 KB, Best Fit selecciona el de 300 KB porque es el más pequeño que puede utilizar.

  </TabItem>
  <TabItem value="worst" label="Worst Fit">

    <div style={{textAlign: 'center'}}>

      **Peor ajuste**

      <div style={{maxWidth: 420, margin: '16px auto', border: '2px solid #64748b', borderRadius: 12, overflow: 'hidden'}}>
        <div style={{background: '#F1F5F9', color: '#475569', padding: 14, fontWeight: 600}}>
          Bloque de 300 KB
        </div>
        <div style={{background: '#F1F5F9', color: '#475569', padding: 14, borderTop: '2px solid #64748b'}}>
          Bloque de 500 KB
        </div>
        <div style={{background: '#DCE7F5', color: '#243D63', padding: 20, borderTop: '2px solid #64748b', fontWeight: 600}}>
          Bloque de 600 KB
          <div style={{fontSize: 13, fontWeight: 400, marginTop: 5}}>Bloque libre más grande: seleccionado</div>
        </div>
      </div>

    </div>

    **¿Cómo funciona?**

    Selecciona el bloque libre más grande que pueda alojar al proceso. La intención es que, después de asignar la memoria, permanezca un bloque relativamente grande disponible.

    **Ejemplo:** si el proceso necesita 212 KB y el bloque libre más grande es de 600 KB, Worst Fit selecciona ese bloque.

  </TabItem>
</Tabs>

## ¿En qué se diferencian?

| Característica | First Fit | Best Fit | Worst Fit |
|---|---|---|---|
| Criterio de selección | Primer bloque suficiente | Bloque suficiente más pequeño | Bloque libre más grande |
| Búsqueda | Se detiene al encontrar uno adecuado | Compara los bloques para encontrar el más pequeño que sirva | Compara los bloques para encontrar el más grande |
| Espacio sobrante en el ejemplo | 288 KB | 88 KB | 388 KB |
| Ventaja | Puede encontrar espacio rápidamente | Deja menos espacio sobrante en el bloque seleccionado | Deja un bloque restante grande |
| Desventaja | Puede dejar espacios pequeños difíciles de utilizar | Puede producir muchos espacios pequeños | Puede utilizar bloques grandes que se necesiten después |

## Ejemplo práctico

Supongamos que la memoria tiene cinco bloques libres: **100 KB, 500 KB, 200 KB, 300 KB y 600 KB**. Llega un proceso que necesita **212 KB**.

<Tabs>
  <TabItem value="ejemplo-first" label="First Fit" default>

    <div style={{padding: 16, borderRadius: 12, background: 'var(--ifm-color-emphasis-100)', textAlign: 'center'}}>

      **El proceso necesita 212 KB**

      <div style={{margin: '12px 0'}}>↓</div>

      El bloque de 100 KB no es suficiente.

      <div style={{margin: '12px 0'}}>↓</div>

      **Selecciona el bloque de 500 KB**

      <div style={{margin: '12px 0'}}>↓</div>

      500 KB − 212 KB = **288 KB libres**

      <div style={{maxWidth: 360, margin: '16px auto', display: 'flex', height: 40, borderRadius: 8, overflow: 'hidden'}}>
        <div style={{width: '42.4%', background: '#2878A8', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 12}}>212 KB</div>
        <div style={{width: '57.6%', background: '#DCE7F5', color: '#243D63', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 12}}>288 KB</div>
      </div>

    </div>

  </TabItem>
  <TabItem value="ejemplo-best" label="Best Fit">

    <div style={{padding: 16, borderRadius: 12, background: 'var(--ifm-color-emphasis-100)', textAlign: 'center'}}>

      **El proceso necesita 212 KB**

      <div style={{margin: '12px 0'}}>↓</div>

      Compara los bloques que tienen capacidad suficiente: 300 KB, 500 KB y 600 KB.

      <div style={{margin: '12px 0'}}>↓</div>

      **Selecciona el bloque de 300 KB**

      <div style={{margin: '12px 0'}}>↓</div>

      300 KB − 212 KB = **88 KB libres**

      <div style={{maxWidth: 360, margin: '16px auto', display: 'flex', height: 40, borderRadius: 8, overflow: 'hidden'}}>
        <div style={{width: '70.7%', background: '#3B806D', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 12}}>212 KB</div>
        <div style={{width: '29.3%', background: '#D8F0E7', color: '#205C49', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 12}}>88 KB</div>
      </div>

    </div>

  </TabItem>
  <TabItem value="ejemplo-worst" label="Worst Fit">

    <div style={{padding: 16, borderRadius: 12, background: 'var(--ifm-color-emphasis-100)', textAlign: 'center'}}>

      **El proceso necesita 212 KB**

      <div style={{margin: '12px 0'}}>↓</div>

      Busca el bloque libre más grande de la lista.

      <div style={{margin: '12px 0'}}>↓</div>

      **Selecciona el bloque de 600 KB**

      <div style={{margin: '12px 0'}}>↓</div>

      600 KB − 212 KB = **388 KB libres**

      <div style={{maxWidth: 360, margin: '16px auto', display: 'flex', height: 40, borderRadius: 8, overflow: 'hidden'}}>
        <div style={{width: '35.3%', background: '#647B91', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 12}}>212 KB</div>
        <div style={{width: '64.7%', background: '#DCE7F5', color: '#243D63', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 12}}>388 KB</div>
      </div>

    </div>

  </TabItem>
</Tabs>

La diferencia se observa en el espacio que queda después de cada asignación. First Fit elige el primer bloque suficiente, Best Fit elige el bloque suficiente más pequeño y Worst Fit elige el bloque más grande.

## Comprueba lo aprendido

Selecciona una respuesta para cada pregunta. Al terminar, pulsa **Comprobar respuestas** para revisar tu resultado.

<div className="quiz-memoria quiz-ajustes">

  <p><strong>1. ¿Qué algoritmo selecciona el primer bloque que encuentra con espacio suficiente?</strong></p>

  <label><input type="radio" name="ajustes-pregunta1" value="a" /> Best Fit.</label>

  <label><input type="radio" name="ajustes-pregunta1" value="b" /> First Fit.</label>

  <label><input type="radio" name="ajustes-pregunta1" value="c" /> Worst Fit.</label>

  <p><strong>2. Un proceso necesita 212 KB y existen bloques libres de 500 KB, 300 KB y 600 KB. ¿Cuál selecciona Best Fit?</strong></p>

  <label><input type="radio" name="ajustes-pregunta2" value="a" /> El bloque de 500 KB.</label>

  <label><input type="radio" name="ajustes-pregunta2" value="b" /> El bloque de 600 KB.</label>

  <label><input type="radio" name="ajustes-pregunta2" value="c" /> El bloque de 300 KB.</label>

  <p><strong>3. ¿Qué algoritmo selecciona el bloque libre más grande?</strong></p>

  <label><input type="radio" name="ajustes-pregunta3" value="a" /> First Fit.</label>

  <label><input type="radio" name="ajustes-pregunta3" value="b" /> Best Fit.</label>

  <label><input type="radio" name="ajustes-pregunta3" value="c" /> Worst Fit.</label>

  <div style={{textAlign: 'center', marginTop: '24px'}}>
    <button
      type="button"
      className="button button--primary"
      onClick={() => {
        const root = document.querySelector('.quiz-ajustes');
        const correctas = ['b', 'c', 'c'];
        let puntuacion = 0;
        let completas = true;

        correctas.forEach((correcta, i) => {
          const seleccionada = root.querySelector(`input[name="ajustes-pregunta${i + 1}"]:checked`);

          if (!seleccionada) {
            completas = false;
          } else if (seleccionada.value === correcta) {
            puntuacion++;
          }
        });

        const resultado = root.querySelector('.resultado-ajustes');

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
        const root = document.querySelector('.quiz-ajustes');

        root.querySelectorAll('input[type="radio"]').forEach(input => {
          input.checked = false;
        });

        root.querySelector('.resultado-ajustes').textContent = '';
      }}
    >
      Reiniciar cuestionario
    </button>
  </div>

  <p className="resultado-ajustes resultado-quiz" aria-live="polite" style={{textAlign: 'center'}}></p>

</div>

## Idea clave

Los algoritmos de ajuste se diferencian por la forma en que seleccionan un bloque de memoria libre: **First Fit busca el primero suficiente, Best Fit busca el más pequeño que sirva y Worst Fit elige el más grande**. La selección determina cuánto espacio queda libre en el bloque utilizado.