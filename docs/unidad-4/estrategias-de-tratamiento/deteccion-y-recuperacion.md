---
sidebar_position: 4
title: Detección y Recuperación de Interbloqueos
---

import SimuladorDeteccionRecuperacion from '@site/src/components/SimuladorDeteccionRecuperacion';

# Detección y Recuperación de Interbloqueos

## 1. Introducción

En un sistema operativo, varios procesos pueden competir por recursos compartidos, como archivos, dispositivos de entrada y salida, memoria o mecanismos de sincronización.

Cuando dos o más procesos quedan esperando recursos que están siendo utilizados por otros procesos, puede producirse un **interbloqueo (deadlock)**.

La detección y recuperación de interbloqueos es una estrategia que permite que estas situaciones ocurran, pero incorpora mecanismos para identificarlas y corregirlas.

A diferencia de la prevención y la evitación, esta estrategia no impone restricciones destinadas a impedir todos los interbloqueos antes de que aparezcan.

Su funcionamiento se divide en dos etapas principales:

1. **Detección:** identificar los procesos involucrados en un interbloqueo.
2. **Recuperación:** aplicar acciones para liberar recursos y permitir que el sistema continúe funcionando.

---

## 2. ¿Qué es la detección de interbloqueos?

La detección de interbloqueos consiste en analizar el estado de los procesos y los recursos para determinar si existe una situación en la que algunos procesos no pueden continuar porque esperan recursos retenidos por otros.

El sistema operativo puede realizar estas comprobaciones periódicamente o cuando se presentan determinadas condiciones, como un aumento de procesos bloqueados.

### Objetivos de la detección

- Identificar procesos que permanecen bloqueados.
- Determinar qué recursos están retenidos.
- Reconocer dependencias circulares entre procesos.
- Localizar los procesos involucrados en el interbloqueo.
- Proporcionar información para aplicar una estrategia de recuperación.

La detección no resuelve automáticamente el problema. Después de identificarlo, es necesario ejecutar un mecanismo de recuperación.

---

## 3. Grafo de Espera de Procesos

Una de las técnicas utilizadas para detectar interbloqueos es el **Grafo de Espera (Wait-For Graph)**.

Este grafo representa las dependencias entre procesos.

Cada nodo corresponde a un proceso y una flecha indica que un proceso está esperando un recurso que otro proceso mantiene asignado.

### Ejemplo

Supongamos que existen dos procesos:

- P1 posee el recurso R1 y necesita R2.
- P2 posee el recurso R2 y necesita R1.

La relación de espera es:

```text
P1 → P2
↑     ↓
└─────┘
```

Esto representa una espera circular:

```text
P1 → P2 → P1
```

P1 no puede continuar hasta que P2 libere R2.

P2 tampoco puede continuar hasta que P1 libere R1.

En un sistema donde cada tipo de recurso tiene una sola instancia, un ciclo en el grafo de espera indica la existencia de un interbloqueo.

### Importante

El grafo de espera es especialmente útil cuando cada tipo de recurso tiene una sola instancia.

Cuando existen varias instancias de un mismo tipo de recurso, se necesitan algoritmos de detección que consideren las cantidades disponibles, asignadas y solicitadas.

---

## 4. Algoritmo de Detección de Interbloqueos

Cuando el sistema administra recursos con múltiples instancias, puede utilizar un algoritmo basado en matrices y vectores.

### Estructuras utilizadas

**Available (Disponible)**

Indica la cantidad de recursos disponibles de cada tipo.

**Allocation (Asignación)**

Representa los recursos que cada proceso mantiene asignados.

**Request (Solicitud pendiente)**

Representa los recursos adicionales que cada proceso está esperando para continuar.

### Funcionamiento general

1. Se inicializa un vector de trabajo `Work` con los recursos disponibles.
2. Se identifican los procesos que no tienen recursos asignados.
3. Se busca un proceso cuya solicitud pendiente pueda satisfacerse con `Work`.
4. Se simula que ese proceso termina y libera sus recursos.
5. Se agregan los recursos liberados al vector `Work`.
6. Se repite el procedimiento mientras existan procesos que puedan avanzar.
7. Los procesos que no pueden marcarse como finalizados se consideran interbloqueados, bajo los supuestos del algoritmo.

### Diferencia con el Algoritmo del Banquero

El Algoritmo del Banquero comprueba si una asignación mantiene un **estado seguro**, utilizando las necesidades máximas declaradas.

En cambio, el algoritmo de detección analiza las **solicitudes pendientes actuales** para identificar interbloqueos existentes.

---

## 5. Ejemplo de Detección de un Interbloqueo

Consideremos dos procesos y dos recursos:

- P1
- P2
- R1
- R2

Cada recurso tiene una sola instancia.

### Estado inicial

| Proceso | Recurso asignado | Recurso solicitado |
|---|---|---|
| P1 | R1 | R2 |
| P2 | R2 | R1 |

Los recursos disponibles son:

```text
R1 = 0
R2 = 0
```

### Análisis

**Paso 1:** P1 solicita R2.

El recurso R2 está asignado a P2, por lo que P1 queda bloqueado.

**Paso 2:** P2 solicita R1.

El recurso R1 está asignado a P1, por lo que P2 también queda bloqueado.

**Paso 3:** El sistema analiza las dependencias.

```text
P1 espera a P2
P2 espera a P1
```

Se identifica una espera circular.

### Resultado

**INTERBLOQUEO DETECTADO**

Ninguno de los procesos puede continuar sin una intervención que rompa la dependencia circular.

---

## 6. ¿Qué es la recuperación de interbloqueos?

La recuperación consiste en aplicar medidas para eliminar un interbloqueo detectado y permitir que los procesos restantes continúen su ejecución.

Para conseguirlo, el sistema debe romper alguna de las dependencias que mantienen bloqueados a los procesos.

Existen diferentes estrategias de recuperación.

### 6.1 Terminación de procesos

Consiste en finalizar uno o varios procesos involucrados en el interbloqueo.

Puede realizarse de dos maneras:

**Terminación de todos los procesos involucrados**

Se finalizan todos los procesos interbloqueados.

Esta solución puede liberar rápidamente los recursos, pero ocasiona la pérdida del trabajo realizado por dichos procesos.

**Terminación selectiva**

Se finaliza un proceso a la vez hasta eliminar el interbloqueo.

Esta alternativa puede reducir la pérdida de trabajo, aunque requiere determinar qué proceso conviene finalizar.

### 6.2 Expropiación de recursos

La expropiación consiste en retirar un recurso asignado a un proceso para entregarlo a otro.

No todos los recursos pueden expropiarse de manera segura.

Por ejemplo, algunos estados de ejecución pueden necesitar guardarse antes de retirar el recurso.

Para aplicar esta estrategia es necesario considerar:

- Selección del proceso afectado.
- Posibilidad de retirar el recurso sin provocar inconsistencias.
- Conservación o restauración del estado del proceso.
- Prevención de situaciones de inanición.

### 6.3 Retroceso o rollback

El retroceso consiste en restaurar un proceso a un estado anterior que se haya guardado previamente.

Esto permite deshacer parte de su trabajo y liberar recursos para que otros procesos puedan continuar.

Para utilizar esta técnica se necesitan mecanismos de recuperación, como puntos de control o **checkpoints**.

El retroceso no siempre es posible, especialmente cuando el proceso ha realizado operaciones externas que no pueden deshacerse fácilmente.

---

## 7. Selección de un Proceso Víctima

Cuando se decide finalizar un proceso o retirarle recursos, el sistema debe seleccionar cuál será afectado.

Este proceso se conoce como **proceso víctima**.

### Criterios de selección

- Prioridad del proceso.
- Cantidad de recursos que utiliza.
- Tiempo de ejecución acumulado.
- Trabajo pendiente para finalizar.
- Cantidad de procesos afectados.
- Costo de reiniciar o recuperar el proceso.

### Ejemplo

Si P1 y P2 están interbloqueados y el sistema decide finalizar P2:

1. P2 termina.
2. Los recursos asignados a P2 se liberan.
3. P1 obtiene el recurso que estaba esperando.
4. P1 puede continuar su ejecución.

La selección debe considerar el costo de recuperación y el impacto sobre el sistema.

---

## 8. Ventajas y Desventajas

### Ventajas

- Permite utilizar los recursos sin imponer todas las restricciones de prevención.
- Puede ofrecer mayor flexibilidad en la asignación de recursos.
- Identifica los procesos involucrados en un interbloqueo.
- Permite aplicar mecanismos de recuperación según las necesidades del sistema.

### Desventajas

- El interbloqueo puede afectar temporalmente el funcionamiento del sistema.
- Los algoritmos de detección consumen recursos de procesamiento.
- La terminación de procesos puede ocasionar pérdida de trabajo.
- La recuperación puede ser compleja y costosa.
- La expropiación o el retroceso no siempre son posibles.

---

## 9. Aplicaciones Prácticas

Los mecanismos de detección y recuperación son importantes en entornos donde múltiples procesos o transacciones compiten por recursos.

Algunos ejemplos son:

**Sistemas de bases de datos**

Dos transacciones pueden mantener bloqueos sobre registros que la otra necesita.

El gestor de base de datos puede detectar la dependencia y cancelar una transacción para permitir que la otra continúe.

**Sistemas concurrentes**

Varios hilos pueden adquirir bloqueos en distinto orden y quedar esperando indefinidamente.

**Administración de recursos**

Los sistemas que administran múltiples recursos compartidos pueden utilizar algoritmos de detección para identificar procesos que no pueden avanzar.

---

## 10. Simulador Interactivo de Detección y Recuperación

En esta sección incorporaremos un simulador interactivo que permitirá observar cómo se produce un interbloqueo y cómo puede recuperarse el sistema.

El simulador incluirá:

- Dos procesos: P1 y P2.
- Dos recursos: R1 y R2.
- Visualización de recursos asignados.
- Estados de los procesos.
- Registro de eventos.
- Detección de espera circular.
- Recuperación mediante terminación selectiva.
- Recuperación mediante expropiación controlada.
- Botón para reiniciar la simulación.

### Escenarios que podremos observar

**Escenario 1: Detección**

P1 adquiere R1 y P2 adquiere R2.

Posteriormente, ambos solicitan el recurso que mantiene el otro proceso.

El sistema detecta el interbloqueo.

**Escenario 2: Terminación selectiva**

El sistema selecciona P2 como proceso víctima, lo finaliza y libera R2.

P1 obtiene R2 y puede continuar.

**Escenario 3: Expropiación controlada**

El sistema simula un recurso recuperable y un estado de proceso que puede restaurarse.

Retira temporalmente un recurso, rompe la espera circular y permite que los procesos continúen.

<SimuladorDeteccionRecuperacion />

---

## 11. Conclusión

La detección y recuperación de interbloqueos constituye una estrategia importante para administrar recursos compartidos en sistemas operativos.

A diferencia de la prevención y la evitación, permite que los interbloqueos ocurran y utiliza mecanismos para identificarlos y resolverlos.

La detección puede realizarse mediante grafos de espera o algoritmos basados en matrices, mientras que la recuperación puede incluir terminación de procesos, expropiación de recursos o retroceso.

Aunque estas técnicas pueden generar costos adicionales, permiten comprender cómo un sistema puede recuperar su funcionamiento después de una situación de bloqueo circular.

---