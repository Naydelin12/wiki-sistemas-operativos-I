---
sidebar_position: 4
title: Semáforos
---

import SimuladorSemaforos from '@site/src/components/SimuladorSemaforos';

# Semáforos

## 1. Introducción

En los sistemas operativos modernos, varios procesos o hilos pueden ejecutarse concurrentemente y necesitar acceso a recursos compartidos.

Cuando estos procesos intentan utilizar un mismo recurso sin coordinación, pueden producirse condiciones de carrera, inconsistencias en los datos y problemas de sincronización.

Para controlar estas situaciones existen mecanismos como los **semáforos**, que permiten organizar el acceso de los procesos a recursos compartidos.

Los semáforos son especialmente importantes en sistemas multitarea, donde diferentes procesos necesitan utilizar recursos limitados de manera segura.

---

## 2. ¿Qué es un Semáforo?

Un **semáforo** es un mecanismo de sincronización que utiliza un contador interno y operaciones atómicas para controlar el acceso a recursos compartidos o coordinar la ejecución de procesos e hilos.

Fue introducido por Edsger W. Dijkstra como una herramienta para resolver problemas de sincronización.

Un semáforo permite determinar si un proceso puede continuar ejecutándose o si debe esperar hasta que se cumpla una condición.

### Ejemplo práctico

Supongamos que un sistema dispone de tres impresoras compartidas y cinco procesos necesitan imprimir documentos.

El semáforo puede inicializarse con el valor:

```text
S = 3
```

Esto representa tres permisos disponibles para utilizar las impresoras.

Cada vez que un proceso obtiene una impresora, consume un permiso del semáforo.

Cuando termina de imprimir, devuelve el permiso.

Si los tres permisos están ocupados, los demás procesos deben esperar.

---

## 3. Tipos de Semáforos

Existen dos tipos principales de semáforos: binarios y contadores.

### 3.1 Semáforo Binario

Un semáforo binario utiliza dos valores posibles:

- **1:** existe un permiso disponible.
- **0:** no existe ningún permiso disponible.

Se utiliza principalmente para controlar el acceso a un recurso que solamente puede ser utilizado por un proceso a la vez.

### Ejemplo

Dos procesos necesitan modificar un archivo compartido.

Inicialmente:

```text
S = 1
```

Cuando P1 obtiene el permiso:

```text
S = 0
```

Si P2 intenta ingresar mientras P1 utiliza el archivo, deberá esperar.

Cuando P1 termina, libera el permiso y P2 puede continuar.

### Relación con los mutex

Un semáforo binario puede utilizarse para implementar exclusión mutua, pero no es exactamente igual a un mutex.

Un **mutex** normalmente tiene un propietario y debe ser liberado por quien lo adquirió.

Un **semáforo binario** funciona mediante permisos y, dependiendo de su implementación, puede ser señalado por otro proceso o hilo.

---

### 3.2 Semáforo Contador

Un semáforo contador permite administrar varios permisos simultáneamente.

Su valor representa la cantidad de permisos disponibles.

### Ejemplo

Un servidor dispone de cuatro conexiones disponibles:

```text
S = 4
```

Cada proceso que obtiene una conexión disminuye el contador.

Cuando todas las conexiones están ocupadas:

```text
S = 0
```

Los nuevos procesos deben esperar hasta que alguna conexión sea liberada.

Este mecanismo permite administrar recursos limitados sin restringir innecesariamente la ejecución concurrente.

---

## 4. Operaciones Fundamentales

Los semáforos utilizan dos operaciones principales:

- `wait()`, también conocida como operación P.
- `signal()`, también conocida como operación V.

Estas operaciones deben ejecutarse de manera atómica para evitar condiciones de carrera.

### 4.1 Operación wait() o P

La operación `wait()` intenta obtener un permiso del semáforo.

Si existe un permiso disponible, el contador disminuye y el proceso continúa.

Si no hay permisos disponibles, el proceso debe esperar.

### Pseudocódigo conceptual

```text
wait(S) {
    atomicamente {
        if (S > 0) {
            S = S - 1;
            continuar;
        } else {
            bloquear_proceso();
        }
    }
}
```

Este pseudocódigo representa el comportamiento general. En una implementación real, la comprobación del contador y el registro del proceso en espera deben coordinarse atómicamente para evitar pérdidas de señales.

### 4.2 Operación signal() o V

La operación `signal()` devuelve un permiso al semáforo.

Si existen procesos esperando, el sistema puede entregar el permiso directamente a uno de ellos.

Si no hay procesos esperando, aumenta la cantidad de permisos disponibles.

### Pseudocódigo conceptual

```text
signal(S) {
    atomicamente {
        if (existen_procesos_esperando) {
            despertar_un_proceso();
            transferir_permiso();
        } else {
            S = S + 1;
        }
    }
}
```

**Importante:** Cuando un permiso se transfiere directamente a un proceso en espera, el contador puede permanecer en cero porque el permiso ya fue asignado.

---

## 5. Funcionamiento Paso a Paso

Supongamos que tres procesos, P1, P2 y P3, necesitan utilizar un recurso protegido mediante un semáforo binario.

Inicialmente:

```text
S = 1
```

### Paso 1. P1 solicita acceso

P1 ejecuta:

```text
wait(S)
```

Como existe un permiso disponible:

```text
S = 0
```

P1 obtiene el recurso.

### Paso 2. P2 solicita acceso

P2 ejecuta:

```text
wait(S)
```

Como el contador está en cero, P2 queda esperando.

### Paso 3. P3 solicita acceso

P3 también ejecuta `wait(S)`.

Al no existir permisos disponibles, queda esperando.

### Paso 4. P1 libera el recurso

P1 ejecuta:

```text
signal(S)
```

El permiso se entrega a uno de los procesos que están esperando.

Por ejemplo, si la implementación utiliza una cola FIFO, el permiso se asigna a P2.

### Paso 5. P2 utiliza el recurso

P2 continúa su ejecución.

Cuando termina, ejecuta `signal(S)` y permite que otro proceso obtenga el recurso.

Este procedimiento evita que varios procesos utilicen simultáneamente un recurso que requiere acceso exclusivo.

---

## 6. Ejemplo de Exclusión Mutua con Semáforo

Un semáforo binario puede utilizarse para proteger una sección crítica.

### Pseudocódigo

```text
Semáforo mutex = 1;

Proceso Pi:

while (true) {

    wait(mutex);

    // Sección crítica
    modificar_recurso_compartido();

    signal(mutex);

    // Sección restante
    realizar_otras_operaciones();
}
```

### Explicación

1. El semáforo inicia con un permiso.
2. El primer proceso que ejecuta `wait()` obtiene ese permiso.
3. Los demás procesos que intentan obtenerlo deben esperar.
4. El proceso que utiliza el recurso ejecuta `signal()` al terminar.
5. Otro proceso puede continuar.

Este mecanismo permite garantizar exclusión mutua cuando los procesos respetan correctamente el protocolo de adquisición y liberación.

---

## 7. Diferencias entre Semáforos Binarios y Contadores

| Característica | Semáforo binario | Semáforo contador |
|---|---|---|
| Valores disponibles | 0 y 1 | Enteros no negativos |
| Permisos simultáneos | Uno | Varios |
| Uso principal | Exclusión mutua o señalización | Administración de recursos limitados |
| Ejemplo | Acceso exclusivo a un archivo | Conjunto de conexiones |
| Operaciones | wait() y signal() | wait() y signal() |
| Procesos en espera | Cuando no hay permiso | Cuando se agotan los permisos |

Ambos tipos utilizan las mismas operaciones fundamentales, pero se diferencian en la cantidad de permisos que administran.

---

## 8. Problemas Relacionados con los Semáforos

Aunque los semáforos permiten resolver problemas de sincronización, su utilización incorrecta puede generar nuevas dificultades.

### 8.1 Interbloqueo (Deadlock)

Ocurre cuando dos o más procesos quedan esperando recursos que no pueden obtener porque otros procesos del conjunto los mantienen retenidos.

Por ejemplo:

- P1 mantiene el recurso A y espera B.
- P2 mantiene el recurso B y espera A.

Ninguno puede continuar.

### 8.2 Inanición (Starvation)

Se presenta cuando un proceso espera indefinidamente porque otros procesos reciben repetidamente los permisos disponibles.

La política de selección de procesos en espera influye en este problema.

### 8.3 Liberación incorrecta de permisos

Si un proceso ejecuta `signal()` sin respetar el protocolo previsto, puede alterar la cantidad de permisos disponibles.

Esto podría permitir accesos concurrentes que deberían estar restringidos.

### 8.4 Olvidar liberar el recurso

Si un proceso obtiene un permiso y nunca lo devuelve, otros procesos podrían quedar bloqueados esperando.

Por esta razón, es importante garantizar que los recursos se liberen correctamente, incluso cuando ocurren errores.

---

## 9. Aplicaciones de los Semáforos

Los semáforos tienen diferentes aplicaciones dentro de los sistemas operativos y programas concurrentes.

### Control de impresoras

Permiten limitar la cantidad de procesos que utilizan impresoras disponibles.

### Conexiones a bases de datos

Controlan el número de conexiones simultáneas permitidas.

### Productor-consumidor

Coordinan procesos que producen información y otros que la consumen mediante un búfer compartido.

### Sistemas de archivos

Pueden utilizarse para controlar operaciones que necesitan acceso sincronizado a información compartida.

### Servidores concurrentes

Permiten limitar la cantidad de tareas que utilizan determinados recursos del servidor.

---

## 10. Ventajas y Limitaciones

| Ventajas | Limitaciones |
|---|---|
| Permiten sincronizar procesos e hilos. | Requieren un uso cuidadoso. |
| Controlan recursos compartidos. | Pueden producir interbloqueos si se utilizan incorrectamente. |
| Admiten múltiples permisos. | No garantizan por sí solos un orden justo de atención. |
| Pueden evitar condiciones de carrera. | Los errores de adquisición o liberación pueden ser difíciles de detectar. |
| Son útiles en distintos problemas de concurrencia. | Su manejo manual puede complicar programas grandes. |

---

## 11. Simulador Interactivo de Semáforos

El siguiente simulador permite comprender cómo los semáforos controlan el acceso de varios procesos a recursos compartidos mediante las operaciones `wait()` y `signal()`.

### Instrucciones de uso

1. Selecciona el tipo de semáforo: **binario** o **contador**.
2. Si seleccionas un semáforo contador, establece la cantidad de permisos disponibles.
3. Presiona **wait()** en cualquiera de los cuatro procesos para solicitar un permiso.
4. Observa cómo disminuye la cantidad de permisos disponibles.
5. Cuando se agoten los permisos, los siguientes procesos que ejecuten `wait()` quedarán bloqueados.
6. Consulta la **cola de espera FIFO** para identificar el orden de los procesos bloqueados.
7. Presiona **signal()** en un proceso que esté utilizando un permiso para liberarlo.
8. Observa cómo el primer proceso bloqueado recibe el permiso y continúa.
9. Utiliza **Reiniciar simulación** para comenzar nuevamente.

### ¿Qué permite comprobar?

- La diferencia entre semáforos binarios y contadores.
- El funcionamiento de las operaciones `wait()` y `signal()`.
- La administración de permisos disponibles y ocupados.
- El bloqueo de procesos cuando no existen permisos.
- La transferencia de permisos mediante una cola FIFO.

El simulador utiliza una representación educativa de los semáforos. Los procesos son controlados mediante botones y no corresponden a hilos reales del sistema operativo.

<SimuladorSemaforos />

---

## 12. Importancia en los Sistemas Operativos

Los semáforos representan uno de los mecanismos clásicos más importantes de sincronización.

Su funcionamiento permite comprender cómo los sistemas operativos coordinan procesos y administran recursos limitados.

También constituyen una base para estudiar problemas como productor-consumidor, lectores-escritores y filósofos comensales.

A diferencia de los algoritmos clásicos de Dekker y Peterson, los semáforos pueden ser implementados mediante primitivas del sistema operativo que bloquean procesos o hilos cuando no hay permisos disponibles.

Esto permite evitar el consumo innecesario de CPU asociado con ciertas formas de espera activa.

---

## 13. Conclusión

Los semáforos son herramientas fundamentales para controlar el acceso concurrente a recursos compartidos y coordinar la ejecución de procesos e hilos.

Mediante las operaciones atómicas `wait()` y `signal()`, permiten administrar permisos y organizar la espera de los procesos cuando los recursos no están disponibles.

Los semáforos binarios resultan útiles para controlar accesos exclusivos, mientras que los semáforos contadores permiten administrar varios recursos simultáneamente.

Comprender su funcionamiento es esencial para estudiar los mecanismos de sincronización utilizados en los sistemas operativos modernos.

---