---
sidebar_position: 1
title: Problema de la Sección Crítica
---

import SimuladorSeccionCritica from '@site/src/components/SimuladorSeccionCritica';

# Problema de la Sección Crítica

## 1. Introducción

En los sistemas operativos modernos es común que varios procesos o hilos se ejecuten concurrentemente y necesiten utilizar los mismos recursos, como archivos, variables en memoria, impresoras o bases de datos.

Cuando dos o más procesos intentan modificar un recurso compartido sin una coordinación adecuada, pueden producirse resultados incorrectos o inconsistencias en la información.

Para evitar estos problemas, los sistemas operativos utilizan mecanismos de sincronización que controlan el acceso a las regiones del programa donde se manipulan recursos compartidos.

---

## 2. ¿Qué es una Sección Crítica?

Una **sección crítica** es una parte del código de un proceso o hilo en la que se accede a datos o recursos compartidos que requieren protección frente a accesos concurrentes.

El problema de la sección crítica consiste en establecer un mecanismo que permita a los procesos compartir recursos sin provocar interferencias.

**Ejemplo:**

Supongamos que dos procesos necesitan actualizar el saldo de una cuenta bancaria.

- El proceso P1 desea retirar Q100.
- El proceso P2 desea retirar Q200.
- El saldo inicial es Q1,000.

Si ambos procesos leen el saldo inicial antes de que alguno guarde su modificación, podrían sobrescribir los resultados del otro.

La sincronización debe garantizar que las actualizaciones se realicen correctamente.

---

## 3. Estructura General de una Sección Crítica

Un proceso que utiliza recursos compartidos puede dividir su ejecución en cuatro partes:

| Etapa | Descripción |
|---|---|
| Sección de entrada | Solicita autorización para acceder al recurso compartido. |
| Sección crítica | Ejecuta las operaciones que requieren acceso exclusivo. |
| Sección de salida | Libera el acceso al recurso. |
| Sección restante | Ejecuta instrucciones que no necesitan el recurso protegido. |

### Ejemplo en pseudocódigo

```text
Proceso P1:

while (true) {

    // Sección de entrada
    solicitar_acceso();

    // Sección crítica
    modificar_recurso_compartido();

    // Sección de salida
    liberar_acceso();

    // Sección restante
    realizar_otras_operaciones();
}
```

La implementación de `solicitar_acceso()` y `liberar_acceso()` depende del mecanismo de sincronización utilizado.

---

## 4. Condición de Carrera (Race Condition)

Una **condición de carrera** ocurre cuando el resultado de una operación depende del orden o momento en que se ejecutan varios procesos o hilos que acceden a información compartida sin la sincronización necesaria.

### Ejemplo práctico

Supongamos que una variable compartida tiene el valor inicial:

```text
contador = 5
```

Dos procesos ejecutan la siguiente operación:

```text
contador = contador + 1
```

El resultado esperado después de dos incrementos es:

```text
contador = 7
```

Sin embargo, si ambos procesos leen el valor 5 antes de guardar sus resultados, los dos podrían escribir 6.

**Resultado incorrecto:**

```text
contador = 6
```

Esto sucede porque la operación de incremento puede involucrar varias instrucciones: leer, sumar y escribir.

La condición de carrera se evita mediante mecanismos de sincronización adecuados.

---

## 5. Requisitos para Resolver el Problema de la Sección Crítica

Una solución correcta al problema clásico de la sección crítica debe satisfacer tres propiedades fundamentales.

### 5.1 Exclusión Mutua

Establece que, si un proceso está ejecutando su sección crítica, ningún otro proceso puede ejecutar simultáneamente una sección crítica que acceda al mismo recurso protegido.

**Ejemplo:** Si P1 está modificando un archivo compartido, P2 debe esperar hasta que P1 libere el acceso.

### 5.2 Progreso

Cuando ningún proceso se encuentra en su sección crítica y existen procesos interesados en ingresar, la selección del siguiente proceso no debe posponerse indefinidamente.

**Ejemplo:** Si el recurso está libre y P2 solicita utilizarlo, el sistema debe permitir que se tome una decisión sobre su ingreso sin bloqueos innecesarios.

### 5.3 Espera Acotada

Debe existir un límite en la cantidad de veces que otros procesos pueden ingresar a sus secciones críticas después de que un proceso haya solicitado acceso y antes de que su solicitud sea atendida.

**Ejemplo:** Si P1 está esperando, no debe permitirse que P2 lo adelante indefinidamente.

---

## 6. Comparación de las Propiedades

| Propiedad | Objetivo principal | Problema que evita |
|---|---|---|
| Exclusión mutua | Proteger el acceso exclusivo al recurso. | Accesos simultáneos incompatibles. |
| Progreso | Permitir decisiones de acceso sin demoras indefinidas. | Bloqueos innecesarios cuando el recurso está libre. |
| Espera acotada | Limitar el tiempo de espera en términos de turnos de acceso. | Inanición de procesos. |

Estas tres propiedades permiten evaluar si un algoritmo de sincronización resuelve correctamente el problema de la sección crítica bajo sus supuestos de funcionamiento.

---

## 7. Simulador Interactivo de Sección Crítica

En este simulador podrás observar cómo dos procesos
intentan acceder a un mismo recurso compartido.

### Instrucciones

1. Presiona **Solicitar acceso** en el proceso P1.
2. Observa cómo P1 ingresa a la sección crítica.
3. Presiona **Solicitar acceso** en P2.
4. Comprueba que P2 permanece en espera.
5. Libera el recurso desde P1.
6. Observa cómo P2 obtiene el acceso.

El simulador demuestra el principio de **exclusión mutua**,
impidiendo que dos procesos utilicen simultáneamente
el mismo recurso protegido.

<SimuladorSeccionCritica />

---

## 8. Importancia en los Sistemas Operativos

El control de las secciones críticas es fundamental porque permite:

- Proteger la integridad de los datos compartidos.
- Evitar condiciones de carrera.
- Coordinar la ejecución de procesos e hilos.
- Mantener la consistencia de archivos y estructuras en memoria.
- Implementar mecanismos seguros de concurrencia.

Este problema constituye la base para comprender algoritmos como **Dekker y Peterson**, así como mecanismos de sincronización más avanzados, entre ellos los semáforos y monitores.

---

## 9. Conclusión

El problema de la sección crítica representa uno de los principales desafíos de la programación concurrente. Cuando varios procesos comparten información, es necesario establecer reglas que controlen el acceso y eviten resultados inconsistentes.

Las propiedades de exclusión mutua, progreso y espera acotada permiten determinar si una solución proporciona una coordinación adecuada entre procesos.

Comprender estos principios resulta indispensable para estudiar los mecanismos de sincronización utilizados por los sistemas operativos modernos.

---