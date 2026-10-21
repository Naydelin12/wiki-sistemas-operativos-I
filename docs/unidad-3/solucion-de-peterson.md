---
sidebar_position: 3
title: Solución de Peterson
---

import SimuladorPeterson from '@site/src/components/SimuladorPeterson';

# Solución de Peterson

## 1. Introducción

En los sistemas operativos, la concurrencia permite que varios procesos o hilos ejecuten operaciones durante períodos de tiempo superpuestos. Sin embargo, cuando comparten recursos, es necesario establecer mecanismos que eviten interferencias y resultados incorrectos.

Una de las soluciones clásicas al problema de la sección crítica es el **algoritmo de Peterson**, un mecanismo de sincronización por software diseñado para coordinar dos procesos.

Este algoritmo utiliza variables compartidas para controlar el acceso a la sección crítica y representa una alternativa conceptualmente más sencilla que el algoritmo de Dekker.

---

## 2. ¿Qué es la Solución de Peterson?

La solución de Peterson es un algoritmo de exclusión mutua para dos procesos que necesitan acceder a una sección crítica compartida.

Fue desarrollado por Gary L. Peterson y publicado en 1981.

Su funcionamiento se basa en dos elementos fundamentales:

- **Indicadores de intención:** permiten identificar qué procesos desean ingresar a la sección crítica.
- **Variable de turno:** ayuda a resolver los conflictos cuando ambos procesos desean ingresar simultáneamente.

El algoritmo busca garantizar tres propiedades:

1. **Exclusión mutua:** solamente un proceso puede ingresar a la sección crítica a la vez.
2. **Progreso:** si la sección crítica está libre, los procesos interesados pueden avanzar sin bloqueos innecesarios.
3. **Espera acotada:** ningún proceso debe ser postergado indefinidamente por el otro.

Estas garantías corresponden al modelo clásico de memoria compartida con operaciones atómicas y ordenadas.

---

## 3. Variables Compartidas

El algoritmo utiliza las siguientes variables:

```text
boolean interes[2] = {false, false};
int turno;
```

### Indicadores de intención

El arreglo `interes` contiene dos posiciones:

- `interes[0]`: indica si P0 desea ingresar.
- `interes[1]`: indica si P1 desea ingresar.

Cuando un proceso desea entrar a la sección crítica, activa su indicador.

Cuando termina, lo desactiva.

### Variable de turno

La variable `turno` permite resolver la competencia entre los procesos.

Cuando un proceso solicita acceso, asigna el turno al otro proceso.

Esto significa que, si ambos están interesados, el último en asignar el turno concede prioridad al otro.

---

## 4. Funcionamiento del Algoritmo

El algoritmo sigue una secuencia de operaciones que permite coordinar el acceso de dos procesos.

### Paso 1. Declarar la intención

El proceso anuncia que desea ingresar:

```text
interes[i] = true;
```

### Paso 2. Ceder la prioridad

El proceso asigna el turno al otro:

```text
turno = j;
```

Donde:

- `i` representa el proceso actual.
- `j` representa el otro proceso.

### Paso 3. Comprobar la condición de espera

El proceso espera mientras el otro esté interesado y tenga prioridad:

```text
while (interes[j] && turno == j) {
    // Esperar
}
```

### Paso 4. Ingresar a la sección crítica

Cuando la condición de espera deja de cumplirse, el proceso puede ingresar a la sección crítica.

### Paso 5. Liberar el acceso

Al finalizar, desactiva su indicador:

```text
interes[i] = false;
```

Esto permite que el otro proceso continúe cuando corresponda.

---

## 5. Pseudocódigo Completo

El siguiente pseudocódigo representa la solución de Peterson para dos procesos.

```text
Variables compartidas:

boolean interes[2] = {false, false};
int turno = 0;


Proceso Pi:

j = 1 - i;

while (true) {

    // Sección de entrada
    interes[i] = true;

    turno = j;

    while (interes[j] && turno == j) {
        // Espera activa
    }

    // Sección crítica
    utilizar_recurso_compartido();

    // Sección de salida
    interes[i] = false;

    // Sección restante
    realizar_otras_operaciones();
}
```

La expresión `j = 1 - i` permite identificar al otro proceso.

Si `i = 0`, entonces `j = 1`.

Si `i = 1`, entonces `j = 0`.

---

## 6. Ejemplo Práctico: Dos Procesos Compartiendo un Archivo

Supongamos que dos procesos necesitan actualizar un archivo que contiene información de inventario.

- **P0:** registra la entrada de productos.
- **P1:** registra la salida de productos.

Ambos necesitan modificar el mismo archivo.

### Situación sin sincronización

Si los procesos modifican simultáneamente la información, uno podría sobrescribir los cambios realizados por el otro.

Esto puede provocar inconsistencias en el inventario.

### Situación utilizando Peterson

1. P0 anuncia que desea ingresar.
2. P1 también anuncia su intención.
3. Ambos actualizan la variable de turno.
4. La condición de espera determina cuál puede avanzar.
5. Uno de los procesos ingresa a la sección crítica.
6. El otro permanece esperando.
7. Cuando el primero termina, desactiva su indicador.
8. El proceso que estaba esperando puede continuar.

De esta manera, las modificaciones se realizan sin accesos simultáneos incompatibles.

---

## 7. Propiedades de la Solución de Peterson

### 7.1 Exclusión Mutua

El algoritmo impide que ambos procesos se encuentren simultáneamente en la sección crítica.

Cuando los dos desean ingresar, la variable `turno` permite que solamente uno supere la condición de espera.

### 7.2 Progreso

Si solamente un proceso desea ingresar, puede hacerlo sin esperar innecesariamente al otro.

Por ejemplo, si P0 está interesado y P1 no lo está, la condición de espera de P0 es falsa.

### 7.3 Espera Acotada

Cuando ambos procesos compiten por ingresar, el algoritmo evita que uno adelante indefinidamente al otro, bajo los supuestos clásicos de ejecución.

Esto proporciona una coordinación adecuada entre los dos procesos.

---

## 8. Espera Activa (Busy Waiting)

Una característica importante del algoritmo de Peterson es que utiliza **espera activa**.

Esto significa que un proceso comprueba repetidamente una condición mientras espera su turno.

```text
while (interes[j] && turno == j) {
    // Esperar
}
```

Durante esta espera, el proceso puede consumir tiempo de CPU sin realizar trabajo útil.

Por esta razón, aunque Peterson es importante desde el punto de vista teórico, los sistemas operativos modernos suelen utilizar mecanismos de sincronización más apropiados para aplicaciones reales.

Entre ellos se encuentran:

- Mutex.
- Semáforos.
- Monitores.
- Operaciones atómicas proporcionadas por el hardware.

---

## 9. Comparación entre Dekker y Peterson

| Característica | Dekker | Peterson |
|---|---|---|
| Número de procesos | Dos | Dos |
| Tipo de solución | Software | Software |
| Variables utilizadas | Indicadores y turno | Indicadores y turno |
| Exclusión mutua | Sí, en el algoritmo completo | Sí |
| Progreso | Sí | Sí |
| Espera acotada | Sí | Sí |
| Complejidad del algoritmo | Mayor | Menor |
| Espera activa | Sí | Sí |

Ambos algoritmos son fundamentales para comprender cómo se puede resolver el problema de la sección crítica mediante variables compartidas.

La solución de Peterson destaca por utilizar una estructura más sencilla.

---

## 10. Limitaciones del Algoritmo

Aunque Peterson representa una solución importante para el estudio de la sincronización, presenta algunas limitaciones.

### Diseñado para dos procesos

Su versión clásica permite coordinar solamente dos procesos.

### Utiliza espera activa

Los procesos pueden consumir tiempo de CPU mientras esperan.

### Depende del modelo de memoria

La demostración clásica supone que las lecturas y escrituras compartidas son atómicas y mantienen el orden requerido.

En arquitecturas modernas, los procesadores y compiladores pueden reordenar operaciones, por lo que una implementación real necesita mecanismos de sincronización y garantías de memoria adecuados.

### No sustituye los mecanismos modernos

En aplicaciones reales suelen preferirse mutex, semáforos y otras primitivas de sincronización proporcionadas por los lenguajes y sistemas operativos.


---

## 11. Simulador Interactivo de Peterson

El siguiente simulador permite observar cómo el algoritmo de Peterson coordina el acceso de dos procesos a una sección crítica mediante indicadores de intención y una variable de turno.

### Instrucciones de uso

1. Presiona **Ejecutar siguiente instrucción** en P0 para activar su indicador de intención.
2. Avanza P1 para que también anuncie su intención.
3. Continúa ejecutando las instrucciones de ambos procesos.
4. Observa cómo cambia la variable `turno`.
5. Comprueba que uno de los procesos debe esperar mientras el otro tiene prioridad.
6. Ejecuta las instrucciones de salida para liberar el recurso.
7. Observa cómo el proceso que estaba esperando puede continuar.

El simulador permite controlar los procesos individualmente para comprender las decisiones del algoritmo.

<SimuladorPeterson />

---

## 12. Importancia en los Sistemas Operativos

La solución de Peterson permite comprender varios principios fundamentales de la concurrencia:

- Coordinación entre procesos.
- Control de recursos compartidos.
- Exclusión mutua.
- Resolución de conflictos de acceso.
- Espera activa.
- Importancia de las variables compartidas.

Su estudio facilita la comprensión de mecanismos más avanzados de sincronización y permite analizar las propiedades que debe cumplir una solución correcta al problema de la sección crítica.

---

## 13. Conclusión

La solución de Peterson constituye uno de los algoritmos clásicos más importantes para comprender la sincronización entre dos procesos.

Mediante indicadores de intención y una variable de turno, permite controlar el acceso a una sección crítica y satisfacer las propiedades de exclusión mutua, progreso y espera acotada bajo sus supuestos clásicos.

Aunque no suele utilizarse directamente como mecanismo de sincronización en aplicaciones modernas, representa una herramienta educativa fundamental para comprender el funcionamiento de la concurrencia en los sistemas operativos.

---