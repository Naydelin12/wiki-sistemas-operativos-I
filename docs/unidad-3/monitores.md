---
sidebar_position: 5
title: Monitores y Variables de Condición
---

import SimuladorMonitores from '@site/src/components/SimuladorMonitores';

# Monitores y Variables de Condición

## 1. Introducción

En los sistemas operativos, varios procesos o hilos pueden necesitar utilizar los mismos recursos de manera concurrente.

Cuando diferentes procesos acceden simultáneamente a datos compartidos sin una coordinación adecuada, pueden producirse condiciones de carrera, inconsistencias y errores.

Para evitar estos problemas existen mecanismos de sincronización como los **monitores y las variables de condición**.

Los monitores permiten organizar el acceso exclusivo a recursos compartidos, mientras que las variables de condición permiten suspender y reanudar procesos cuando se cumplen determinadas condiciones.

---

## 2. ¿Qué es un Monitor?

Un **monitor** es una estructura de sincronización de alto nivel que agrupa datos compartidos, procedimientos para manipularlos y mecanismos de exclusión mutua.

Su característica principal es que solamente un proceso o hilo puede ejecutar un procedimiento protegido del monitor a la vez.

Esto permite controlar el acceso a recursos compartidos sin que cada proceso tenga que administrar directamente las operaciones de adquisición y liberación de un semáforo.

### Elementos de un monitor

Un monitor generalmente contiene:

- **Datos compartidos:** información que debe protegerse frente a accesos concurrentes.
- **Procedimientos:** operaciones que permiten consultar o modificar los datos.
- **Exclusión mutua:** mecanismo que impide la ejecución simultánea dentro del monitor.
- **Variables de condición:** herramientas para suspender procesos hasta que se cumplan determinadas condiciones.

### Ejemplo práctico

Supongamos que un sistema bancario tiene una cuenta compartida.

Dos procesos desean modificar el saldo:

- P1 realiza un depósito.
- P2 realiza un retiro.

Un monitor permite que estas operaciones se ejecuten de forma coordinada, evitando que ambos procesos modifiquen simultáneamente el saldo.

---

## 3. Estructura General de un Monitor

Un monitor puede representarse mediante el siguiente pseudocódigo conceptual:

```text
monitor CuentaBancaria {

    int saldo = 1000;

    procedure depositar(cantidad) {
        saldo = saldo + cantidad;
    }

    procedure retirar(cantidad) {
        saldo = saldo - cantidad;
    }

}
```

El monitor protege la variable `saldo` y permite modificarla mediante procedimientos controlados.

Si P1 está ejecutando `depositar()`, P2 deberá esperar para ejecutar `retirar()` dentro del mismo monitor.

**Importante:** Este ejemplo representa la exclusión mutua, pero no incluye todavía una condición que impida retirar una cantidad superior al saldo disponible.

---

## 4. Funcionamiento de los Monitores

El funcionamiento general de un monitor puede dividirse en varias etapas.

### Paso 1. Solicitar acceso

Un proceso intenta ejecutar uno de los procedimientos del monitor.

### Paso 2. Comprobar disponibilidad

Si ningún otro proceso está ejecutándose dentro del monitor, puede ingresar.

Si el monitor está ocupado, deberá esperar en la cola de entrada.

### Paso 3. Ejecutar el procedimiento

El proceso que obtiene acceso puede consultar o modificar los datos protegidos.

### Paso 4. Salir del monitor

Cuando termina su procedimiento, libera el acceso.

### Paso 5. Permitir el ingreso de otro proceso

Si existen procesos esperando en la cola de entrada, uno de ellos podrá continuar.

De esta manera, el monitor garantiza que los procedimientos protegidos no se ejecuten simultáneamente.

---

## 5. ¿Qué son las Variables de Condición?

Una **variable de condición** es un mecanismo de sincronización que permite a un proceso esperar hasta que se cumpla una condición relacionada con los datos compartidos.

Se utiliza dentro de un monitor para coordinar procesos que necesitan esperar determinados eventos.

Por ejemplo, un proceso puede necesitar esperar hasta que:

- Existan productos disponibles en un búfer.
- Haya espacio para almacenar información.
- Se alcance una determinada cantidad de recursos.
- Otro proceso termine una operación necesaria.

Las variables de condición permiten coordinar estas situaciones mediante operaciones como `wait()` y `signal()`.

---

## 6. Operaciones de las Variables de Condición

### 6.1 Operación wait()

La operación `wait()` suspende al proceso que la ejecuta sobre una variable de condición.

Cuando esto ocurre:

1. El proceso se agrega a la cola de espera de la condición.
2. Libera el acceso exclusivo al monitor.
3. Permanece suspendido hasta recibir una notificación y poder continuar.
4. Antes de reanudar la ejecución protegida, debe recuperar el acceso al monitor.

Esta característica es fundamental porque permite que otros procesos ingresen al monitor y modifiquen los datos necesarios para satisfacer la condición.

### Ejemplo

```text
while (saldo < cantidad) {
    fondosDisponibles.wait();
}
```

El proceso espera mientras el saldo sea insuficiente.

Se utiliza `while` en lugar de `if` porque, al despertar y recuperar el monitor, debe comprobar nuevamente que la condición se cumple.

---

### 6.2 Operación signal()

La operación `signal()` notifica a un proceso que está esperando sobre una variable de condición.

Si existen procesos esperando, uno de ellos puede ser seleccionado para continuar.

Si no existen procesos esperando, normalmente la señal no se almacena para utilizarse posteriormente.

### Ejemplo

```text
fondosDisponibles.signal();
```

Esta operación puede ejecutarse después de un depósito para notificar que el saldo ha cambiado.

### Diferencia importante

La operación `signal()` de una variable de condición no funciona exactamente igual que la operación `signal()` de un semáforo.

En un semáforo, una señal puede aumentar los permisos disponibles.

En una variable de condición, una señal normalmente notifica a un proceso que ya estaba esperando.

---

## 7. Semántica de los Monitores

Existen diferentes modelos que determinan cómo continúa la ejecución después de una señal.

### 7.1 Semántica de Hoare

En el modelo de Hoare, cuando un proceso ejecuta `signal()` y existe otro proceso esperando, el proceso señalado recibe inmediatamente el control del monitor.

El proceso que emitió la señal queda suspendido temporalmente.

### 7.2 Semántica de Mesa

En el modelo de Mesa, cuando un proceso ejecuta `signal()`, el proceso señalado queda habilitado para continuar, pero no obtiene inmediatamente el monitor.

El proceso que emitió la señal puede continuar ejecutándose hasta liberar el monitor.

Por esta razón, el proceso despertado debe volver a comprobar la condición cuando consigue ingresar.

### Comparación

| Característica | Hoare | Mesa |
|---|---|---|
| Transferencia del monitor | Inmediata al proceso señalado | No inmediata |
| Proceso que ejecuta signal() | Cede temporalmente el monitor | Puede continuar |
| Proceso señalado | Continúa dentro del monitor | Debe recuperar el monitor |
| Comprobación de la condición | Garantizada en el punto de transferencia, bajo los supuestos del modelo | Debe repetirse al reanudar |

---

## 8. Ejemplo Práctico: Productor y Consumidor

Uno de los problemas clásicos de sincronización es el de productor-consumidor.

Supongamos que existe un búfer compartido con capacidad para tres productos.

- El **productor** agrega productos al búfer.
- El **consumidor** retira productos del búfer.

El sistema debe evitar dos situaciones:

1. Que el productor agregue productos cuando el búfer está lleno.
2. Que el consumidor retire productos cuando el búfer está vacío.

### Variables de condición

Se pueden utilizar dos variables:

- `noLleno`: permite esperar hasta que exista espacio disponible.
- `noVacio`: permite esperar hasta que existan productos disponibles.

### Pseudocódigo

```text
monitor Buffer {

    int cantidad = 0;
    int capacidad = 3;

    condition noLleno;
    condition noVacio;

    procedure producir() {

        while (cantidad == capacidad) {
            noLleno.wait();
        }

        cantidad = cantidad + 1;

        noVacio.signal();
    }

    procedure consumir() {

        while (cantidad == 0) {
            noVacio.wait();
        }

        cantidad = cantidad - 1;

        noLleno.signal();
    }
}
```

Este pseudocódigo utiliza la semántica de Mesa, en la que los procesos despertados deben volver a comprobar la condición.

### Ejemplo de ejecución

1. El búfer comienza vacío.
2. El consumidor intenta retirar un producto.
3. Como no existen productos, ejecuta `noVacio.wait()`.
4. El consumidor libera el monitor y queda suspendido.
5. El productor ingresa y agrega un producto.
6. El productor ejecuta `noVacio.signal()`.
7. El consumidor queda habilitado para continuar.
8. Cuando recupera el monitor, comprueba nuevamente la condición.
9. Si existe un producto, lo retira.

---

## 9. Diferencias entre Monitores y Semáforos

| Característica | Monitores | Semáforos |
|---|---|---|
| Nivel de abstracción | Alto | Más bajo |
| Exclusión mutua | Integrada en los procedimientos protegidos | Requiere utilizar correctamente wait() y signal() |
| Organización | Agrupa datos y procedimientos | Administra permisos o señales |
| Espera por condiciones | Variables de condición | Semáforos utilizados para coordinación |
| Control de acceso | Asociado a la estructura del monitor | Mediante operaciones explícitas |
| Riesgo de errores | Reduce ciertos errores de sincronización | Depende del uso correcto de las operaciones |

Los monitores facilitan la organización del código concurrente al integrar los datos compartidos con sus mecanismos de protección.

Sin embargo, su uso incorrecto también puede producir problemas de sincronización.

---

## 10. Problemas y Limitaciones

### 10.1 Interbloqueo

Puede producirse cuando varios procesos esperan condiciones o recursos que no pueden satisfacerse debido a dependencias circulares.

### 10.2 Inanición

Un proceso puede permanecer esperando demasiado tiempo si la política de planificación no garantiza un acceso justo.

### 10.3 Señales perdidas

Si un proceso ejecuta `signal()` cuando no existen procesos esperando, la notificación normalmente no queda almacenada.

Por esta razón, las variables de condición deben utilizarse junto con estados compartidos que permitan comprobar si realmente se cumple la condición esperada.

### 10.4 Uso incorrecto de las condiciones

Si un proceso utiliza `if` en lugar de `while` para comprobar una condición, podría continuar cuando esta ya no se cumple.

Esto es especialmente importante en monitores con semántica de Mesa.

---

## 11. Aplicaciones de los Monitores

Los monitores se utilizan en diferentes situaciones relacionadas con la programación concurrente.

### Sistemas bancarios

Protegen operaciones que modifican información compartida, como saldos y movimientos.

### Productor-consumidor

Coordinan la producción y el consumo de información almacenada en búferes.

### Sistemas de inventario

Permiten sincronizar operaciones de entrada y salida de productos.

### Servidores concurrentes

Protegen estructuras compartidas utilizadas por múltiples hilos.

### Aplicaciones multihilo

Facilitan la coordinación entre tareas que necesitan compartir información.

---

## 12. Ventajas y Desventajas

| Ventajas | Desventajas |
|---|---|
| Integran exclusión mutua y datos compartidos. | Requieren comprender correctamente las condiciones de espera. |
| Facilitan la organización de programas concurrentes. | Pueden presentar interbloqueos. |
| Reducen ciertos errores de sincronización manual. | Una mala implementación puede causar inanición. |
| Permiten suspender procesos mediante variables de condición. | Las diferencias entre Hoare y Mesa pueden generar confusión. |
| Son útiles en aplicaciones multihilo. | Dependen de las herramientas de sincronización del lenguaje o entorno. |

---

## 13. Simulador Interactivo de Monitores y Variables de Condición

El siguiente simulador permite observar cómo un monitor coordina el acceso de varios procesos a un búfer compartido, utilizando exclusión mutua y variables de condición.

Se utiliza el problema clásico de **productor-consumidor**, donde los productores agregan elementos y los consumidores los retiran.

### Instrucciones de uso

1. Observa el búfer compartido, que tiene una capacidad máxima de tres productos.
2. Selecciona un productor (P1 o P2) y presiona **Solicitar acceso**.
3. Presiona **Ejecutar** para agregar un producto al búfer.
4. Repite las operaciones hasta llenar el búfer.
5. Intenta producir otro elemento y observa cómo el proceso queda esperando en la condición `noLleno`.
6. Selecciona un consumidor (C1 o C2) para retirar un producto.
7. Observa cómo se ejecuta `signal(noLleno)` y se notifica al productor que estaba esperando.
8. Comprueba que el proceso notificado debe recuperar el acceso al monitor antes de continuar.
9. También puedes intentar consumir cuando el búfer esté vacío para observar la condición `noVacio`.
10. Utiliza **Reiniciar simulación** para comenzar nuevamente.

### ¿Qué permite comprobar?

- La exclusión mutua dentro del monitor.
- El funcionamiento del búfer compartido.
- La coordinación entre productores y consumidores.
- Las condiciones `noLleno` y `noVacio`.
- La suspensión de procesos mediante `wait()`.
- La notificación de procesos mediante `signal()`.
- El funcionamiento de las colas de entrada y de condición.
- La semántica de Mesa, donde un proceso notificado debe recuperar el monitor antes de continuar.

**Nota:** Esta interfaz es una representación educativa. Los procesos son simulados mediante estados de React y no corresponden a hilos reales del sistema operativo.

<SimuladorMonitores />

---

## 14. Importancia en los Sistemas Operativos

Los monitores representan una evolución importante de los mecanismos de sincronización porque permiten organizar la protección de recursos compartidos mediante estructuras de alto nivel.

Su estudio ayuda a comprender:

- La exclusión mutua.
- La coordinación entre procesos e hilos.
- Las colas de entrada y de condición.
- La suspensión y reanudación de procesos.
- La diferencia entre notificar y transferir permisos.
- La importancia de comprobar nuevamente las condiciones de espera.

Estos conceptos son fundamentales para comprender el funcionamiento de aplicaciones concurrentes y mecanismos modernos de sincronización.

---

## 15. Conclusión

Los monitores y las variables de condición son herramientas fundamentales para coordinar procesos que necesitan utilizar recursos compartidos.

Los monitores proporcionan exclusión mutua durante la ejecución de procedimientos protegidos, mientras que las variables de condición permiten suspender procesos hasta que puedan continuar.

Las operaciones `wait()` y `signal()` facilitan la coordinación, aunque su comportamiento debe comprenderse correctamente para evitar errores.

El estudio de estos mecanismos permite entender cómo se organizan los programas concurrentes y cómo se protege la información compartida en los sistemas operativos.

---