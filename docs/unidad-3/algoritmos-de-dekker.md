---
sidebar_position: 2
title: Algoritmos de Dekker
---

import SimuladorDekker from '@site/src/components/SimuladorDekker';

# Algoritmos de Dekker

## 1. Introducción

En los sistemas operativos, la ejecución concurrente de procesos plantea un problema importante: ¿cómo permitir que varios procesos compartan recursos sin interferir entre sí?

Para responder a esta pregunta surgieron diferentes soluciones de sincronización basadas en software.

Entre las primeras soluciones históricas destaca el **algoritmo de Dekker**, que permite coordinar dos procesos para garantizar que no ingresen simultáneamente a una misma sección crítica.

Su desarrollo se estudia mediante cinco intentos que permiten comprender las dificultades de diseñar mecanismos de exclusión mutua.

---

## 2. ¿Qué es el Algoritmo de Dekker?

El algoritmo de Dekker es una solución de sincronización por software para dos procesos que comparten una sección crítica.

Utiliza variables compartidas para controlar el acceso al recurso, sin depender de instrucciones especiales de bloqueo del hardware.

Su objetivo es satisfacer tres propiedades fundamentales:

- **Exclusión mutua:** impedir el ingreso simultáneo a la sección crítica.
- **Progreso:** permitir que se decida el acceso cuando la sección crítica está libre.
- **Espera acotada:** evitar que un proceso sea postergado indefinidamente.

El algoritmo final utiliza dos elementos:

1. **Indicadores de intención:** permiten conocer si un proceso desea ingresar.
2. **Variable de turno:** permite resolver situaciones en las que ambos procesos desean ingresar simultáneamente.

---

## 3. Primer Intento: Alternancia Estricta

La primera propuesta utiliza una variable compartida llamada `turno`.

Esta variable indica qué proceso tiene permitido ingresar a la sección crítica.

### Pseudocódigo

```text
Variable compartida:
turno = 0

Proceso P0:
while (true) {
    while (turno != 0) {
        // Esperar
    }

    // Sección crítica

    turno = 1;

    // Sección restante
}

Proceso P1:
while (true) {
    while (turno != 1) {
        // Esperar
    }

    // Sección crítica

    turno = 0;

    // Sección restante
}
```

### Funcionamiento

1. Inicialmente, el turno pertenece a P0.
2. P0 ingresa a su sección crítica.
3. Al terminar, asigna el turno a P1.
4. P1 puede ingresar cuando lo necesite.
5. Al salir, devuelve el turno a P0.

### Problema

Aunque garantiza exclusión mutua, **no satisface la propiedad de progreso**.

Si P0 no desea ingresar nuevamente, P1 puede quedar esperando a que P0 le ceda el turno, aunque la sección crítica esté libre.

Por tanto, la alternancia estricta obliga a respetar turnos incluso cuando uno de los procesos no necesita utilizar el recurso.

---

## 4. Segundo Intento: Indicadores de Ocupación

Para superar la alternancia estricta, se propone utilizar indicadores que representen si cada proceso desea utilizar la sección crítica.

Cada proceso consulta el indicador del otro antes de ingresar.

### Pseudocódigo

```text
Variables compartidas:
interes[0] = false
interes[1] = false

Proceso Pi:
j = 1 - i

while (true) {
    while (interes[j]) {
        // Esperar
    }

    interes[i] = true;

    // Sección crítica

    interes[i] = false;

    // Sección restante
}
```

### Funcionamiento

Cada proceso verifica primero si el otro está interesado.

Si el indicador del otro proceso está desactivado, activa su propio indicador e ingresa.

### Problema

Esta solución presenta una **condición de carrera**.

Supongamos que:

1. P0 comprueba que P1 no está interesado.
2. Antes de que P0 active su indicador, P1 también comprueba que P0 no está interesado.
3. Ambos activan sus indicadores.
4. Los dos ingresan a la sección crítica.

Por tanto, este intento **no garantiza exclusión mutua**.

---

## 5. Tercer Intento: Declarar la Intención Primero

Para evitar el problema anterior, cada proceso activa su indicador antes de comprobar si el otro desea ingresar.

### Pseudocódigo

```text
Variables compartidas:
interes[0] = false
interes[1] = false

Proceso Pi:
j = 1 - i

while (true) {
    interes[i] = true;

    while (interes[j]) {
        // Esperar
    }

    // Sección crítica

    interes[i] = false;

    // Sección restante
}
```

### Funcionamiento

1. El proceso anuncia su intención de ingresar.
2. Comprueba si el otro proceso también desea ingresar.
3. Si el otro está interesado, espera.
4. Cuando el otro libera su indicador, puede continuar.

### Problema

Si ambos procesos activan sus indicadores simultáneamente, cada uno observará que el otro desea ingresar.

En consecuencia, los dos pueden quedar esperando indefinidamente.

Esta situación constituye un **bloqueo mutuo**.

Aunque se conserva la exclusión mutua, no se garantiza el progreso.

---

## 6. Cuarto Intento: Retirar Temporalmente la Intención

El cuarto intento modifica la solución anterior.

Cuando un proceso detecta que el otro también está interesado, retira temporalmente su indicador para permitir que el otro avance.

### Pseudocódigo

```text
Variables compartidas:
interes[0] = false
interes[1] = false

Proceso Pi:
j = 1 - i

while (true) {
    interes[i] = true;

    while (interes[j]) {
        interes[i] = false;

        // Esperar un momento

        interes[i] = true;
    }

    // Sección crítica

    interes[i] = false;

    // Sección restante
}
```

### Funcionamiento

Cada proceso declara su intención de ingresar.

Si detecta que el otro proceso también está interesado, retira temporalmente su solicitud y vuelve a intentarlo.

### Problema

Los dos procesos pueden retirar y activar sus indicadores repetidamente al mismo tiempo.

Aunque ambos continúan ejecutando instrucciones, ninguno consigue ingresar a la sección crítica.

Esta situación se conoce como **livelock o bloqueo activo**.

A diferencia del bloqueo mutuo anterior, los procesos siguen realizando acciones, pero no logran avanzar.

---

## 7. Quinto Intento: Algoritmo de Dekker Completo

El quinto intento combina los indicadores de intención con una variable de turno.

De esta manera, cuando ambos procesos desean ingresar, el turno determina cuál tiene prioridad.

### Variables compartidas

```text
interes[0] = false
interes[1] = false
turno = 0
```

### Pseudocódigo

```text
Proceso Pi:
j = 1 - i

while (true) {

    interes[i] = true;

    while (interes[j]) {

        if (turno == j) {

            interes[i] = false;

            while (turno == j) {
                // Esperar
            }

            interes[i] = true;
        }
    }

    // Sección crítica

    turno = j;
    interes[i] = false;

    // Sección restante
}
```

### Funcionamiento paso a paso

1. El proceso Pi activa su indicador de intención.
2. Comprueba si el otro proceso también desea ingresar.
3. Si el otro no está interesado, ingresa directamente.
4. Si ambos están interesados, consulta la variable `turno`.
5. El proceso que no tiene prioridad retira temporalmente su intención.
6. El proceso con prioridad puede ingresar.
7. Al salir, cede el turno al otro proceso y desactiva su indicador.

### Ventajas

Bajo el modelo clásico de memoria compartida con lecturas y escrituras atómicas y ordenadas, el algoritmo completo:

- Garantiza exclusión mutua.
- Satisface la propiedad de progreso.
- Proporciona espera acotada.
- Evita el bloqueo mutuo de los intentos anteriores.

**Importante:** En procesadores y lenguajes modernos, una implementación real necesita considerar las reglas del modelo de memoria y la sincronización de los accesos compartidos.

---

## 8. Comparación de los Cinco Intentos

| Intento | Mecanismo principal | Problema identificado |
|---|---|---|
| Primero | Alternancia estricta mediante turnos | Viola el progreso |
| Segundo | Comprobación previa de indicadores | Condición de carrera |
| Tercero | Declaración previa de intención | Bloqueo mutuo |
| Cuarto | Retirada temporal de intención | Bloqueo activo (livelock) |
| Quinto | Indicadores de intención y turno | Resuelve el problema bajo sus supuestos clásicos |

---

## 9. Visualizador Interactivo de los Algoritmos de Dekker

El siguiente visualizador permite explorar los cinco intentos de Dekker y comprender los problemas de sincronización que aparecen durante su desarrollo.

### Instrucciones de uso

1. Selecciona uno de los cinco intentos disponibles.
2. Observa el estado inicial de los procesos P0 y P1.
3. Presiona **Siguiente paso** para avanzar en la ejecución.
4. Examina cómo cambian las variables compartidas.
5. Identifica qué sucede cuando los procesos intentan ingresar a la sección crítica.
6. Al finalizar, revisa la explicación del resultado.
7. Utiliza **Reiniciar** para repetir la secuencia o selecciona otro intento.

El visualizador presenta escenarios representativos de cada algoritmo para facilitar la comprensión de sus ventajas y limitaciones.

<SimuladorDekker />

---

## 10. Importancia del Algoritmo de Dekker

El algoritmo de Dekker representa un avance fundamental en el estudio de la concurrencia.

Su importancia radica en demostrar que es posible coordinar dos procesos mediante variables compartidas y reglas de acceso cuidadosamente diseñadas.

También permite comprender por qué algunas soluciones aparentemente correctas presentan problemas como:

- Condiciones de carrera.
- Violaciones de exclusión mutua.
- Bloqueos mutuos.
- Bloqueos activos.
- Esperas innecesarias.

El estudio de estos intentos facilita la comprensión de otros mecanismos de sincronización, especialmente la **solución de Peterson**, los semáforos y los monitores.

---

## 11. Conclusión

El desarrollo de los algoritmos de Dekker demuestra que resolver el problema de la sección crítica requiere más que impedir el acceso simultáneo de los procesos.

También es necesario garantizar que los procesos puedan avanzar y que ninguno permanezca esperando indefinidamente.

Los primeros cuatro intentos permiten identificar errores comunes en el diseño de mecanismos de sincronización, mientras que el quinto presenta una solución que satisface las propiedades fundamentales del problema clásico.

Este algoritmo constituye una base conceptual importante para comprender los mecanismos de sincronización empleados en los sistemas operativos.

---