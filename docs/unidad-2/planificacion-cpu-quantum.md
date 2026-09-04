---
sidebar_position: 7
title: Planificación de CPU y Quantum de Tiempo
---

# Planificación de CPU y Quantum de Tiempo




En un sistema operativo pueden existir varios procesos que necesitan utilizar el procesador al mismo tiempo. Sin embargo, cuando varios procesos están esperando utilizar una misma CPU, el sistema operativo debe decidir **cuál se ejecutará, durante cuánto tiempo y cuál será el siguiente en recibir el procesador**.

Esta tarea se conoce como **planificación de CPU (CPU Scheduling)**.

La planificación busca aprovechar de manera eficiente el procesador y, al mismo tiempo, proporcionar un buen tiempo de respuesta a los procesos.

---

# ¿Qué es la planificación de CPU?

La **planificación de CPU** es el mecanismo mediante el cual el sistema operativo selecciona uno de los procesos que están en estado **Listo** para asignarle el procesador.

Recordemos que los procesos pueden encontrarse esperando en la cola de listos:

```text id="2a7kqf"
          COLA DE PROCESOS LISTOS

       ┌─────────┐
       │ Proceso A│
       └────┬────┘
            ↓
       ┌─────────┐
       │ Proceso B│
       └────┬────┘
            ↓
       ┌─────────┐
       │ Proceso C│
       └────┬────┘
            ↓
          CPU
```

El **planificador (scheduler)** decide cuál de estos procesos recibirá la CPU.

La decisión depende del algoritmo de planificación utilizado.

---

# ¿Qué busca la planificación?

No existe un único objetivo para todos los sistemas. Generalmente, el planificador intenta conseguir un equilibrio entre diferentes aspectos del rendimiento.

Entre ellos se encuentran:

* Mantener la CPU ocupada.
* Reducir el tiempo que los procesos permanecen esperando.
* Mejorar el tiempo de respuesta.
* Permitir que los procesos tengan una oportunidad de ejecutarse.
* Evitar que un proceso permanezca esperando indefinidamente.

Por lo tanto, un buen algoritmo de planificación debe buscar un equilibrio entre **eficiencia y capacidad de respuesta**.

---

# ¿Qué es el quantum de tiempo?

En algunos algoritmos de planificación, especialmente en **Round Robin**, cada proceso recibe la CPU durante un período limitado llamado **quantum de tiempo** o **time slice**.

El quantum determina cuánto tiempo puede ejecutarse un proceso antes de que el sistema operativo pueda retirar temporalmente la CPU y darle la oportunidad a otro proceso.

Por ejemplo, si tenemos:

```text
Quantum = 3 segundos
```

el proceso puede utilizar la CPU durante un máximo de aproximadamente 3 segundos antes de que el planificador considere cambiar al siguiente proceso, si todavía necesita ejecutarse.

Podemos representarlo así:

```text id="q70yqm"
Proceso A
    │
    │ 3 segundos
    ▼
Cambio de contexto
    │
    ▼
Proceso B
```

El tamaño del quantum es importante porque afecta directamente la frecuencia con la que los procesos se turnan para utilizar la CPU.

---

# Round Robin

**Round Robin** es un algoritmo de planificación diseñado para repartir el tiempo de CPU entre los procesos de manera circular.

Los procesos listos se organizan en una cola y cada uno recibe la CPU durante un quantum determinado.

Si el proceso termina antes de que termine su quantum, abandona la cola.

Si todavía necesita ejecutarse cuando termina su quantum, el sistema operativo puede realizar un cambio de contexto y colocar el proceso nuevamente al final de la cola.

El funcionamiento básico puede representarse así:

```text id="i4plp6"
       ┌──────────────┐
       │ Cola de Listos│
       └──────┬───────┘
              ↓
          Proceso A
              ↓
          Quantum
              ↓
          Proceso B
              ↓
          Quantum
              ↓
          Proceso C
              ↓
          Quantum
              ↓
          Proceso A
              ↓
             ...
```

De esta manera, los procesos reciben turnos sucesivos para utilizar el procesador.

---

# Ejemplo de Round Robin

Supongamos que tenemos tres procesos:

| Proceso | Tiempo de ejecución requerido |
| ------- | ----------------------------: |
| A       |                           5 s |
| B       |                           4 s |
| C       |                           3 s |

Y establecemos:

```text
Quantum = 2 segundos
```

La ejecución podría distribuirse de esta manera:

```text id="s7s0or"
Tiempo →

0    2    4    6    8    10   11   12
|----|----|----|----|----|----|----|

A    B    C    A    B    C    A    B
```

Analicemos lo que ocurre:

### Turno 1

El proceso **A** recibe la CPU durante 2 segundos.

```text
A → 2 segundos
```

Como todavía necesita tiempo para terminar, vuelve a la cola.

### Turno 2

Ahora se ejecuta **B** durante 2 segundos.

```text
B → 2 segundos
```

También necesita continuar, por lo que vuelve a la cola.

### Turno 3

El proceso **C** recibe 2 segundos.

```text
C → 2 segundos
```

Todavía necesita 1 segundo, por lo que vuelve a la cola.

### Turnos siguientes

La CPU continúa repartiendo el tiempo entre los procesos restantes hasta que todos terminan.

Una representación más detallada sería:

```text id="e3cc4w"
Cola inicial:

A → B → C

A ejecuta 2 s:
B → C → A

B ejecuta 2 s:
C → A → B

C ejecuta 2 s:
A → B → C

A ejecuta 2 s:
B → C → A

B ejecuta 2 s:
C → A

C ejecuta 1 s:
A

A ejecuta 1 s:
FIN
```

Este ejemplo muestra cómo Round Robin reparte la CPU entre los procesos.

---

# Quantum pequeño vs. quantum grande

El tamaño del quantum tiene un efecto importante en el comportamiento de Round Robin.

## Quantum pequeño

Supongamos:

```text
Quantum = 1 segundo
```

Los procesos cambian de turno con mucha frecuencia:

```text
A → B → C → A → B → C → A → ...
```

### Ventaja

Los procesos tienen oportunidades frecuentes de utilizar la CPU.

Esto puede mejorar el **tiempo de respuesta**, especialmente en sistemas interactivos.

### Desventaja

Se producen más cambios de contexto.

```text
A
↓
Context Switch
↓
B
↓
Context Switch
↓
C
↓
Context Switch
↓
A
```

Cada cambio de contexto genera overhead.

---

# Quantum grande

Ahora supongamos:

```text
Quantum = 10 segundos
```

Los procesos permanecen más tiempo utilizando la CPU:

```text
A ──────────→ B ──────────→ C
```

### Ventaja

Puede reducirse la cantidad de cambios de contexto y, por lo tanto, el overhead asociado.

### Desventaja

Un proceso puede tener que esperar más tiempo antes de recibir nuevamente la CPU.

En un sistema interactivo, esto puede hacer que las aplicaciones respondan más lentamente.

---

# Comparación

| Característica               | Quantum pequeño                             | Quantum grande    |
| ---------------------------- | ------------------------------------------- | ----------------- |
| Cambio de contexto           | Más frecuente                               | Menos frecuente   |
| Overhead                     | Mayor                                       | Menor             |
| Tiempo de respuesta          | Generalmente mejor para tareas interactivas | Puede aumentar    |
| Uso de CPU para trabajo útil | Puede disminuir por el overhead             | Puede aumentar    |
| Sensación de reparto         | Turnos más frecuentes                       | Turnos más largos |

Por esta razón, el tamaño del quantum debe elegirse buscando un equilibrio.

---

# Ejemplo para entender el impacto

Imaginemos que tres estudiantes necesitan utilizar una computadora para realizar una tarea.

### Quantum pequeño

Cada estudiante utiliza la computadora durante un período corto:

```text
Ana → Luis → María → Ana → Luis → María
```

Todos reciben oportunidades rápidamente, pero la computadora necesita estar cambiando constantemente entre usuarios.

### Quantum grande

Cada estudiante utiliza la computadora durante un período más largo:

```text
Ana ─────→ Luis ─────→ María
```

La cantidad de cambios disminuye, pero Luis y María deben esperar más tiempo para recibir su turno.

La computadora representa la **CPU** y el tiempo asignado a cada estudiante representa el **quantum**.

---

# ¿Qué sucede cuando un proceso termina antes del quantum?

El quantum representa un límite de tiempo, no una obligación de utilizarlo completamente.

Por ejemplo:

```text
Quantum = 4 s
```

Si un proceso solamente necesita 2 segundos:

```text
Proceso A
├── 2 s de ejecución
└── Termina
```

No es necesario esperar los 4 segundos completos. El proceso termina y el sistema operativo puede seleccionar otro proceso.

Por eso, el comportamiento de Round Robin depende tanto del tamaño del quantum como del tiempo de ejecución de los procesos.

---

# Round Robin y cambio de contexto

Round Robin está directamente relacionado con el **cambio de contexto** que estudiamos anteriormente.

Cuando un proceso utiliza su quantum y todavía no termina:

```text
Proceso A
    │
    │ Quantum termina
    ▼
Guardar contexto
    │
    ▼
Proceso B
```

Más adelante, A puede regresar a la CPU:

```text
Proceso B
    │
    │ Quantum termina
    ▼
Proceso A
    │
    │ Restaurar contexto
    ▼
Continúa ejecución
```

El PCB permite almacenar la información necesaria para que el proceso pueda continuar correctamente.

Por lo tanto, podemos observar la relación:

```text id="u7i7d1"
Planificación
      │
      ▼
  Round Robin
      │
      ▼
   Quantum
      │
      ▼
Cambio de contexto
      │
      ▼
PCB
      │
      ▼
Continuar proceso
```

---

# Métricas para evaluar la planificación

Para comparar algoritmos de planificación pueden utilizarse diferentes medidas.

## Tiempo de espera

Es el tiempo que un proceso permanece esperando en la cola de procesos listos antes de recibir la CPU.

```text
Proceso
   │
   ▼
Espera ──────────────► CPU
```

Un algoritmo que mantiene demasiado tiempo a los procesos en espera puede ofrecer una experiencia poco eficiente.

## Tiempo de respuesta

Es el tiempo que transcurre desde que se solicita una tarea hasta que el sistema comienza a responder.

Este aspecto es especialmente importante en sistemas interactivos.

## Tiempo de retorno

Es el tiempo total que transcurre desde que un proceso es enviado para su ejecución hasta que termina.

Estas métricas permiten analizar el comportamiento de un algoritmo de planificación.

---

# Ventajas de Round Robin

Entre las principales ventajas de Round Robin se encuentran:

* Es sencillo de implementar.
* Reparte la CPU entre los procesos de manera organizada.
* Evita que un proceso monopolice la CPU durante demasiado tiempo.
* Puede proporcionar buenos tiempos de respuesta en sistemas interactivos.
* Cada proceso recibe oportunidades periódicas de ejecución.

# Desventajas de Round Robin

También presenta algunas desventajas:

* Un quantum demasiado pequeño puede producir demasiados cambios de contexto.
* Un quantum demasiado grande puede aumentar el tiempo de respuesta.
* Su rendimiento depende de la elección adecuada del quantum.
* No siempre es la mejor opción para todos los tipos de cargas de trabajo.

---

# Ejemplo práctico con Python

Podemos representar una versión sencilla de la idea de Round Robin utilizando una cola:

```python id="z9n3m8"
from collections import deque

procesos = deque([
    ["A", 5],
    ["B", 4],
    ["C", 3]
])

quantum = 2

while procesos:
    nombre, restante = procesos.popleft()

    tiempo = min(quantum, restante)

    print(f"Proceso {nombre}: ejecuta {tiempo} segundos")

    restante -= tiempo

    if restante > 0:
        procesos.append([nombre, restante])
    else:
        print(f"Proceso {nombre}: terminado")
```

En este ejemplo:

1. Los procesos se almacenan en una cola.
2. Se toma el primer proceso.
3. Se le asigna el quantum.
4. Si no termina, vuelve al final de la cola.
5. Si termina, se elimina de la cola.
6. El proceso continúa hasta que todos hayan terminado.

Este ejemplo es una representación simplificada y educativa del funcionamiento de Round Robin. Un planificador real de un sistema operativo maneja muchos más aspectos.

---

# ¿Por qué importa elegir correctamente el quantum?

No existe un valor universal de quantum que sea perfecto para todos los sistemas.

Si el quantum es demasiado pequeño:

```text
Quantum pequeño
      ↓
Más cambios de contexto
      ↓
Más overhead
```

Si el quantum es demasiado grande:

```text
Quantum grande
      ↓
Menos cambios de contexto
      ↓
Mayor tiempo de espera para algunos procesos
```

Por lo tanto:

```text
              QUANTUM
                 │
       ┌─────────┴─────────┐
       ▼                   ▼
Quantum pequeño       Quantum grande
       │                   │
       ▼                   ▼
Más cambios          Menos cambios
de contexto          de contexto
       │                   │
       ▼                   ▼
Más overhead         Menor overhead
       │                   │
       └─────────┬─────────┘
                 ▼
            Equilibrio
```

El objetivo es encontrar un equilibrio que permita aprovechar la CPU sin perjudicar demasiado el tiempo de respuesta.

---

# En resumen

La **planificación de CPU** permite al sistema operativo decidir qué proceso debe utilizar el procesador.

Uno de los algoritmos más conocidos es **Round Robin**, que asigna a cada proceso un período limitado de ejecución llamado **quantum**.

El tamaño del quantum influye directamente en el comportamiento del sistema:

* Un **quantum pequeño** permite cambios frecuentes entre procesos, pero puede aumentar el overhead debido a los cambios de contexto.
* Un **quantum grande** reduce la frecuencia de cambios de contexto, pero puede aumentar el tiempo que algunos procesos deben esperar.

Por eso, el objetivo no es simplemente hacer el quantum lo más pequeño o lo más grande posible, sino encontrar un equilibrio adecuado para el tipo de sistema y carga de trabajo.

La relación principal puede resumirse así:

```text
PROCESOS LISTOS
       │
       ▼
PLANIFICADOR DE CPU
       │
       ▼
  ROUND ROBIN
       │
       ▼
    QUANTUM
       │
       ▼
EJECUCIÓN DEL PROCESO
       │
       ├── Termina ──────► FIN
       │
       └── No termina
               │
               ▼
       CAMBIO DE CONTEXTO
               │
               ▼
        Final de la cola
               │
               └──────► Próximo turno
```

Comprender la planificación de CPU y el quantum permite entender cómo el sistema operativo consigue repartir el procesador entre múltiples procesos y mantener un equilibrio entre **rendimiento, respuesta y overhead**.
