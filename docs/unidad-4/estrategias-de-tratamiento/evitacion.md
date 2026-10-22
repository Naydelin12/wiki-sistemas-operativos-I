---
sidebar_position: 3
title: Evitación de Interbloqueos
---

import SimuladorBanquero from '@site/src/components/SimuladorBanquero';

# Evitación de Interbloqueos

## 1. Introducción

En los sistemas operativos, varios procesos pueden necesitar recursos compartidos para realizar sus actividades. Cuando estos recursos son limitados, una asignación inadecuada puede provocar que los procesos queden bloqueados esperando recursos que otros procesos mantienen ocupados.

La **evitación de interbloqueos** es una estrategia que analiza las solicitudes de recursos antes de concederlas, con el objetivo de mantener el sistema en un estado seguro.

A diferencia de la prevención, que establece restricciones generales sobre la utilización de recursos, la evitación permite una asignación más flexible, siempre que no comprometa la seguridad del sistema.

Uno de los mecanismos más conocidos para aplicar esta estrategia es el **Algoritmo del Banquero**.

---

## 2. ¿Qué es la evitación de interbloqueos?

La evitación de interbloqueos consiste en evaluar el estado actual del sistema y determinar si una nueva asignación de recursos permitiría que todos los procesos puedan finalizar en algún orden.

Antes de conceder una solicitud, el sistema analiza:

- Los recursos disponibles.
- Los recursos actualmente asignados.
- Las necesidades máximas declaradas por cada proceso.
- Los recursos que todavía necesita cada proceso para finalizar.

Si la asignación mantiene al sistema en un estado seguro, puede autorizarse.

Si la asignación provoca un estado inseguro, la solicitud se pospone.

### Diferencia entre prevención y evitación

| Prevención | Evitación |
|---|---|
| Impone reglas para impedir alguna condición de Coffman | Analiza cada solicitud de recursos |
| Puede restringir la forma en que los procesos trabajan | Permite asignaciones flexibles cuando son seguras |
| No necesita comprobar continuamente estados seguros | Requiere comprobar si existe una secuencia segura |
| Ejemplo: solicitar los recursos siguiendo un orden global | Ejemplo: Algoritmo del Banquero |

---

## 3. Estados seguros e inseguros

Para comprender la evitación de interbloqueos, es necesario distinguir entre un estado seguro y uno inseguro.

### 3.1 Estado seguro

Un sistema se encuentra en un **estado seguro** cuando existe al menos un orden de ejecución en el que todos los procesos pueden obtener los recursos que necesitan, finalizar y liberar los recursos utilizados.

Este orden se conoce como **secuencia segura**.

Por ejemplo:

```text
P1 → P3 → P2
```

Esto significa que P1 puede finalizar primero, liberar sus recursos y permitir que P3 continúe. Finalmente, P2 podrá obtener los recursos necesarios para terminar.

### 3.2 Estado inseguro

Un sistema se encuentra en un **estado inseguro** cuando no existe una secuencia segura que garantice la finalización de todos los procesos considerando sus necesidades máximas declaradas.

Un estado inseguro no significa necesariamente que ya exista un interbloqueo.

Sin embargo, representa una situación en la que el sistema podría llegar a quedar interbloqueado.

### Comparación

| Estado seguro | Estado inseguro |
|---|---|
| Existe una secuencia segura | No existe una secuencia segura |
| Se puede garantizar una finalización ordenada bajo los supuestos del algoritmo | No se puede garantizar la finalización |
| El Algoritmo del Banquero puede autorizar la asignación | El algoritmo pospone la solicitud que produciría ese estado |

---

## 4. Algoritmo del Banquero

El **Algoritmo del Banquero** es un procedimiento de evitación de interbloqueos que determina si una solicitud de recursos puede concederse sin comprometer la seguridad del sistema.

Su nombre proviene de una comparación con un banco que administra una cantidad limitada de dinero y debe asegurarse de poder satisfacer los compromisos asumidos con sus clientes.

De manera similar, el sistema operativo administra recursos limitados y verifica si puede satisfacer las necesidades declaradas de sus procesos.

### Objetivo

Mantener el sistema en un estado seguro mediante la evaluación de las solicitudes antes de asignar recursos.

### Requisitos

Para utilizar este algoritmo se necesita conocer:

1. La cantidad total de recursos de cada tipo.
2. Los recursos disponibles.
3. Los recursos asignados a cada proceso.
4. La demanda máxima declarada de cada proceso.

El algoritmo supone que los procesos terminan y liberan sus recursos, y que no solicitan cantidades superiores a sus máximos declarados.

---

## 5. Estructuras de datos utilizadas

El Algoritmo del Banquero utiliza varias matrices y vectores.

### 5.1 Matriz Allocation (Asignación)

Representa la cantidad de recursos que actualmente tiene asignados cada proceso.

### 5.2 Matriz Max (Máximo)

Representa la cantidad máxima de recursos que cada proceso podría necesitar durante su ejecución.

### 5.3 Matriz Need (Necesidad)

Representa los recursos adicionales que cada proceso podría necesitar para finalizar.

Se calcula mediante:

**Need = Max - Allocation**

### 5.4 Vector Available (Disponible)

Indica cuántas unidades de cada tipo de recurso están disponibles actualmente.

### Ejemplo

Supongamos que tenemos tres procesos y dos tipos de recursos: A y B.

**Matriz Allocation**

| Proceso | A | B |
|---|---:|---:|
| P1 | 1 | 0 |
| P2 | 1 | 1 |
| P3 | 0 | 1 |

**Matriz Max**

| Proceso | A | B |
|---|---:|---:|
| P1 | 3 | 2 |
| P2 | 2 | 2 |
| P3 | 2 | 2 |

**Matriz Need**

| Proceso | A | B |
|---|---:|---:|
| P1 | 2 | 2 |
| P2 | 1 | 1 |
| P3 | 2 | 1 |

**Vector Available**

```text
Available = [1, 1]
```

En este ejemplo, las cantidades totales de recursos son:

```text
Total = [3, 3]
```

---

## 6. Algoritmo de seguridad

El algoritmo de seguridad determina si existe una secuencia en la que todos los procesos puedan finalizar.

### Funcionamiento

1. Se crea un vector de trabajo llamado `Work`, inicialmente igual a `Available`.
2. Se marca cada proceso como no finalizado.
3. Se busca un proceso cuya necesidad pendiente sea menor o igual a `Work`.
4. Si se encuentra, se simula su finalización y se agregan sus recursos asignados a `Work`.
5. Se marca el proceso como finalizado.
6. Se repite el procedimiento hasta finalizar todos los procesos o hasta que ninguno pueda avanzar.

Si todos los procesos pueden finalizar, el sistema está en estado seguro.

Si quedan procesos sin finalizar y ninguno puede continuar, el estado es inseguro.

### Ejemplo paso a paso

Utilizando las matrices anteriores:

**Estado inicial**

```text
Work = [1, 1]
```

P2 necesita `[1, 1]`, por lo que puede finalizar.

Al terminar, libera su asignación `[1, 1]`:

```text
Work = [1, 1] + [1, 1]
Work = [2, 2]
```

Ahora P1 necesita `[2, 2]`, por lo que puede finalizar.

P1 libera `[1, 0]`:

```text
Work = [2, 2] + [1, 0]
Work = [3, 2]
```

Finalmente, P3 necesita `[2, 1]` y puede finalizar.

P3 libera `[0, 1]`:

```text
Work = [3, 2] + [0, 1]
Work = [3, 3]
```

La secuencia segura encontrada es:

```text
P2 → P1 → P3
```

**Resultado: el sistema está en estado seguro.**

Es importante comprender que el algoritmo simula estas finalizaciones para verificar la seguridad; no ejecuta realmente los procesos durante esta comprobación.

---

## 7. Algoritmo de solicitud de recursos

Cuando un proceso solicita recursos adicionales, el sistema debe comprobar si es seguro concederlos.

### Pasos

1. Verificar que la solicitud no supere la necesidad pendiente del proceso.
2. Comprobar que existan suficientes recursos disponibles.
3. Simular temporalmente la asignación solicitada.
4. Ejecutar el algoritmo de seguridad sobre el estado simulado.
5. Si el estado continúa siendo seguro, confirmar la asignación.
6. Si el estado resulta inseguro, deshacer la asignación temporal y posponer la solicitud.

### Ejemplo de solicitud

Utilizando el estado anterior, P2 solicita:

```text
Request(P2) = [1, 0]
```

Su necesidad actual es:

```text
Need(P2) = [1, 1]
```

Y los recursos disponibles son:

```text
Available = [1, 1]
```

La solicitud no supera la necesidad ni los recursos disponibles.

Si se concede temporalmente, obtenemos:

```text
Available = [0, 1]
Allocation(P2) = [2, 1]
Need(P2) = [0, 1]
```

Con estos valores, P2 puede finalizar primero. Al liberar sus recursos, los demás procesos también pueden finalizar.

Por tanto, la solicitud mantiene el sistema en un estado seguro y puede concederse.

---

## 8. Ventajas y desventajas

### Ventajas

- Permite aprovechar los recursos de manera flexible.
- Evalúa las solicitudes antes de concederlas.
- Evita entrar en estados inseguros.
- Permite identificar secuencias seguras de finalización.

### Desventajas

- Requiere conocer anticipadamente las necesidades máximas de los procesos.
- Necesita realizar cálculos adicionales para comprobar la seguridad.
- Puede resultar poco práctico en sistemas con necesidades de recursos muy variables.
- Algunas solicitudes pueden permanecer esperando durante períodos prolongados.

---

## 9. Aplicaciones prácticas

Los principios de evitación de interbloqueos pueden utilizarse en sistemas donde los recursos y sus demandas máximas son conocidos.

Algunos ejemplos educativos y de aplicación son:

- Sistemas de procesamiento por lotes con necesidades de recursos declaradas.
- Sistemas de administración de recursos con límites conocidos.
- Simuladores de planificación y asignación de recursos.
- Entornos de enseñanza de concurrencia y sistemas operativos.

El Algoritmo del Banquero es especialmente útil para comprender cómo una asignación aparentemente posible puede comprometer la seguridad futura del sistema.

---

## 10. Simulador Interactivo del Algoritmo del Banquero

En esta sección incorporaremos un simulador interactivo que permitirá observar el funcionamiento del Algoritmo del Banquero.

El simulador incluirá:

- Cinco procesos: P0, P1, P2, P3 y P4.
- Tres tipos de recursos: A, B y C.
- Matrices Allocation, Max y Need.
- Vector Available.
- Verificación de estado seguro.
- Visualización de una secuencia segura.
- Solicitud de recursos por proceso.
- Validación de solicitudes.
- Registro de eventos.
- Botón para reiniciar la simulación.

El objetivo será demostrar cómo el sistema puede analizar una solicitud y decidir si debe concederla o posponerla.

<SimuladorBanquero />

---

## 11. Conclusión

La evitación de interbloqueos permite administrar recursos compartidos mediante la evaluación de las solicitudes antes de concederlas.

Su principio fundamental consiste en mantener el sistema en un estado seguro, donde exista al menos una secuencia que permita finalizar todos los procesos.

El Algoritmo del Banquero utiliza matrices de asignación, demanda máxima y necesidad, junto con el vector de recursos disponibles, para comprobar la seguridad del sistema.

Aunque requiere información anticipada y cálculos adicionales, constituye una herramienta fundamental para estudiar la administración segura de recursos en sistemas operativos.

---