# Motor de Transacciones Concurrentes

El **Motor de Transacciones Concurrentes** es un laboratorio interactivo desarrollado para estudiar cómo se comportan varios procesos cuando ejecutan operaciones al mismo tiempo. Permite observar situaciones relacionadas con las transacciones concurrentes, las condiciones de carrera, la sincronización, los interbloqueos (*deadlocks*) y los mecanismos de recuperación.

A través de su interfaz web, es posible ejecutar diferentes pruebas y observar el estado de las cuentas, los procesos involucrados y los eventos que se producen durante cada demostración.

## Objetivo

Comprender, mediante pruebas prácticas, los problemas que pueden surgir cuando varios procesos comparten recursos y ejecutan operaciones concurrentemente. Además, se busca analizar cómo la sincronización permite controlar el acceso a los recursos y cómo se puede detectar y resolver un interbloqueo.

## Conceptos fundamentales

### Concurrencia

La concurrencia ocurre cuando varias tareas avanzan durante un mismo intervalo de tiempo. Sus operaciones pueden intercalarse y, dependiendo de la implementación, ejecutarse en paralelo.

Cuando varias tareas acceden a datos compartidos, es necesario controlar cómo y cuándo pueden modificarlos para evitar resultados incorrectos.

### Condición de carrera

Una condición de carrera (*race condition*) ocurre cuando el resultado de una operación depende del orden o del momento en que se ejecutan varias tareas concurrentes.

Por ejemplo, dos procesos pueden leer el mismo valor de una variable, calcular un nuevo resultado y escribirlo casi al mismo tiempo. Si no existe una protección adecuada, una actualización puede sobrescribir la otra y provocar la pérdida de cambios.

### Sincronización

La sincronización coordina el acceso de los procesos a los recursos compartidos. Su finalidad es evitar interferencias entre operaciones que no deberían ejecutarse simultáneamente.

En el laboratorio se compara una ejecución sin protección con otra que utiliza un mecanismo de sincronización, para observar las diferencias entre ambos comportamientos.

### Interbloqueo o deadlock

Un interbloqueo ocurre cuando dos o más procesos quedan bloqueados porque cada uno espera un recurso que otro proceso mantiene ocupado.

En estas condiciones, los procesos involucrados no pueden continuar con sus operaciones mientras se mantenga la situación de espera.

Entre las condiciones clásicas asociadas a un interbloqueo se encuentran:

- **Exclusión mutua:** un recurso solo puede ser utilizado por un proceso a la vez.
- **Retención y espera:** un proceso conserva un recurso mientras espera otro.
- **Ausencia de expropiación:** los recursos no se retiran por la fuerza al proceso que los posee.
- **Espera circular:** existe una cadena de procesos en la que cada uno espera un recurso retenido por el siguiente.

### Grafo de asignación de recursos (RAG)

El grafo de asignación de recursos (*Resource Allocation Graph*, RAG) representa las relaciones entre los procesos y los recursos que utilizan o solicitan.

En el grafo:

- Los procesos representan las tareas que se ejecutan.
- Los recursos representan los elementos que pueden ser utilizados por los procesos.
- Una arista de asignación indica que un proceso posee un recurso.
- Una arista de solicitud indica que un proceso está esperando un recurso.

Cuando los recursos tienen una sola instancia, la presencia de un ciclo en el grafo indica un interbloqueo. Si existen varias instancias de un recurso, un ciclo por sí solo no siempre demuestra que exista un interbloqueo.

## Arquitectura y conexión

El proyecto está compuesto por dos partes principales:

**Interfaz web**

Es la parte con la que interactúa el usuario. Permite iniciar las pruebas, consultar los saldos de las cuentas, observar el estado del motor y revisar los eventos de las operaciones.

**Backend**

Es el componente encargado de procesar las solicitudes de la interfaz y ejecutar las operaciones del motor. Está desarrollado con Node.js y Express, y utiliza trabajadores (*Worker Threads*) en las operaciones que requieren ejecución concurrente.

La comunicación entre ambos componentes se realiza mediante solicitudes HTTP a los endpoints de la API. La interfaz consulta y muestra la información que devuelve el backend.

El proyecto está publicado para permitir el acceso al laboratorio sin necesidad de iniciar manualmente el servidor en el equipo del usuario. La ejecución local puede utilizarse durante el desarrollo y las pruebas técnicas.

## Pruebas del motor

El laboratorio dispone de cinco pruebas principales. Para ejecutarlas, abre la interfaz y selecciona la operación que deseas observar.

### 01. Transferencias concurrentes

**Objetivo:** observar la ejecución simultánea de dos transferencias entre las cuentas A y B.

La prueba ejecuta las transacciones T1 y T2 de forma concurrente. Cada operación modifica los saldos de las cuentas involucradas.

Esta prueba permite estudiar la importancia de coordinar las operaciones que acceden a datos compartidos y comprobar cómo evoluciona el estado de las cuentas durante la ejecución.

**Qué observar:**

- Los saldos actuales de las cuentas A y B.
- Las transacciones que se ejecutan.
- Los eventos registrados durante la operación.
- El estado final informado por el motor.

### 02. Condición de carrera

**Objetivo:** observar el efecto de actualizar datos compartidos sin la sincronización necesaria.

En esta prueba se ejecutan operaciones concurrentes que modifican un valor compartido sin la protección utilizada en la prueba siguiente.

Cuando varias operaciones leen y escriben un mismo valor sin coordinación, algunas actualizaciones pueden perderse. El resultado permite estudiar la diferencia entre el número de operaciones intentadas y el valor que finalmente queda registrado.

**Qué observar:**

- La cantidad de operaciones ejecutadas que informa el motor.
- El resultado final de la prueba.
- Las posibles diferencias entre el resultado esperado y el obtenido.

### 03. Carrera protegida

**Objetivo:** comparar el comportamiento de una operación concurrente con sincronización.

Esta prueba utiliza un mecanismo de protección para coordinar las modificaciones de los datos compartidos. De esta manera, se busca evitar que varias operaciones interfieran entre sí durante la actualización del valor.

Al compararla con la condición de carrera, se puede comprender por qué la sincronización es importante cuando varios procesos acceden a un mismo recurso.

**Qué observar:**

- El resultado final informado por el motor.
- La cantidad de operaciones completadas.
- Las diferencias con la prueba sin sincronización.

### 04. Provocar deadlock

**Objetivo:** generar intencionalmente una situación de espera circular entre los procesos T1 y T2.

Durante esta demostración, los procesos solicitan recursos en un orden que puede provocar un interbloqueo. La situación se analiza mediante las relaciones de asignación y solicitud representadas en el RAG.

El propósito es observar cómo los procesos pueden quedar esperando recursos que no están disponibles porque permanecen en poder de otros procesos.

**Qué observar:**

- El estado del motor durante la demostración.
- Los recursos que posee y solicita cada proceso.
- Las relaciones de espera representadas en el RAG.
- Los eventos asociados a la detección del interbloqueo.

### 05. Resolver deadlock

**Objetivo:** observar el mecanismo de recuperación utilizado para finalizar la demostración del interbloqueo.

Una vez generada la situación de espera circular, el motor puede ejecutar el procedimiento de recuperación. Este proceso contempla la cancelación de un trabajador seleccionado como víctima y las acciones necesarias para liberar los recursos y permitir que la demostración finalice.

La recuperación también debe actualizar el estado de la sesión y reflejar los cambios correspondientes en la interfaz.

**Qué observar:**

- La selección del proceso que se cancelará.
- Los eventos de recuperación registrados.
- La liberación de los recursos involucrados.
- El estado final informado por el motor.

La recuperación y la detección son etapas distintas: detectar un ciclo permite identificar la situación, mientras que resolverla requiere aplicar un mecanismo que permita salir del interbloqueo.

## Reiniciar el motor

El botón **Reiniciar estado del motor** permite restablecer el estado de la demostración para iniciar nuevas pruebas.

El procedimiento contempla la finalización de los trabajadores asociados a una sesión anterior de deadlock, la limpieza de su monitor y la restauración de los datos del motor.

Después del reinicio, se puede volver a ejecutar la demostración de interbloqueo y probar nuevamente el mecanismo de recuperación.

El reinicio es importante para que una sesión anterior no impida iniciar una nueva demostración.

## Interfaz y monitor de eventos

La interfaz permite consultar diferentes elementos del funcionamiento del motor:

- **Estado del motor:** muestra el estado general informado por el backend.
- **Cuentas A y B:** presentan los saldos actuales.
- **Pruebas del motor:** permiten ejecutar las cinco operaciones disponibles.
- **Grafo RAG:** permite observar las relaciones entre procesos y recursos cuando el backend las registra.
- **Monitor de eventos:** presenta los eventos producidos durante las operaciones y las demostraciones.

El monitor de eventos facilita el seguimiento de las operaciones y ayuda a relacionar los resultados observados con los conceptos teóricos de concurrencia, sincronización e interbloqueos.

## Acceso al laboratorio

Utiliza el siguiente enlace para abrir el motor y realizar las pruebas desde la interfaz web publicada.

<div className="motorButtonContainer">
  <a className="motorButton" href="/wiki-sistemas-operativos-I/motor-transacciones/">
    Abrir Motor de Transacciones Concurrentes <span>→</span>
  </a>
</div>

## Conclusión

El Motor de Transacciones Concurrentes permite estudiar de manera práctica los efectos de ejecutar operaciones simultáneas sobre recursos compartidos. Las pruebas ayudan a diferenciar una condición de carrera de una ejecución protegida mediante sincronización y muestran cómo puede producirse un interbloqueo cuando varios procesos esperan recursos entre sí.

Asimismo, la representación mediante el RAG y la observación de los eventos permiten comprender las etapas de detección y recuperación. En conjunto, el laboratorio complementa la teoría de Sistemas Operativos 1 mediante la ejecución y observación de situaciones de concurrencia.
