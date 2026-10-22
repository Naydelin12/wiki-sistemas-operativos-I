---
sidebar_position: 3
title: Particiones Fijas vs. Particiones Variables
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Particiones Fijas vs. Particiones Variables

La memoria principal puede organizarse en particiones para permitir que varios procesos ocupen diferentes regiones de la RAM. Existen dos métodos tradicionales para hacerlo: **particiones fijas** y **particiones variables**.

La diferencia principal está en cómo se crean los espacios de memoria y cómo se adaptan a las necesidades de cada proceso.

## 1. Particiones fijas

En este método, la memoria destinada a los procesos se divide en un número determinado de particiones antes de asignarles procesos. Estas particiones mantienen sus tamaños establecidos durante la operación del sistema.

Cada partición puede alojar un solo proceso a la vez, siempre que su tamaño sea suficiente para contenerlo.

### Características de las particiones fijas

- La cantidad y el tamaño de las particiones se establecen previamente.
- Cada partición admite un proceso a la vez.
- La administración de memoria es relativamente sencilla.
- Un proceso no puede ocupar una partición si necesita más memoria de la disponible en ella.
- Puede producir **fragmentación interna** cuando un proceso utiliza solo una parte de su partición.

## 2. Particiones variables

En este método, las particiones se crean según las necesidades de memoria de los procesos. Por ello, sus tamaños y ubicaciones pueden cambiar a medida que los procesos ingresan y salen de la memoria.

La idea es asignar a cada proceso un bloque que se ajuste mejor a la cantidad de memoria que necesita.

### Características de las particiones variables

- Los tamaños de los bloques se adaptan a los requisitos de los procesos.
- La memoria se asigna conforme se necesitan nuevos espacios.
- Puede aprovecharse mejor la memoria que con particiones fijas.
- Cuando los procesos terminan, dejan espacios libres de distintos tamaños.
- Puede producir **fragmentación externa** si los espacios libres quedan separados.

## 3. Un mismo ejemplo para comparar ambos métodos

Imaginemos que tenemos **300 MB de memoria disponible** y llegan dos procesos:

- **Proceso A:** necesita 70 MB.
- **Proceso B:** necesita 120 MB.

Veamos cómo se administra esa misma memoria con cada método.

<Tabs>
  <TabItem value="fijas" label="Particiones fijas">

    <div style={{ background: '#F8EBDD', border: '1px solid #E7C8AA', borderRadius: '14px', padding: '18px', margin: '14px 0' }}>
      <div style={{ color: '#995C31', fontWeight: 700, marginBottom: '6px' }}>Memoria disponible: 300 MB</div>
      <p style={{ marginTop: 0 }}>Antes de cargar los procesos, la memoria se divide en dos particiones: una de 100 MB y otra de 200 MB.</p>

      <div style={{ border: '1px solid #E7C8AA', borderRadius: '9px', padding: '10px', marginBottom: '12px', background: '#FFFFFF' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', marginBottom: '8px', color: '#995C31', fontWeight: 600, fontSize: '0.9rem' }}>
          <span>Partición 1</span>
          <span>100 MB</span>
        </div>
        <div style={{ display: 'flex', height: '42px', borderRadius: '6px', overflow: 'hidden' }}>
          <div style={{ width: '70%', background: '#D18A58', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 600, textAlign: 'center' }}>Proceso A · 70 MB</div>
          <div style={{ width: '30%', background: '#F8EBDD', color: '#995C31', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', textAlign: 'center' }}>30 MB</div>
        </div>
        <p style={{ margin: '7px 0 0', color: '#995C31', fontSize: '0.85rem' }}>30 MB quedan sin utilizar dentro de la partición.</p>
      </div>

      <div style={{ border: '1px solid #E7C8AA', borderRadius: '9px', padding: '10px', background: '#FFFFFF' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', marginBottom: '8px', color: '#995C31', fontWeight: 600, fontSize: '0.9rem' }}>
          <span>Partición 2</span>
          <span>200 MB</span>
        </div>
        <div style={{ display: 'flex', height: '42px', borderRadius: '6px', overflow: 'hidden' }}>
          <div style={{ width: '60%', background: '#D18A58', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 600, textAlign: 'center' }}>Proceso B · 120 MB</div>
          <div style={{ width: '40%', background: '#F8EBDD', color: '#995C31', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', textAlign: 'center' }}>80 MB</div>
        </div>
        <p style={{ margin: '7px 0 0', color: '#995C31', fontSize: '0.85rem' }}>80 MB quedan sin utilizar dentro de la partición.</p>
      </div>

      <div style={{ marginTop: '14px', background: '#F0D8C4', color: '#784522', borderRadius: '9px', padding: '12px' }}>
        <strong>Resultado</strong>
        <p style={{ margin: '6px 0 0' }}>Los procesos utilizan 190 MB, pero las particiones asignadas ocupan 300 MB. Quedan 110 MB sin utilizar dentro de ellas: <strong>fragmentación interna</strong>.</p>
      </div>
    </div>

  </TabItem>
  <TabItem value="variables" label="Particiones variables">

    <div style={{ background: '#E2EFEA', border: '1px solid #B8D6CC', borderRadius: '14px', padding: '18px', margin: '14px 0' }}>
      <div style={{ color: '#226B62', fontWeight: 700, marginBottom: '6px' }}>Memoria disponible: 300 MB</div>
      <p style={{ marginTop: 0 }}>Los bloques se crean según lo que necesita cada proceso. En este ejemplo, se asignan 70 MB al proceso A y 120 MB al proceso B.</p>

      <div style={{ border: '1px solid #B8D6CC', borderRadius: '9px', padding: '10px', background: '#FFFFFF', marginBottom: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', marginBottom: '8px', color: '#226B62', fontWeight: 600, fontSize: '0.9rem' }}>
          <span>Bloque asignado</span>
          <span>70 MB</span>
        </div>
        <div style={{ height: '42px', borderRadius: '6px', overflow: 'hidden', background: '#287F78', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 600 }}>Proceso A · 70 MB</div>
      </div>

      <div style={{ border: '1px solid #B8D6CC', borderRadius: '9px', padding: '10px', background: '#FFFFFF', marginBottom: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', marginBottom: '8px', color: '#226B62', fontWeight: 600, fontSize: '0.9rem' }}>
          <span>Bloque asignado</span>
          <span>120 MB</span>
        </div>
        <div style={{ height: '42px', borderRadius: '6px', overflow: 'hidden', background: '#287F78', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 600 }}>Proceso B · 120 MB</div>
      </div>

      <div style={{ border: '1px solid #E7C8AA', borderRadius: '9px', padding: '10px', background: '#FFFCF7' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', marginBottom: '8px', color: '#995C31', fontWeight: 600, fontSize: '0.9rem' }}>
          <span>Espacio libre</span>
          <span>110 MB</span>
        </div>
        <div style={{ height: '42px', borderRadius: '6px', overflow: 'hidden', background: '#E8BD83', color: '#65421D', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 600 }}>110 MB disponibles</div>
      </div>

      <div style={{ marginTop: '14px', background: '#CDE6DC', color: '#20574E', borderRadius: '9px', padding: '12px' }}>
        <strong>Resultado</strong>
        <p style={{ margin: '6px 0 0' }}>Los procesos utilizan 190 MB y los 110 MB restantes quedan libres para futuras asignaciones. En este ejemplo no hay desperdicio dentro de los bloques asignados.</p>
      </div>
    </div>

  </TabItem>
</Tabs>

### ¿Qué demuestra el ejemplo?

| Característica | Particiones fijas | Particiones variables |
|---|---|---|
| Memoria disponible | 300 MB | 300 MB |
| Memoria utilizada por los procesos | 190 MB | 190 MB |
| Espacio sin utilizar dentro de los bloques asignados | 110 MB | 0 MB |
| Memoria libre para futuras asignaciones | 0 MB | 110 MB |
| Problema ilustrado | Fragmentación interna | No hay fragmentación en este ejemplo |

En las particiones fijas, cada proceso ocupa una partición cuyo tamaño ya estaba establecido, por lo que puede quedar espacio desperdiciado dentro de ella. En las variables, cada bloque se adapta a las necesidades del proceso y la memoria restante queda disponible.

**Importante:** este ejemplo representa una situación simplificada. Las particiones variables también pueden producir fragmentación externa cuando, después de varias asignaciones y liberaciones, quedan huecos libres separados.

## 4. Ventajas y limitaciones

<Tabs>
  <TabItem value="ventajas-fijas" label="Particiones fijas">

    <div style={{ background: '#F8EBDD', borderRadius: '12px', padding: '18px', margin: '12px 0', border: '1px solid #E7C8AA' }}>
      <h3 style={{ marginTop: 0, color: '#995C31' }}>Memoria dividida previamente</h3>
      <p><strong>Ventajas</strong></p>
      <ul>
        <li>La organización es relativamente sencilla.</li>
        <li>Los límites de las particiones están definidos.</li>
        <li>El control de las asignaciones es más simple.</li>
      </ul>
      <p><strong>Limitaciones</strong></p>
      <ul>
        <li>Un proceso debe caber en una partición disponible.</li>
        <li>Puede desperdiciarse espacio dentro de las particiones.</li>
        <li>La cantidad de particiones limita cuántos procesos pueden estar alojados simultáneamente.</li>
      </ul>
      <p style={{ marginBottom: 0 }}><strong>Problema característico:</strong> fragmentación interna.</p>
    </div>

  </TabItem>
  <TabItem value="ventajas-variables" label="Particiones variables">

    <div style={{ background: '#E2EFEA', borderRadius: '12px', padding: '18px', margin: '12px 0', border: '1px solid #B8D6CC' }}>
      <h3 style={{ marginTop: 0, color: '#226B62' }}>Memoria dividida según la necesidad</h3>
      <p><strong>Ventajas</strong></p>
      <ul>
        <li>Los bloques se adaptan al tamaño de los procesos.</li>
        <li>Puede aprovecharse mejor la memoria asignada.</li>
        <li>La cantidad y el tamaño de los bloques pueden variar con las asignaciones.</li>
      </ul>
      <p><strong>Limitaciones</strong></p>
      <ul>
        <li>Se requiere controlar los espacios libres de diferentes tamaños.</li>
        <li>Pueden quedar huecos entre las regiones ocupadas.</li>
        <li>Puede ser necesario reorganizar la memoria para reunir espacios libres.</li>
      </ul>
      <p style={{ marginBottom: 0 }}><strong>Problema característico:</strong> fragmentación externa.</p>
    </div>

  </TabItem>
</Tabs>

| Característica | Particiones fijas | Particiones variables |
|---|---|---|
| Tamaño de los bloques | Establecido previamente | Adaptado a cada proceso |
| Número de particiones | Determinado previamente | Depende de las asignaciones |
| Administración | Más sencilla | Requiere mayor control |
| Fragmentación asociada | Interna | Externa |
| Aprovechamiento de memoria | Puede desperdiciar espacio dentro de los bloques | Puede dejar espacios libres separados |

## 5. Comprende los tipos de fragmentación

La fragmentación representa un problema de aprovechamiento de la memoria. En estos métodos, puede aparecer de dos maneras diferentes.

<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', margin: '20px 0' }}>
  <div style={{ border: '1px solid #E7C8AA', borderRadius: '12px', padding: '16px', background: 'var(--ifm-background-surface-color)' }}>
    <div style={{ color: '#995C31', fontWeight: 700, fontSize: '1.05rem' }}>Fragmentación interna</div>
    <p>Se produce cuando un proceso recibe un bloque más grande de lo que necesita y queda espacio sin utilizar dentro de esa misma partición.</p>
    <div style={{ display: 'flex', height: '48px', borderRadius: '7px', overflow: 'hidden', marginTop: '12px' }}>
      <div style={{ width: '70%', background: '#287F78', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontSize: '0.8rem', padding: '3px' }}>Proceso · 70 MB</div>
      <div style={{ width: '30%', background: '#F0D8C4', color: '#784522', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontSize: '0.75rem', padding: '3px' }}>30 MB</div>
    </div>
    <p style={{ marginTop: '10px', marginBottom: 0, fontSize: '0.9rem' }}>Ejemplo: partición de 100 MB y proceso de 70 MB. Quedan 30 MB sin utilizar dentro del bloque asignado.</p>
  </div>
  <div style={{ border: '1px solid #E7C8AA', borderRadius: '12px', padding: '16px', background: 'var(--ifm-background-surface-color)' }}>
    <div style={{ color: '#995C31', fontWeight: 700, fontSize: '1.05rem' }}>Fragmentación externa</div>
    <p>Se produce cuando la memoria libre queda repartida en varios huecos separados entre regiones ocupadas.</p>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 0.7fr 1.2fr 0.7fr 1.4fr', gap: '3px', marginTop: '12px' }}>
      <div style={{ minHeight: '48px', background: '#E8BD83', color: '#65421D', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontSize: '0.7rem', borderRadius: '4px', padding: '2px' }}>Libre</div>
      <div style={{ minHeight: '48px', background: '#287F78', borderRadius: '4px' }}></div>
      <div style={{ minHeight: '48px', background: '#E8BD83', color: '#65421D', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontSize: '0.7rem', borderRadius: '4px', padding: '2px' }}>Libre</div>
      <div style={{ minHeight: '48px', background: '#287F78', borderRadius: '4px' }}></div>
      <div style={{ minHeight: '48px', background: '#E8BD83', color: '#65421D', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontSize: '0.7rem', borderRadius: '4px', padding: '2px' }}>Libre</div>
    </div>
    <p style={{ marginTop: '10px', marginBottom: 0, fontSize: '0.9rem' }}>El espacio libre total puede ser suficiente, pero quizá ningún hueco individual permita alojar un proceso.</p>
  </div>
</div>

## 6. Ejemplo de fragmentación externa

Imagina que, después de varias asignaciones y liberaciones en un sistema con particiones variables, quedan tres huecos libres de 20 MB, 40 MB y 50 MB.

La memoria libre suma 110 MB. Sin embargo, un proceso que necesita un bloque continuo de 80 MB no puede cargarse en ninguno de esos huecos, porque el mayor solo tiene 50 MB.

Este es un caso de **fragmentación externa**: existe suficiente memoria libre en total, pero no está reunida en un único bloque continuo.

## Comprueba lo aprendido

Selecciona una respuesta en cada pregunta y pulsa **Comprobar respuestas** para conocer tu resultado.

<div className="quiz-memoria quiz-particiones">

  <p><strong>1. ¿Cómo se definen las particiones fijas?</strong></p>

  <label><input type="radio" name="particion1" value="a" /> Se crean con tamaños establecidos previamente.</label>

  <label><input type="radio" name="particion1" value="b" /> Se crean siempre con el tamaño exacto de cada proceso.</label>

  <label><input type="radio" name="particion1" value="c" /> Se dividen automáticamente en páginas.</label>

  <p><strong>2. ¿Qué tipo de fragmentación se asocia principalmente con las particiones fijas?</strong></p>

  <label><input type="radio" name="particion2" value="a" /> Fragmentación externa.</label>

  <label><input type="radio" name="particion2" value="b" /> Fragmentación interna.</label>

  <label><input type="radio" name="particion2" value="c" /> Ningún tipo de fragmentación.</label>

  <p><strong>3. ¿Qué caracteriza a las particiones variables?</strong></p>

  <label><input type="radio" name="particion3" value="a" /> Todos los procesos deben ocupar bloques idénticos.</label>

  <label><input type="radio" name="particion3" value="b" /> La memoria nunca queda dividida en espacios libres.</label>

  <label><input type="radio" name="particion3" value="c" /> Los bloques se crean según las necesidades de los procesos.</label>

  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px', marginTop: '24px' }}>
    <button
      className="button button--primary"
      onClick={() => {
        const root = document.querySelector('.quiz-particiones');
        const correctas = ['a', 'b', 'c'];
        let puntuacion = 0;
        let completas = true;

        correctas.forEach((correcta, i) => {
          const seleccionada = root.querySelector(`input[name="particion${i + 1}"]:checked`);
          if (!seleccionada) {
            completas = false;
          } else if (seleccionada.value === correcta) {
            puntuacion++;
          }
        });

        const resultado = root.querySelector('.resultado-particiones');

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
      style={{ backgroundColor: '#287F78', borderColor: '#287F78', color: '#FFFFFF' }}
      onClick={() => {
        const root = document.querySelector('.quiz-particiones');
        root.querySelectorAll('input[type="radio"]').forEach(input => {
          input.checked = false;
        });
        const resultado = root.querySelector('.resultado-particiones');
        resultado.textContent = '';
        resultado.style.backgroundColor = '';
        resultado.style.color = '';
      }}
    >
      Reiniciar cuestionario
    </button>
  </div>

  <p className="resultado-particiones resultado-quiz" aria-live="polite" style={{ textAlign: 'center', padding: '12px', borderRadius: '8px', fontWeight: 700 }}></p>

</div>

## Idea clave

Las **particiones fijas** se establecen antes de asignar los procesos y pueden desperdiciar memoria dentro de cada bloque. Las **particiones variables** se adaptan a las necesidades de los procesos, pero pueden dejar huecos libres separados.

La diferencia fundamental es dónde queda la memoria sin utilizar: dentro de las particiones asignadas en el caso de la fragmentación interna, o en espacios libres separados en el caso de la fragmentación externa.
