---
sidebar_position: 2
title: Concepto de Proceso vs. Programa
---

# Concepto de Proceso vs. Programa




# Proceso vs. Programa

En un sistema operativo, los términos **programa** y **proceso** están relacionados, pero no significan lo mismo. La diferencia principal es que un programa representa un conjunto de instrucciones almacenadas, mientras que un proceso representa un programa que está siendo ejecutado y administrado por el sistema operativo.

Comprender esta diferencia es fundamental para estudiar cómo un sistema operativo administra el procesador, la memoria y los demás recursos del sistema.

## ¿Qué es un programa?

Un **programa** es un conjunto de instrucciones y datos que se encuentra almacenado en un medio de almacenamiento, como un disco. Su objetivo es indicar al computador qué operaciones debe realizar.

Por sí mismo, un programa es **pasivo**: permanece almacenado y no consume recursos de ejecución del procesador hasta que el sistema operativo lo carga y comienza su ejecución.

Por ejemplo, un archivo como:

```text
calculadora.exe
```

o un script como:

```text
calculadora.py
```

contiene las instrucciones necesarias para realizar una tarea, pero mientras solamente esté almacenado en el disco, no constituye un proceso en ejecución.

## ¿Qué es un proceso?

Un **proceso** es un programa que está siendo ejecutado. Cuando el usuario inicia un programa, el sistema operativo crea un proceso y le asigna los recursos necesarios para que pueda ejecutarse.

Entre la información y los recursos que el sistema operativo debe administrar se encuentran:

* Un identificador de proceso (**PID**).
* El estado actual del proceso.
* El contador de programa.
* Los registros del procesador.
* Espacio de memoria.
* Información relacionada con los archivos abiertos.
* Recursos necesarios para su ejecución.

Por esta razón, un proceso no es solamente el código del programa. También incluye el **estado de ejecución y los recursos asociados** que permiten al sistema operativo controlarlo.

## Relación entre programa y proceso

Podemos entender la relación mediante una situación cotidiana:

> Un programa es como una receta guardada en un libro. El proceso aparece cuando alguien toma esa receta, comienza a seguirla y utiliza los recursos necesarios para preparar el plato.

De manera similar, un mismo programa puede utilizarse para crear **varios procesos independientes**.

Por ejemplo, si un usuario abre dos veces una aplicación de texto, el sistema operativo puede tener dos procesos asociados con esa aplicación. Ambos pueden ejecutar el mismo código del programa, pero cada proceso mantiene su propio estado de ejecución y sus propios recursos.

### Ejemplo

Supongamos que tenemos el programa:

```text
editor.exe
```

Cuando todavía está almacenado en el disco:

```text
Programa
    ↓
Instrucciones + datos
    ↓
Almacenamiento
```

Cuando el usuario lo ejecuta:

```text
Programa
    ↓
El sistema operativo lo carga
    ↓
Se crea un proceso
    ↓
Se asignan recursos
    ↓
El procesador ejecuta sus instrucciones
```

Por lo tanto, podemos decir que:

**Programa = entidad pasiva**

**Proceso = entidad activa**

## Diferencias principales

| Característica    | Programa                                            | Proceso                                                 |
| ----------------- | --------------------------------------------------- | ------------------------------------------------------- |
| Naturaleza        | Pasiva                                              | Activa                                                  |
| Estado            | No tiene un estado de ejecución                     | Tiene un estado de ejecución                            |
| Ubicación inicial | Almacenamiento secundario                           | Memoria principal y recursos del sistema                |
| Ejecución         | No se está ejecutando                               | Está ejecutándose o esperando ejecutarse                |
| PID               | No necesita un PID                                  | Tiene un PID                                            |
| Recursos          | Contiene instrucciones y datos                      | Utiliza memoria, CPU, archivos y otros recursos         |
| Control del SO    | El sistema operativo administra el archivo/programa | El sistema operativo controla directamente su ejecución |

## Un programa puede generar varios procesos

Una de las diferencias más importantes es que **un programa y un proceso no mantienen una relación necesariamente de uno a uno**.

Por ejemplo:

```text
             Programa
           "navegador"
                │
       ┌────────┼────────┐
       ↓        ↓        ↓
   Proceso 1  Proceso 2  Proceso 3
```

Los tres procesos pueden estar relacionados con la misma aplicación, pero cada uno puede tener su propio estado y recursos.

Esto permite que el sistema operativo administre diferentes tareas de manera independiente.

## Ejemplo práctico

Podemos observar la diferencia utilizando Python:

```python
print("Hola, Sistemas Operativos")
```

El archivo que contiene este código es un **programa**.

Cuando ejecutamos:

```bash
python3 programa.py
```

el sistema operativo inicia un **proceso** para ejecutar las instrucciones del programa.

Mientras ese proceso está activo, el sistema operativo debe administrarlo y mantener información sobre su ejecución.

En sistemas Linux, por ejemplo, podemos observar los procesos mediante:

```bash
ps
```

o:

```bash
ps aux
```

Estos comandos permiten visualizar procesos que están siendo administrados por el sistema operativo.

## ¿Por qué es importante esta diferencia?

Distinguir entre programa y proceso permite comprender varios mecanismos fundamentales de los sistemas operativos.

El sistema operativo no administra únicamente archivos que contienen instrucciones. Cuando un programa comienza a ejecutarse, debe:

1. Crear un proceso.
2. Asignarle un identificador.
3. Preparar su espacio de memoria.
4. Registrar su estado y contexto de ejecución.
5. Asignarle tiempo de CPU.
6. Administrar los recursos que utiliza.
7. Finalizar y liberar sus recursos cuando termina.

Estos mecanismos serán importantes para comprender posteriormente conceptos como el **PCB, los estados de un proceso, los cambios de contexto y la planificación de CPU**.

## En resumen

Un **programa** es un conjunto de instrucciones almacenadas que describe cómo realizar una tarea. Un **proceso**, en cambio, es una instancia de un programa que está siendo ejecutada y que posee un estado y recursos administrados por el sistema operativo.

La diferencia puede resumirse de la siguiente manera:

```text
PROGRAMA
Código + datos
      │
      │ ejecución
      ▼
PROCESO
Código + datos + estado + recursos
```

Esta distinción es la base para entender cómo un sistema operativo puede ejecutar y controlar múltiples tareas al mismo tiempo.
