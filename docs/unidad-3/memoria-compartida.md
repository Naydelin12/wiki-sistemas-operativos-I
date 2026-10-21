---
sidebar_position: 7
title: Memoria Compartida
---

import SimuladorMemoriaCompartida from '@site/src/components/SimuladorMemoriaCompartida';

# Memoria Compartida

## 1. Introducción

En los sistemas operativos modernos, varios procesos pueden necesitar intercambiar información y colaborar para realizar diferentes tareas.

Una de las técnicas utilizadas para permitir esta comunicación es la **memoria compartida**, también conocida como *Shared Memory*.

Este mecanismo permite que dos o más procesos accedan a una misma región de memoria, facilitando el intercambio de información sin necesidad de enviar mensajes individuales por cada operación.

Sin embargo, cuando varios procesos modifican los mismos datos simultáneamente, pueden producirse problemas de concurrencia, como las condiciones de carrera.

Por esta razón, la memoria compartida suele utilizarse junto con mecanismos de sincronización.

---

## 2. ¿Qué es la Memoria Compartida?

La **memoria compartida** es un mecanismo de comunicación entre procesos (IPC, Inter-Process Communication) que permite que varios procesos accedan a una región común de memoria.

Normalmente, cada proceso posee su propio espacio de direcciones virtuales.

Mediante los servicios del sistema operativo, una región de memoria puede mapearse en los espacios de direcciones de varios procesos.

De esta manera, los procesos pueden leer y modificar información compartida.

### Ejemplo práctico

Supongamos que dos procesos administran el inventario de una tienda.

- P1 registra la entrada de productos.
- P2 registra la salida de productos.
- Ambos necesitan consultar y actualizar la cantidad disponible.

En lugar de intercambiar mensajes constantemente, pueden utilizar una variable almacenada en memoria compartida.

```text
MEMORIA COMPARTIDA

       +------------------+
       |   Inventario     |
       |   Stock = 100    |
       +------------------+
          ^           ^
          |           |
       Proceso P1  Proceso P2
```

Ambos procesos pueden acceder al mismo valor de inventario.

---

## 3. Funcionamiento de la Memoria Compartida

El funcionamiento general comprende las siguientes etapas:

1. Un proceso solicita la creación de una región de memoria compartida.
2. El sistema operativo crea o habilita la región.
3. Los procesos autorizados establecen una asociación con esa memoria.
4. Los procesos realizan operaciones de lectura y escritura.
5. Los mecanismos de sincronización coordinan el acceso cuando es necesario.
6. Cuando termina su utilización, los procesos liberan sus asociaciones con la región.
7. El sistema operativo puede eliminar el objeto de memoria compartida cuando corresponde.

### Representación

```text
+----------------+       +----------------+
|   Proceso P1   |       |   Proceso P2   |
|                |       |                |
| Leer / Escribir|       | Leer / Escribir|
+-------+--------+       +--------+-------+
        |                         |
        v                         v
+-----------------------------------------+
|           MEMORIA COMPARTIDA            |
|                                         |
|            Contador = 10                |
|                                         |
+-----------------------------------------+
```

Una modificación realizada por un proceso puede ser observada por otro proceso que tenga acceso a la misma región, respetando las reglas de sincronización y visibilidad de memoria correspondientes.

---

## 4. Características Principales

La memoria compartida presenta las siguientes características:

### Acceso común

Varios procesos pueden acceder a los mismos datos mediante una región compartida.

### Comunicación eficiente

Después de establecer la región compartida, los procesos pueden intercambiar información sin utilizar una operación de envío de mensajes para cada acceso.

### Lectura y escritura

Los procesos pueden consultar y modificar los datos, siempre que cuenten con los permisos correspondientes.

### Sincronización necesaria

Cuando existen accesos concurrentes que pueden entrar en conflicto, es necesario utilizar mecanismos de sincronización.

### Administración del sistema operativo

El sistema operativo participa en la creación, configuración de permisos y administración de la memoria compartida.

### Independencia de los procesos

Los procesos mantienen sus propios espacios de direcciones, aunque compartan determinadas regiones de memoria.

---

## 5. Operaciones Básicas

Los procesos pueden realizar diferentes operaciones sobre una región de memoria compartida.

### 5.1 Crear

Consiste en solicitar al sistema operativo una región de memoria que pueda compartirse.

### 5.2 Asociar

El proceso establece una asociación entre la región compartida y su espacio de direcciones.

### 5.3 Leer

Permite consultar información almacenada en la región compartida.

Ejemplo:

```text
valor = memoria.contador
```

### 5.4 Escribir

Permite modificar los datos compartidos.

Ejemplo:

```text
memoria.contador = 20
```

### 5.5 Desasociar

El proceso deja de utilizar la región compartida y elimina su asociación local.

### 5.6 Eliminar

El objeto de memoria compartida se elimina cuando corresponde, de acuerdo con el mecanismo utilizado y su ciclo de vida.

---

## 6. Ejemplo Práctico: Contador Compartido

Supongamos que dos procesos utilizan una variable compartida:

```text
contador = 10
```

Ambos procesos necesitan incrementar su valor.

La operación lógica es:

```text
contador = contador + 1
```

Aunque parece una sola instrucción, conceptualmente puede dividirse en tres pasos:

1. Leer el valor actual.
2. Incrementar el valor leído.
3. Escribir el resultado.

### Ejecución secuencial

Si P1 termina antes de que P2 comience:

```text
Valor inicial: 10

P1 lee 10
P1 incrementa a 11
P1 escribe 11

P2 lee 11
P2 incrementa a 12
P2 escribe 12

Resultado final: 12
```

El resultado es correcto porque las operaciones no se interfieren.

### Ejecución concurrente

Cuando los procesos intercalan sus instrucciones, el resultado puede ser diferente.

```text
Valor inicial: 10

P1 lee 10
P2 lee 10

P1 incrementa a 11
P2 incrementa a 11

P1 escribe 11
P2 escribe 11

Resultado final: 11
```

Aunque ambos procesos realizaron un incremento, el resultado final es 11 en lugar de 12.

Esto representa una **actualización perdida** causada por una condición de carrera.

---

## 7. Condiciones de Carrera

Una **condición de carrera** (*Race Condition*) ocurre cuando el resultado de una operación depende del orden o del momento en que se ejecutan las instrucciones de diferentes procesos o hilos.

En memoria compartida, puede presentarse cuando varios procesos acceden concurrentemente a datos comunes y al menos uno realiza modificaciones sin una coordinación adecuada.

### Ejemplo

Dos procesos intentan actualizar el mismo contador.

| Paso | Proceso P1 | Proceso P2 | Memoria |
|---|---|---|---|
| 1 | Lee 10 | — | 10 |
| 2 | — | Lee 10 | 10 |
| 3 | Calcula 11 | — | 10 |
| 4 | — | Calcula 11 | 10 |
| 5 | Escribe 11 | — | 11 |
| 6 | — | Escribe 11 | 11 |

**Resultado esperado:** 12.

**Resultado obtenido:** 11.

El problema aparece porque ambos procesos utilizaron el mismo valor inicial.

---

## 8. Sección Crítica en Memoria Compartida

Una **sección crítica** es una parte del programa que accede a recursos compartidos y requiere protección frente a accesos concurrentes que puedan causar interferencias.

Cuando dos procesos modifican una variable compartida, puede ser necesario garantizar que solamente uno ejecute la operación de actualización a la vez.

### Ejemplo sin protección

```text
Proceso P1:
    contador = contador + 1

Proceso P2:
    contador = contador + 1
```

Si las instrucciones se intercalan, puede perderse una actualización.

### Ejemplo con protección

```text
Proceso P1:
    adquirir(mutex)
    contador = contador + 1
    liberar(mutex)

Proceso P2:
    adquirir(mutex)
    contador = contador + 1
    liberar(mutex)
```

El mutex permite que solamente uno de los procesos ejecute la sección crítica protegida en cada momento.

De esta manera, se evita que ambos modifiquen simultáneamente el contador mediante esa sección.

---

## 9. Mecanismos de Sincronización

Existen diferentes mecanismos para coordinar el acceso a memoria compartida.

### 9.1 Mutex

Un mutex es un mecanismo de exclusión mutua que permite proteger una sección crítica.

Un proceso adquiere el mutex antes de modificar el recurso y lo libera al terminar.

### 9.2 Semáforos

Los semáforos permiten controlar el acceso a recursos compartidos mediante operaciones como `wait()` y `signal()`.

Pueden utilizarse para coordinar procesos y limitar la cantidad de accesos simultáneos.

### 9.3 Monitores

Los monitores agrupan datos compartidos y operaciones protegidas mediante mecanismos de exclusión mutua.

También pueden incorporar variables de condición para coordinar la espera de procesos.

### 9.4 Operaciones Atómicas

Las operaciones atómicas se ejecutan de manera indivisible desde el punto de vista de otros participantes concurrentes.

Por ejemplo, una operación de incremento atómico puede actualizar un contador sin permitir que otra operación observe una actualización parcial.

### 9.5 Algoritmos de Exclusión Mutua

Existen soluciones clásicas, como los algoritmos de Peterson y Dekker, que permiten estudiar cómo coordinar procesos mediante variables compartidas.

Estos algoritmos son importantes para comprender los fundamentos de la sincronización.

---

## 10. Memoria Compartida en Sistemas Operativos

Los sistemas operativos ofrecen diferentes mecanismos para implementar memoria compartida.

### 10.1 Linux y Sistemas UNIX

En sistemas Linux y UNIX pueden utilizarse mecanismos como:

- Memoria compartida POSIX.
- Memoria compartida System V.
- Regiones compartidas mediante `mmap()`.

Estos mecanismos permiten que procesos independientes accedan a regiones de memoria comunes.

### 10.2 Windows

Windows ofrece mecanismos de memoria compartida mediante objetos de mapeo de archivos (*File Mapping Objects*).

Los procesos pueden crear o abrir objetos de mapeo y acceder a vistas compartidas de memoria.

### 10.3 Memoria Compartida entre Hilos

Los hilos de un mismo proceso comparten normalmente el espacio de direcciones del proceso.

Por ello, pueden acceder a variables y estructuras de datos comunes.

Sin embargo, compartir memoria entre hilos no es exactamente lo mismo que establecer memoria compartida entre procesos independientes.

---

## 11. Memoria Compartida y Paso de Mensajes

Ambos mecanismos permiten la comunicación entre procesos, pero utilizan enfoques diferentes.

| Característica | Memoria Compartida | Paso de Mensajes |
|---|---|---|
| Comunicación | Acceso a datos comunes | Envío y recepción |
| Intercambio | Lectura y escritura | `send()` y `receive()` |
| Región común | Sí | No es necesaria para los procesos participantes |
| Sincronización | Generalmente explícita para accesos conflictivos | Puede integrarse en las operaciones |
| Rendimiento | Puede evitar copias adicionales | Puede requerir transferencia o copias |
| Sistemas distribuidos | Necesita mecanismos adicionales | Se adapta a la comunicación entre máquinas |
| Ejemplo | Contador compartido | Cola de mensajes |

La elección depende de las características del sistema y de las necesidades de comunicación.

---

## 12. Ventajas de la Memoria Compartida

### Comunicación rápida

Permite acceder a datos comunes sin realizar operaciones de mensajería para cada lectura o escritura.

### Intercambio eficiente

Puede reducir la necesidad de copiar grandes cantidades de información entre procesos.

### Colaboración entre procesos

Facilita que diferentes procesos trabajen sobre estructuras de datos comunes.

### Flexibilidad

Puede utilizarse para compartir contadores, búferes, tablas y otras estructuras.

### Aplicaciones de alto rendimiento

Resulta útil en aplicaciones que necesitan intercambiar información frecuentemente.

---

## 13. Desventajas de la Memoria Compartida

### Condiciones de carrera

Pueden producirse cuando varios procesos modifican información compartida sin sincronización adecuada.

### Mayor complejidad

Los desarrolladores deben controlar cuidadosamente el acceso concurrente.

### Interbloqueos

El uso incorrecto de mecanismos de sincronización puede provocar interbloqueos.

### Inconsistencia de datos

Las operaciones concurrentes pueden generar resultados incorrectos cuando no están protegidas.

### Problemas de seguridad

Es necesario administrar permisos para impedir accesos no autorizados.

### Errores difíciles de reproducir

Algunos problemas dependen del orden de ejecución y pueden manifestarse de forma intermitente.

---

## 14. Aplicaciones de la Memoria Compartida

La memoria compartida se utiliza en diferentes entornos.

### Sistemas de bases de datos

Puede emplearse para compartir estructuras internas, cachés y datos de coordinación entre procesos.

### Aplicaciones multimedia

Permite intercambiar imágenes, audio o video entre componentes.

### Sistemas de procesamiento paralelo

Facilita que varios participantes trabajen sobre estructuras de datos comunes.

### Servidores

Puede utilizarse para compartir información entre procesos trabajadores.

### Sistemas de monitoreo

Permite que diferentes procesos consulten datos actualizados.

### Aplicaciones concurrentes

Se utiliza para implementar estructuras y mecanismos de coordinación entre tareas.

---

## 15. Importancia de la Memoria Compartida

El estudio de la memoria compartida permite comprender cómo diferentes procesos pueden acceder a una región común de memoria.

También permite analizar los riesgos asociados al acceso concurrente.

Entre los conceptos fundamentales se encuentran:

- Comunicación entre procesos.
- Regiones de memoria compartida.
- Operaciones de lectura y escritura.
- Condiciones de carrera.
- Secciones críticas.
- Exclusión mutua.
- Sincronización mediante mutex y semáforos.
- Operaciones atómicas.
- Consistencia de datos.

Estos conocimientos son importantes para el diseño de sistemas operativos y aplicaciones concurrentes.

---

## 16. Simulador Interactivo de Memoria Compartida

Este simulador permite observar cómo dos procesos acceden
a una región de memoria compartida.

Se pueden comparar dos escenarios:

- **Sin sincronización:** los procesos pueden acceder
  al contador sin protección, provocando condiciones
  de carrera.

- **Con sincronización:** se utiliza un mutex para
  coordinar el acceso y evitar actualizaciones perdidas.

El objetivo es comprender la importancia de proteger
los datos compartidos en sistemas concurrentes.

<SimuladorMemoriaCompartida />

---

## 17. Conclusión

La memoria compartida es un mecanismo de comunicación que permite que varios procesos accedan a una misma región de memoria.

Su principal ventaja es facilitar el intercambio eficiente de información mediante operaciones de lectura y escritura.

Sin embargo, cuando varios procesos modifican datos compartidos sin sincronización adecuada, pueden producirse condiciones de carrera y resultados incorrectos.

Por esta razón, mecanismos como mutex, semáforos, monitores y operaciones atómicas son fundamentales para proteger los recursos compartidos.

Comprender la memoria compartida permite analizar cómo los sistemas operativos coordinan procesos y mantienen la integridad de la información.

---