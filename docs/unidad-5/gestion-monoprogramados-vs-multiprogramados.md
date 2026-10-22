---
sidebar_position: 1
title: Gestión en Sistemas Monoprogramados vs. Multiprogramados
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Gestión en Sistemas Monoprogramados vs. Multiprogramados

La **gestión de memoria** es la función del sistema operativo que administra la memoria principal (RAM). Se encarga de controlar qué partes de la memoria utiliza cada proceso y de mantener organizada la información necesaria para ejecutar los programas.

La forma de administrar la memoria depende, entre otros factores, de si el sistema ejecuta un solo programa de usuario o permite mantener varios procesos disponibles para su ejecución.

## Dos formas de organizar la memoria

<Tabs>
  <TabItem value="mono" label="Monoprogramado" default>

    <div style={{textAlign: 'center'}}>

    **Un programa de usuario en memoria**

    <div style={{maxWidth: 420, margin: '16px auto', border: '2px solid #64748b', borderRadius: 12, overflow: 'hidden'}}>
      <div style={{background: '#DCE7F5', color: '#243D63', padding: 14, fontWeight: 600}}>
        Sistema operativo
      </div>
      <div style={{background: '#D8F0E7', color: '#205C49', padding: 25, borderTop: '2px solid #64748b', fontWeight: 600}}>
        Programa A
      </div>
      <div style={{background: '#F1F5F9', color: '#475569', padding: 12, borderTop: '2px solid #64748b'}}>
        Espacio restante, si existe
      </div>
    </div>

    </div>

    El sistema mantiene un programa de usuario en memoria para su ejecución, junto con el sistema operativo. Cuando ese programa espera una operación de entrada o salida, la CPU puede quedar sin otro trabajo de usuario que ejecutar.

  </TabItem>
  <TabItem value="multi" label="Multiprogramado">

    <div style={{textAlign: 'center'}}>

    **Varios procesos en memoria**

    <div style={{maxWidth: 420, margin: '16px auto', border: '2px solid #64748b', borderRadius: 12, overflow: 'hidden'}}>
      <div style={{background: '#DCE7F5', color: '#243D63', padding: 14, fontWeight: 600}}>
        Sistema operativo
      </div>
      <div style={{background: '#D8F0E7', color: '#205C49', padding: 17, borderTop: '2px solid #64748b', fontWeight: 600}}>
        Proceso A
      </div>
      <div style={{background: '#FCE7C7', color: '#7C4A12', padding: 17, borderTop: '2px solid #64748b', fontWeight: 600}}>
        Proceso B
      </div>
      <div style={{background: '#E9DFF7', color: '#593B83', padding: 17, borderTop: '2px solid #64748b', fontWeight: 600}}>
        Proceso C
      </div>
    </div>

    </div>

    El sistema mantiene varios procesos en memoria. Si uno queda esperando una operación de entrada o salida, el sistema operativo puede asignar la CPU a otro proceso que esté listo para ejecutarse.

  </TabItem>
</Tabs>

## ¿En qué se diferencian?

| Característica | Monoprogramado | Multiprogramado |
|---|---|---|
| Programas de usuario en memoria | Uno a la vez, en el modelo básico | Varios procesos |
| Uso de la RAM | Organización más sencilla | Requiere distribuir y controlar el espacio |
| Uso de la CPU | Puede quedar inactiva mientras el programa espera | Puede ejecutar otro proceso listo |
| Administración | Menos compleja | Requiere mayor coordinación y protección |
| Objetivo principal | Ejecutar un programa de usuario | Aprovechar mejor los recursos |

## Ejemplo práctico

Imagina que un programa necesita leer datos de un archivo.

<Tabs>
  <TabItem value="ejemplo-mono" label="Sistema monoprogramado" default>

    <div style={{padding: 16, borderRadius: 12, background: 'var(--ifm-color-emphasis-100)', textAlign: 'center'}}>

      <div style={{fontSize: 28}}>📄</div>

      **El programa solicita datos**

      <div style={{margin: '12px 0'}}>↓</div>

      **Espera la lectura del archivo**

      <div style={{margin: '12px 0'}}>↓</div>

      La CPU puede quedar sin trabajo de usuario durante la espera.

    </div>

  </TabItem>
  <TabItem value="ejemplo-multi" label="Sistema multiprogramado">

    <div style={{padding: 16, borderRadius: 12, background: 'var(--ifm-color-emphasis-100)', textAlign: 'center'}}>

      <div style={{fontSize: 28}}>📄</div>

      **El proceso A solicita datos**

      <div style={{margin: '12px 0'}}>↓</div>

      **El proceso A queda esperando**

      <div style={{margin: '12px 0'}}>↓</div>

      El sistema operativo puede ejecutar el proceso B, si está listo.

    </div>

  </TabItem>
</Tabs>

La multiprogramación no significa que un único núcleo ejecute varios procesos exactamente al mismo tiempo. En un sistema con un solo núcleo, la CPU alterna entre procesos; la concurrencia permite aprovechar los periodos de espera. En sistemas multinúcleo sí puede existir ejecución simultánea.


## Comprueba lo aprendido

Selecciona una respuesta para cada pregunta. Al terminar, pulsa **Comprobar respuestas** para revisar tu resultado.

<div className="quiz-memoria">

  <p><strong>1. ¿Qué ventaja ofrece la multiprogramación cuando un proceso espera una operación de entrada o salida?</strong></p>

  <label><input type="radio" name="pregunta1" value="a" /> Libera toda la memoria RAM automáticamente.</label>

  <label><input type="radio" name="pregunta1" value="b" /> Permite que la CPU ejecute otro proceso que esté listo.</label>

  <label><input type="radio" name="pregunta1" value="c" /> Elimina la necesidad del sistema operativo.</label>

  <p><strong>2. ¿Cuál es la función principal de la gestión de memoria?</strong></p>

  <label><input type="radio" name="pregunta2" value="a" /> Administrar y controlar el uso de la memoria principal.</label>

  <label><input type="radio" name="pregunta2" value="b" /> Aumentar físicamente la capacidad de la RAM.</label>

  <label><input type="radio" name="pregunta2" value="c" /> Evitar que los programas utilicen la CPU.</label>

  <p><strong>3. En un sistema monoprogramado básico, ¿qué puede suceder mientras el programa espera una operación de entrada o salida?</strong></p>

  <label><input type="radio" name="pregunta3" value="a" /> Otro programa siempre ocupa inmediatamente su lugar.</label>

  <label><input type="radio" name="pregunta3" value="b" /> La CPU puede quedarse sin trabajo de usuario que ejecutar.</label>

  <label><input type="radio" name="pregunta3" value="c" /> El sistema operativo deja de funcionar.</label>

  
  <div style={{ textAlign: 'center', marginTop: '24px' }}>
    <button
      className="button button--primary"
      onClick={() => {
        const root = document.querySelector('.quiz-memoria');
        const correctas = ['b', 'a', 'b'];
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
        } else {
          resultado.textContent = `Resultado: ${puntuacion} de 3 respuestas correctas.`;
        }
      }}
    >
      Comprobar respuestas
    </button>
  </div>

  <p className="resultado-quiz" aria-live="polite" style={{ textAlign: 'center' }}></p>


<button
  className="button button--secondary"
  style={{
    marginLeft: '12px',
    backgroundColor: '#3A9DAD',
    borderColor: '#3A9DAD',
    color: '#FFFFFF'
  }}
  onClick={() => {
    const root = document.querySelector('.quiz-memoria');

    root.querySelectorAll('input[type="radio"]').forEach(input => {
      input.checked = false;
    });

    root.querySelector('.resultado-quiz').textContent = '';
  }}
>
  Reiniciar cuestionario
</button>


</div>


## Idea clave

La diferencia esencial está en cómo se mantienen los programas en memoria y cómo se aprovecha la CPU. La multiprogramación permite alternar entre procesos y reducir los tiempos en que la CPU queda sin trabajo, aunque exige una administración de memoria más cuidadosa.