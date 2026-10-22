---
sidebar_position: 1
title: Definición y Casos de Interbloqueo
---

import SimuladorInterbloqueo from '@site/src/components/SimuladorInterbloqueo';


# Definición y Casos de Interbloqueo

## 1. Introducción

En los sistemas operativos modernos, varios procesos pueden ejecutarse de manera concurrente y compartir recursos como memoria, archivos, dispositivos de entrada y salida o bases de datos.

Para utilizar determinados recursos, los procesos deben solicitarlos al sistema operativo. Sin embargo, pueden presentarse situaciones en las que dos o más procesos quedan esperando recursos que están siendo utilizados por otros procesos.

Cuando esta espera se convierte en un bloqueo permanente, se produce un problema conocido como **interbloqueo o deadlock**.

Los interbloqueos representan uno de los principales desafíos de la administración de procesos y recursos, ya que pueden impedir que determinadas tareas continúen ejecutándose.

---

## 2. ¿Qué es un interbloqueo?

Un **interbloqueo (deadlock)** es una situación en la que un conjunto de procesos queda bloqueado porque cada proceso espera un recurso o evento que depende de otro proceso del mismo conjunto.

Como consecuencia, ninguno puede continuar su ejecución.

### Características principales

- Participan dos o más procesos o hilos.
- Existen recursos compartidos.
- Los procesos mantienen recursos mientras esperan otros.
- Se produce una dependencia circular.
- Los procesos involucrados no pueden avanzar sin una intervención externa o un cambio en las condiciones del sistema.

### Ejemplo sencillo

Imaginemos dos procesos:

- **Proceso P1:** tiene asignado el recurso R1 y necesita R2.
- **Proceso P2:** tiene asignado el recurso R2 y necesita R1.

P1 no puede continuar porque R2 está ocupado por P2.

P2 tampoco puede continuar porque R1 está ocupado por P1.

Como ninguno libera el recurso que posee, ambos permanecen bloqueados.

---

## 3. ¿Cómo se produce un interbloqueo?

Un interbloqueo puede producirse cuando los procesos solicitan recursos en un orden que genera dependencias circulares.

Consideremos dos procesos y dos recursos exclusivos.

| Proceso | Recurso asignado | Recurso solicitado | Estado |
|---|---|---|---|
| P1 | R1 | R2 | Bloqueado |
| P2 | R2 | R1 | Bloqueado |

### Secuencia del interbloqueo

1. P1 solicita R1 y obtiene acceso.
2. P2 solicita R2 y obtiene acceso.
3. P1 solicita R2, pero debe esperar porque pertenece a P2.
4. P2 solicita R1, pero debe esperar porque pertenece a P1.
5. Ambos procesos permanecen bloqueados.

Esta situación genera una **espera circular**, en la que cada proceso depende de otro para continuar.

### Representación de las dependencias

```text
P1 ── solicita ──> R2
                  │
               asignado
                  │
                  ▼
                  P2
                  │
               solicita
                  ▼
                  R1
                  │
               asignado
                  │
                  ▼
                  P1
```

En este ejemplo, R1 y R2 tienen una sola instancia y no pueden retirarse por la fuerza a sus propietarios.

Por eso, el ciclo representa un interbloqueo.

---

## 4. Casos prácticos de interbloqueo

Los interbloqueos pueden aparecer en diferentes entornos informáticos.

### Caso 1. Procesos que utilizan impresoras

Supongamos que existen dos procesos que necesitan utilizar una impresora y un dispositivo de almacenamiento exclusivo.

- P1 tiene reservado el dispositivo de almacenamiento y solicita la impresora.
- P2 tiene reservada la impresora y solicita el dispositivo de almacenamiento.

Ambos quedan esperando que el otro libere el recurso.

**Resultado:** ninguno puede completar su operación.

### Caso 2. Transacciones en bases de datos

Dos transacciones necesitan modificar registros de una base de datos.

- La transacción T1 bloquea el registro A.
- La transacción T2 bloquea el registro B.
- T1 intenta modificar B.
- T2 intenta modificar A.

Si ambas mantienen sus bloqueos mientras esperan, se produce un interbloqueo.

Los sistemas gestores de bases de datos pueden detectar esta situación y cancelar una de las transacciones para permitir que la otra continúe.

### Caso 3. Hilos concurrentes

Dos hilos utilizan dos mecanismos de exclusión mutua.

- Hilo H1 adquiere el mutex A.
- Hilo H2 adquiere el mutex B.
- H1 intenta adquirir B.
- H2 intenta adquirir A.

Si ninguno libera su mutex, ambos quedan bloqueados.

Este ejemplo demuestra por qué es importante establecer un orden consistente al adquirir múltiples recursos.

---

## 5. Diferencia entre interbloqueo e inanición

Aunque ambos problemas pueden impedir el avance de los procesos, tienen causas diferentes.

| Característica | Interbloqueo (Deadlock) | Inanición (Starvation) |
|---|---|---|
| Definición | Procesos bloqueados por dependencias mutuas | Proceso que espera indefinidamente por falta de asignación de recursos |
| Causa principal | Dependencias circulares entre procesos | Asignación injusta o prioridades desfavorables |
| Otros procesos pueden avanzar | Sí, los que no están involucrados | Sí |
| Solución habitual | Prevención, evitación, detección y recuperación | Planificación justa y envejecimiento de prioridades |

### Ejemplo de inanición

Un proceso de baja prioridad necesita utilizar la CPU, pero constantemente llegan procesos de mayor prioridad.

El proceso de baja prioridad puede permanecer esperando durante mucho tiempo sin recibir tiempo de ejecución.

A diferencia del interbloqueo, no necesariamente existe una dependencia circular.

---

## 6. Consecuencias de un interbloqueo

Los interbloqueos pueden provocar diferentes problemas en un sistema informático.

### 6.1 Procesos detenidos

Los procesos involucrados dejan de avanzar y no pueden completar sus operaciones.

### 6.2 Recursos retenidos

Los recursos asignados permanecen ocupados, impidiendo que otros procesos los utilicen.

### 6.3 Disminución del rendimiento

El sistema puede desperdiciar recursos y reducir su capacidad para atender nuevas solicitudes.

### 6.4 Retrasos en las operaciones

Las aplicaciones pueden experimentar tiempos de espera prolongados o dejar de responder.

### 6.5 Necesidad de recuperación

El sistema puede necesitar cancelar procesos, revertir operaciones o liberar recursos mediante mecanismos de recuperación.

---

## 7. Importancia de gestionar los interbloqueos

La administración adecuada de los interbloqueos permite mejorar la confiabilidad y disponibilidad de los sistemas operativos.

Entre sus principales beneficios se encuentran:

- Evitar bloqueos permanentes entre procesos.
- Mejorar la utilización de los recursos.
- Reducir interrupciones en la ejecución de aplicaciones.
- Mantener la estabilidad del sistema.
- Garantizar una administración más eficiente de procesos concurrentes.

Los sistemas operativos pueden aplicar diferentes estrategias para tratar este problema, como la **prevención, evitación, detección y recuperación**.

Estas estrategias se estudiarán en los siguientes temas de la unidad.

---

## 8. Simulador Interactivo de Interbloqueo

En esta sección se incorporará un simulador que permitirá observar cómo dos procesos adquieren recursos y generan una espera circular.

El simulador mostrará:

- Dos procesos: P1 y P2.
- Dos recursos exclusivos: R1 y R2.
- El estado de cada proceso.
- La asignación y solicitud de recursos.
- La detección de una situación de interbloqueo.
- Un registro de los eventos realizados.

El objetivo será comprender visualmente por qué los procesos quedan bloqueados y cómo se produce una dependencia circular.

<SimuladorInterbloqueo />

---

## 9. Conclusión

Los interbloqueos son situaciones que pueden aparecer cuando varios procesos compiten por recursos compartidos y establecen dependencias que impiden su ejecución.

Comprender cómo se producen permite identificar los riesgos asociados con la concurrencia y aplicar estrategias para administrar los recursos de manera segura.

El estudio de los interbloqueos constituye una parte fundamental de la gestión de procesos en los sistemas operativos.

---