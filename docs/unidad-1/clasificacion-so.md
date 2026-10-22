---
sidebar_position: 5
title: Clasificación de los Sistemas Operativos
---


import SimuladorClasificacionSO from '@site/src/components/SimuladorClasificacionSO';

# Clasificación de los Sistemas Operativos
---

Los Sistemas Operativos se clasifican según la **arquitectura interna de su núcleo (Kernel)** y la **forma en que gestionan la ejecución de tareas y usuarios**. La elección del tipo de arquitectura define aspectos críticos como el rendimiento, la estabilidad y la seguridad del sistema.

---

## 1. Clasificación según la Arquitectura del Kernel

El Kernel es el componente central del SO. Según cómo se organicen sus módulos en memoria, existen tres enfoques principales:

```text
┌─────────────────────────────────────────────────────────────────┐
│                     NÚCLEO MONOLÍTICO                           │
│  [ Gestión Procesos | Memoria | Drivers | Sistema de Archivos ]  │
└─────────────────────────────────────────────────────────────────┘
                                vs
┌─────────────────────────────────────────────────────────────────┐
│                        MICROKERNEL                              │
│  [ Espacio Usuario: Drivers | Sistema de Archivos | Servidores ]│
│  ─────────────────────────────────────────────────────────────  │
│  [ Kernel Mínimo: IPC | Gestión Básica Memoria | Planificación ]│
└─────────────────────────────────────────────────────────────────┘
```
### A. Kernel Monolítico
Todos los servicios del SO (gestión de memoria, planificación de procesos, drivers de dispositivos, sistemas de archivos) se ejecutan juntos en un único espacio de direcciones en **Modo Kernel**.

* **Ventajas:** Rendimiento extremadamente alto y comunicación interna rápida entre módulos.
* **Desventajas:** Un fallo o error en un driver puede colapsar (*kernel panic*) todo el sistema operativo.
* **Ejemplos:** Linux, MS-DOS, FreeBSD.

---

### B. Microkernel
Mantiene dentro del espacio de **Modo Kernel** únicamente los servicios mínimos indispensables (comunicación IPC, planificación básica de CPU y gestión primaria de memoria). Todos los demás servicios (drivers, sistemas de archivos) se ejecutan como procesos independientes en **Modo Usuario**.

* **Ventajas:** Alta tolerancia a fallos y gran seguridad. Si un driver de video o disco falla, se reinicia como un proceso común sin colapsar el sistema.
* **Desventajas:** Menor rendimiento debido al costo de cambio de contexto continuo entre Modo Usuario y Modo Kernel.
* **Ejemplos:** MINIX, QNX, L4.

---

### C. Kernel Híbrido
Combina la velocidad de la arquitectura monolítica con la estructura modular del microkernel. Permite ejecutar ciertos servicios en Modo Kernel por motivos de rendimiento, pero mantiene una arquitectura interna conceptualmente modular.

* **Ejemplos:** Windows NT (Windows 10/11), macOS (XNU kernel).

---

## 2. Clasificación según la Estructura Operativa

Los SO también se categorizan según su capacidad para gestionar procesos, procesadores y usuarios de forma simultánea:

| Criterio | Tipo | Descripción | Ejemplo |
| :--- | :--- | :--- | :--- |
| **Administración de Tareas** | **Monotarea** | Solo puede ejecutar un proceso a la vez en memoria. | MS-DOS |
| | **Multitarea** | Permite alternar la CPU entre múltiples procesos en ejecución. | Linux, Windows, macOS |
| **Administración de Usuarios** | **Monousuario** | Atiende a un solo usuario a la vez, independientemente de las tareas. | MS-DOS, Windows 95 |
| | **Multiusuario** | Permite a múltiples usuarios acceder simultáneamente a los recursos. | UNIX, Ubuntu Server |
| **Manejo de Procesadores** | **Uniproceso** | Diseñado para gestionar un solo núcleo de CPU. | Sistemas embebidos antiguos |
| | **Multiproceso** | Distribuye la carga entre múltiples núcleos/procesadores (SMP). | Linux SMP, Windows 11 |

---

## 3. Cuadro Comparativo de Arquitecturas de Kernel

| Característica | Monolítico | Microkernel | Híbrido |
| :--- | :--- | :--- | :--- |
| **Tamaño del Kernel en Memoria** | Grande | Muy Pequeño | Mediano / Grande |
| **Velocidad de Ejecución** | Muy Alta | Media / Baja | Alta |
| **Aislamiento de Drivers** | No (Corren en Kernel) | Sí (Corren en Usuario) | Parcial |
| **Estabilidad ante Errores** | Frágil | Muy Alta | Media / Alta |
| **Complejidad de Código** | Alta | Baja en Kernel | Muy Alta |


---

## 4. Clasificación según su Organización y Propósito

Los sistemas operativos también pueden clasificarse según la forma en que organizan sus recursos y el entorno para el cual fueron diseñados.

### A. Sistemas Operativos Centralizados

Administran los recursos de una computadora o sistema central, donde se concentran las principales operaciones de procesamiento.

**Características:**
- Administración central de los recursos.
- Los procesos utilizan los recursos del equipo principal.
- Pueden ofrecer servicios a otros equipos o terminales.

**Ejemplo:** Un servidor central que proporciona servicios a diferentes usuarios.

### B. Sistemas Operativos Distribuidos

Coordinan varias computadoras conectadas mediante una red para ofrecer servicios y compartir recursos de manera integrada.

**Características:**
- Comunicación entre diferentes equipos.
- Compartición de recursos.
- Coordinación de procesos distribuidos.

**Ejemplos:** Amoeba y Plan 9.

### C. Sistemas Operativos Embebidos

Están diseñados para funcionar dentro de dispositivos electrónicos que realizan tareas específicas.

**Características:**
- Adaptación a recursos de hardware limitados.
- Optimización del consumo de memoria y energía.
- Funcionamiento orientado a tareas concretas.

**Ejemplos:** FreeRTOS y Embedded Linux.

### D. Sistemas Operativos de Tiempo Real

Están diseñados para responder a determinados eventos dentro de límites temporales establecidos.

**Características:**
- Cumplimiento de plazos de respuesta.
- Planificación de tareas según sus prioridades.
- Utilización en sistemas de control y automatización.

**Ejemplos:** QNX, VxWorks y FreeRTOS.

### Cuadro Comparativo

| Tipo | Característica principal | Ejemplo |
| :--- | :--- | :--- |
| Centralizado | Administración desde un sistema central | Servidor central |
| Distribuido | Coordinación de múltiples computadoras | Amoeba |
| Embebido | Control de dispositivos específicos | Embedded Linux |
| Tiempo real | Cumplimiento de límites temporales | QNX |

---

## 5. Simulador Interactivo de Clasificación de Sistemas Operativos

Este simulador permite explorar y comparar los diferentes tipos de sistemas operativos según su arquitectura, administración de tareas y usuarios, y propósito.

### ¿Cómo utilizar el simulador?

1. Selecciona una categoría de clasificación.
2. Elige un tipo de sistema operativo para consultar sus características y ejemplos.
3. Presiona **Comparar todos los tipos** para visualizar sus diferencias.
4. Responde las preguntas de autoevaluación para comprobar tus conocimientos.

El simulador incluye tres categorías:

- **Arquitecturas del kernel:** monolítico, microkernel e híbrido.
- **Administración de tareas y usuarios:** monotarea, multitarea, monousuario, multiusuario, monoprocesador y multiprocesador.
- **Tipos de sistemas operativos:** centralizados, distribuidos, embebidos y de tiempo real.

<SimuladorClasificacionSO />

---