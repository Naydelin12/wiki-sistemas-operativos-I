---
sidebar_position: 6
title: Procesos y Threads (Hilos)
---

# Procesos y Threads (Hilos)



Un sistema operativo puede ejecutar varias tareas al mismo tiempo. Para organizar estas tareas utiliza **procesos** y dentro de ellos puede utilizar **threads o hilos**.

Aunque ambos conceptos están relacionados con la ejecución de instrucciones, no son exactamente lo mismo. La principal diferencia es que un proceso representa una instancia de un programa con sus propios recursos y espacio de memoria, mientras que los hilos representan unidades de ejecución que pueden existir dentro de un mismo proceso.

Comprender esta diferencia es importante para entender cómo los sistemas operativos pueden realizar varias tareas de manera eficiente.

---

# ¿Qué es un proceso?

Como vimos anteriormente, un **proceso** es una instancia de un programa que está siendo administrada por el sistema operativo.

Cada proceso tiene información propia y recursos asociados, como:

* PID.
* Estado.
* Contador de programa.
* Registros.
* Espacio de direcciones.
* Archivos y otros recursos.

Podemos representarlo así:

```text id="k7x6pd"
             PROCESO
                │
       ┌────────┼────────┐
       ▼        ▼        ▼
      PCB    Memoria   Recursos
       │
       ├── PID
       ├── Estado
       ├── Registros
       └── Program Counter
```

Un proceso puede ejecutarse de manera independiente de otros procesos.

---

# ¿Qué es un thread o hilo?

Un **thread**, también llamado **hilo de ejecución**, es una unidad de ejecución que pertenece a un proceso.

Un proceso puede contener uno o varios hilos.

Por ejemplo:

```text id="g8sk2m"
              PROCESO
                 │
        ┌────────┼────────┐
        ▼        ▼        ▼
      Hilo 1   Hilo 2   Hilo 3
```

Los hilos de un mismo proceso pueden ejecutar diferentes partes de una aplicación de manera concurrente.

Por ejemplo, una aplicación podría utilizar:

```text id="w9r5hj"
Aplicación
   │
   ├── Hilo 1 → Interfaz gráfica
   ├── Hilo 2 → Procesamiento
   └── Hilo 3 → Comunicación
```

De esta manera, una sola aplicación puede dividir su trabajo en diferentes unidades de ejecución.

---

# Relación entre procesos y threads

Un proceso proporciona los recursos y el entorno en el que se ejecutan sus hilos.

Los hilos de un mismo proceso comparten determinados recursos, especialmente el espacio de memoria del proceso.

Podemos visualizarlo así:

```text id="u1e0lj"
                    PROCESO
        ┌──────────────────────────────┐
        │        Espacio de memoria    │
        │        compartido             │
        │                              │
        │   ┌────────┐ ┌────────┐      │
        │   │ Hilo 1 │ │ Hilo 2 │ ...  │
        │   └────────┘ └────────┘      │
        │                              │
        └──────────────────────────────┘
```

Cada hilo mantiene su propio contexto de ejecución, pero comparte recursos con los demás hilos pertenecientes al mismo proceso.

---

# Espacio de memoria

Una de las diferencias más importantes entre procesos e hilos está relacionada con la memoria.

## Procesos

Los procesos normalmente tienen **espacios de direcciones separados**.

Por ejemplo:

```text id="k4shh9"
Memoria

┌─────────────────────┐
│ Proceso A           │
│ Espacio de memoria  │
├─────────────────────┤
│ Proceso B           │
│ Espacio de memoria  │
├─────────────────────┤
│ Proceso C           │
│ Espacio de memoria  │
└─────────────────────┘
```

Esto proporciona aislamiento entre procesos.

Si un proceso necesita comunicarse con otro, normalmente debe utilizar mecanismos de comunicación entre procesos, conocidos como **IPC (Inter-Process Communication)**.

## Threads

Los hilos que pertenecen al mismo proceso comparten el espacio de memoria del proceso.

Por ejemplo:

```text id="w2u8s3"
Proceso A
┌───────────────────────────┐
│ Memoria compartida        │
│                           │
│ ┌───────┐  ┌───────┐      │
│ │Hilo 1 │  │Hilo 2 │      │
│ └───────┘  └───────┘      │
│                           │
└───────────────────────────┘
```

Esto permite que los hilos puedan comunicarse y compartir información de manera más sencilla.

Sin embargo, esta ventaja también introduce riesgos. Si varios hilos modifican los mismos datos al mismo tiempo, pueden producirse problemas de **concurrencia**, como condiciones de carrera.

Este concepto será especialmente importante en la **Unidad 3: Concurrencia y Sincronización**.

---

# ¿Qué comparte un thread?

Los hilos pertenecientes al mismo proceso suelen compartir:

* Código del proceso.
* Datos globales.
* Espacio de direcciones.
* Archivos abiertos.
* Otros recursos del proceso.

Pero cada hilo mantiene información propia para controlar su ejecución.

Por ejemplo:

```text id="grr2dg"
              PROCESO
                 │
      ┌──────────┼──────────┐
      │          │          │
      ▼          ▼          ▼
   Hilo 1     Hilo 2     Hilo 3
      │          │          │
      └──────────┼──────────┘
                 │
       Memoria y recursos
          compartidos
```

---

# ¿Qué mantiene cada thread por separado?

Aunque los hilos compartan muchos recursos, cada uno necesita información propia para poder ejecutarse.

Entre ella se encuentran:

* Contador de programa.
* Registros del procesador.
* Pila de ejecución (**stack**).
* Estado de ejecución.

La pila es especialmente importante porque cada hilo necesita mantener sus propias llamadas a funciones y variables locales.

Podemos imaginarlo así:

```text id="m5nykm"
                    PROCESO
        ┌──────────────────────────────┐
        │       Memoria compartida     │
        │                              │
        │   ┌────────┐ ┌────────┐     │
        │   │ Hilo 1 │ │ Hilo 2 │     │
        │   │ Stack  │ │ Stack  │     │
        │   │ Reg.   │ │ Reg.   │     │
        │   │ PC     │ │ PC     │     │
        │   └────────┘ └────────┘     │
        └──────────────────────────────┘
```

Por lo tanto, los hilos **comparten recursos del proceso, pero no comparten todo su contexto de ejecución**.

---

# Procesos vs. Threads

La siguiente tabla resume las principales diferencias:

| Característica          | Proceso                                | Thread / Hilo                                        |
| ----------------------- | -------------------------------------- | ---------------------------------------------------- |
| Unidad de ejecución     | Proceso completo                       | Unidad de ejecución dentro de un proceso             |
| Memoria                 | Tiene su propio espacio de direcciones | Comparte el espacio de memoria del proceso           |
| Aislamiento             | Mayor aislamiento entre procesos       | Menor aislamiento entre hilos del mismo proceso      |
| Recursos                | Posee recursos asociados al proceso    | Comparte muchos recursos con otros hilos del proceso |
| Comunicación            | Puede requerir mecanismos IPC          | Puede comunicarse mediante memoria compartida        |
| Creación                | Generalmente más costosa               | Generalmente más ligera                              |
| Cambio de contexto      | Puede requerir cambiar más información | Puede ser menos costoso dentro del mismo proceso     |
| Riesgo de interferencia | Menor entre procesos                   | Mayor si varios hilos acceden a los mismos datos     |

La diferencia principal puede resumirse de esta manera:

```text id="2a2bna"
PROCESO
└── Tiene su propio espacio de memoria
    y recursos asociados.

THREAD
└── Vive dentro de un proceso
    y comparte recursos con otros hilos.
```

---

# Costo de creación

Crear un proceso implica preparar una mayor cantidad de recursos y estructuras para que pueda ejecutarse de forma independiente.

Por esta razón, la creación de un proceso suele ser **más costosa** que la creación de un hilo dentro de un proceso existente.

De forma simplificada:

```text id="k0oypk"
Crear proceso
      │
      ├── Crear estructura de proceso
      ├── Preparar espacio de direcciones
      ├── Asignar recursos
      └── Inicializar información
             │
             ▼
        Mayor costo
```

En cambio, al crear un hilo, gran parte de los recursos ya pertenecen al proceso:

```text id="qg4dko"
Crear thread
      │
      ├── Crear contexto del hilo
      ├── Crear su stack
      └── Preparar su ejecución
             │
             ▼
        Menor costo
```

Esto no significa que crear un hilo sea gratuito. También requiere recursos y trabajo del sistema operativo, pero generalmente resulta más ligero que crear un proceso completamente independiente.

---

# Cambio de contexto entre procesos y threads

El cambio de contexto también puede variar dependiendo de qué se esté cambiando.

Cuando el sistema operativo cambia entre procesos diferentes, debe manejar contextos pertenecientes a espacios de direcciones diferentes.

```text id="e0v3tp"
Proceso A
    │
    │ Context Switch
    ▼
Proceso B
```

Cuando cambia entre hilos del mismo proceso, algunos recursos y estructuras pueden continuar siendo compartidos:

```text id="hj1e4k"
Proceso A
 ├── Hilo 1
 │      │
 │      │ Cambio
 │      ▼
 └── Hilo 2

Memoria del proceso → compartida
```

Por esta razón, los hilos pueden ser una alternativa eficiente cuando una aplicación necesita realizar varias tareas relacionadas.

Sin embargo, el costo exacto de un cambio de contexto depende del sistema operativo, del hardware y de la implementación utilizada. Por eso, no se debe asumir que todos los cambios entre hilos siempre tienen exactamente el mismo costo.

---

# Ejemplo práctico

Imaginemos una aplicación que descarga varios archivos.

Una forma sencilla sería utilizar un proceso para realizar todo el trabajo:

```text id="7rb4si"
             PROCESO
                │
                ▼
        Descargar archivos
```

Otra posibilidad es utilizar varios hilos dentro del mismo proceso:

```text id="a1z4fp"
                  PROCESO
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
     Hilo 1       Hilo 2       Hilo 3
       │            │            │
    Archivo 1    Archivo 2    Archivo 3
```

Los hilos pueden compartir información del proceso, como estructuras de datos utilizadas para administrar las descargas.

Esto puede hacer que la aplicación sea más eficiente para determinadas tareas.

Sin embargo, si varios hilos modifican los mismos datos, es necesario utilizar mecanismos de sincronización para evitar inconsistencias.

---

# Ejemplo con Python

Python proporciona el módulo `threading` para trabajar con hilos.

Un ejemplo sencillo es:

```python id="s1v8pv"
import threading

def tarea(nombre):
    print(f"Ejecutando {nombre}")

hilo1 = threading.Thread(target=tarea, args=("Hilo 1",))
hilo2 = threading.Thread(target=tarea, args=("Hilo 2",))

hilo1.start()
hilo2.start()

hilo1.join()
hilo2.join()

print("Todos los hilos terminaron")
```

En este ejemplo:

1. Se define una función que representa una tarea.
2. Se crean dos hilos.
3. Cada hilo ejecuta la función.
4. `start()` inicia los hilos.
5. `join()` permite esperar a que terminen.
6. Finalmente, el programa continúa después de que ambos hilos hayan terminado.

Los dos hilos pertenecen al mismo proceso de Python y pueden compartir recursos de ese proceso.

---

# Ventajas y desventajas

## Procesos

### Ventajas

* Mayor aislamiento entre tareas.
* Un problema en un proceso generalmente no afecta directamente al espacio de memoria de otro.
* Adecuados para tareas que necesitan independencia.

### Desventajas

* Su creación suele tener mayor costo.
* La comunicación entre procesos puede requerir mecanismos adicionales.
* Cambiar entre procesos puede implicar más trabajo de administración.

## Threads

### Ventajas

* Creación generalmente más ligera.
* Permiten dividir una aplicación en diferentes tareas.
* Los hilos del mismo proceso pueden compartir información fácilmente.
* Pueden ser útiles para aplicaciones que realizan varias tareas concurrentes.

### Desventajas

* Compartir memoria puede provocar condiciones de carrera.
* Un error en un hilo puede afectar al proceso al que pertenece.
* Se necesitan mecanismos de sincronización cuando varios hilos acceden a datos compartidos.

---

# ¿Cuándo utilizar procesos o threads?

La elección depende de las características de la aplicación.

Podemos utilizar procesos cuando necesitamos:

* Mayor aislamiento.
* Independencia entre tareas.
* Separación de recursos.
* Ejecutar componentes que no deberían compartir directamente su memoria.

Los hilos pueden ser apropiados cuando:

* Las tareas pertenecen a la misma aplicación.
* Necesitan compartir información.
* Se busca una forma de ejecución concurrente con menor costo de creación.
* Las tareas pueden coordinarse correctamente mediante mecanismos de sincronización.

No existe una opción que sea siempre mejor. La elección depende del problema que se quiera resolver y de las características del sistema.

---

# Relación con la concurrencia

La posibilidad de tener varios hilos ejecutándose dentro de un mismo proceso permite que diferentes tareas avancen de manera concurrente.

Por ejemplo:

```text id="r7s9gu"
Proceso
   │
   ├── Hilo 1 → tarea A
   ├── Hilo 2 → tarea B
   └── Hilo 3 → tarea C
```

Si estas tareas utilizan datos compartidos, es necesario controlar el acceso a dichos datos.

Por ejemplo:

```text id="6e1g7q"
Hilo 1 ──────┐
             ├──► Dato compartido
Hilo 2 ──────┘
```

Si ambos intentan modificar el dato simultáneamente sin ningún control, pueden producirse resultados incorrectos.

Este problema será estudiado en la **Unidad 3**, donde se analizarán las secciones críticas, condiciones de carrera y mecanismos de sincronización.

---

# En resumen

Un **proceso** es una instancia de un programa que posee recursos y un espacio de direcciones administrado por el sistema operativo.

Un **thread o hilo** es una unidad de ejecución que pertenece a un proceso. Los hilos de un mismo proceso comparten recursos y memoria, aunque cada uno mantiene su propio contexto de ejecución, como registros, contador de programa y stack.

La comparación principal puede resumirse así:

```text
                 PROCESO
                    │
        ┌───────────┼───────────┐
        │           │           │
     Hilo 1      Hilo 2      Hilo 3
        │           │           │
        └───────────┼───────────┘
                    │
          Memoria y recursos
              compartidos
```

Por lo tanto:

> **Los procesos proporcionan aislamiento y recursos independientes, mientras que los threads permiten dividir la ejecución dentro de un mismo proceso y compartir sus recursos.**

Esta diferencia es fundamental para comprender cómo los sistemas operativos administran tareas concurrentes y por qué los hilos requieren mecanismos de sincronización cuando trabajan con información compartida.
