---

sidebar_position: 1
title: Motor de Transacciones Concurrentes
------------------------------------------

# Motor de Transacciones Concurrentes

El **Motor de Transacciones Concurrentes** es un proyecto práctico desarrollado para demostrar el comportamiento de varias transacciones que se ejecutan de manera simultánea y los problemas que pueden surgir cuando diferentes hilos comparten recursos.

El proyecto permite observar de forma interactiva conceptos fundamentales de los sistemas operativos relacionados con la concurrencia, como las condiciones de carrera, la sincronización, los interbloqueos (*deadlocks*), la detección mediante un **Grafo de Asignación de Recursos (RAG)** y los mecanismos de recuperación.

## Objetivo

El objetivo del motor es representar situaciones de concurrencia mediante transacciones que trabajan de manera simultánea sobre recursos compartidos.

A través de diferentes pruebas se puede observar la diferencia entre una ejecución sin protección y una ejecución sincronizada, además de provocar intencionalmente un interbloqueo para posteriormente detectarlo y resolverlo.

## Conceptos implementados

### Concurrencia

La concurrencia permite que varias tareas progresen de manera simultánea. En este proyecto se utilizan diferentes hilos para representar transacciones que realizan operaciones al mismo tiempo.

### Condición de carrera

Una condición de carrera ocurre cuando varios hilos acceden y modifican un recurso compartido sin una sincronización adecuada. Como consecuencia, algunas actualizaciones pueden perderse.

El motor permite observar este comportamiento mediante una prueba específica de carrera.

### Sincronización

La sincronización permite controlar el acceso de los hilos a los recursos compartidos. En la prueba de carrera protegida se utiliza un mecanismo de protección para evitar que las operaciones se interfieran entre sí.

### Interbloqueo (Deadlock)

Un interbloqueo ocurre cuando dos o más procesos quedan esperando recursos que están siendo retenidos por otros procesos del mismo conjunto.

En el motor se provoca intencionalmente esta situación para demostrar cómo puede detectarse y posteriormente resolverse.

### Grafo de Asignación de Recursos (RAG)

El **RAG (Resource Allocation Graph)** representa gráficamente la relación entre procesos y recursos.

Los procesos pueden mantener recursos o solicitar recursos que actualmente están ocupados. Cuando estas relaciones forman un ciclo, puede existir un interbloqueo.

En la interfaz, el RAG permite visualizar las relaciones entre **T1**, **T2**, **A** y **B** durante la prueba de deadlock.

## Pruebas del motor

La interfaz proporciona cinco pruebas principales.

### 01 — Transferencias

Esta prueba ejecuta dos transferencias simultáneas entre las cuentas **A** y **B**.

Permite observar cómo el motor procesa operaciones concurrentes sobre recursos compartidos y muestra el resultado final de las cuentas.

### 02 — Condición de carrera

Esta prueba ejecuta dos trabajadores que realizan operaciones concurrentes sin protección.

El objetivo es demostrar que, cuando varias operaciones modifican un recurso compartido al mismo tiempo, pueden producirse actualizaciones perdidas.

La prueba utiliza **200,000 operaciones esperadas**. El resultado puede ser menor debido a la condición de carrera.

### 03 — Carrera protegida

Esta prueba repite el escenario de operaciones concurrentes utilizando sincronización.

El objetivo es comprobar que la protección del recurso compartido evita las actualizaciones perdidas.

En una ejecución correcta, las **200,000 operaciones esperadas** deben coincidir con las operaciones obtenidas y las actualizaciones perdidas deben ser **0**.

### 04 — Estancamiento provocador

Esta prueba provoca intencionalmente un **deadlock** entre dos transacciones.

Una transacción mantiene un recurso mientras solicita otro, mientras que la segunda mantiene el otro recurso y solicita el primero. Como ambas quedan esperando, se produce el interbloqueo.

El motor utiliza el RAG para representar estas relaciones y detectar el ciclo correspondiente.

Cuando el interbloqueo es identificado, el estado del motor cambia a:

`DEADLOCK_DETECTADO`

### 05 — Bloqueo del resolver

Esta prueba permite recuperar el sistema después de detectar el deadlock.

El motor selecciona una transacción como víctima, la cancela y libera los recursos que mantenía. Esto permite que la transacción restante pueda continuar.

Durante la recuperación, el monitor de eventos registra acciones como:

* **POSEE**
* **SOLICITA**
* **ESPERA**
* **RECUPERACIÓN**
* **CANCELADO**
* **LIBERA**
* **CONTINUA**
* **RESUELTO**

Al finalizar correctamente, el estado del motor cambia a:

`RESUELTO`

y las conexiones del RAG desaparecen al quedar liberados los recursos.

## Monitor de eventos

El motor cuenta con un **Monitor de eventos** que permite observar las acciones importantes que ocurren durante la ejecución.

Cada evento representa una acción realizada por las transacciones o por el mecanismo de recuperación. Esto facilita seguir el comportamiento del sistema y comprender cómo se produce y cómo se resuelve un interbloqueo.

## Interfaz interactiva

La interfaz gráfica permite ejecutar las pruebas directamente y observar sus resultados en tiempo real.

Desde ella se pueden consultar:

* estado actual del motor;
* saldos de las cuentas;
* estado de los hilos;
* resultados de las pruebas de carrera;
* Grafo de Asignación de Recursos;
* estado del deadlock;
* monitor de eventos;
* proceso de recuperación.

### Acceso al motor

<div className="motorButtonContainer">
  <a className="motorButton" href="/motor-transacciones">
    Abrir Motor de Transacciones Concurrentes <span>→</span>
  </a>
</div>

La interfaz se encuentra conectada al motor de transacciones y permite ejecutar las pruebas descritas anteriormente de forma interactiva.
