---
sidebar_position: 6
title: Glosario General
---

# Glosario General de Sistemas Operativos I

Bienvenido al glosario de nuestra Wiki de Sistemas Operativos I.

En esta sección encontrarás las definiciones de los principales términos técnicos estudiados a lo largo de las unidades del curso.

Los conceptos estarán organizados **alfabéticamente**, con explicaciones claras y breves para facilitar su comprensión y consulta.

---

## Términos y Conceptos

### A

**Abstracción de hardware:** Mecanismo mediante el cual el sistema operativo oculta la complejidad del hardware y proporciona interfaces sencillas para utilizarlo.

**Algoritmo del Banquero:** Algoritmo de evitación de interbloqueos que analiza las solicitudes de recursos y determina si concederlas mantiene al sistema en un estado seguro.

**Asignación de recursos:** Proceso mediante el cual el sistema operativo distribuye recursos como memoria, procesadores y dispositivos entre los procesos.

### B

**Bloqueo:** Estado en el que un proceso no puede continuar su ejecución hasta que ocurra un evento o se encuentre disponible un recurso.

### C

**Cambio de contexto:** Operación mediante la cual el sistema operativo guarda el estado de un proceso o hilo y restaura el de otro para permitir su ejecución.

**Condiciones de Coffman:** Cuatro condiciones necesarias para que ocurra un interbloqueo: exclusión mutua, retención y espera, no expropiación y espera circular.

**Concurrencia:** Capacidad de un sistema para gestionar varias tareas cuyos períodos de ejecución se superponen.

**Condición de carrera:** Situación en la que el resultado de una operación depende del orden o momento en que diferentes procesos o hilos acceden a datos compartidos.

**Comunicación entre procesos (IPC):** Conjunto de mecanismos que permiten intercambiar información y coordinar la ejecución de diferentes procesos.

**Control de concurrencia:** Conjunto de técnicas utilizadas para coordinar operaciones simultáneas y evitar conflictos al acceder a recursos compartidos.


### D

**Deadlock (Interbloqueo):** Situación en la que un conjunto de procesos queda bloqueado porque cada uno espera recursos o eventos que dependen de otros procesos del mismo conjunto.

**Detección de interbloqueos:** Estrategia que permite identificar si existe un interbloqueo mediante el análisis del estado de los procesos y sus recursos.

**Driver (Controlador):** Software que permite al sistema operativo comunicarse con un dispositivo de hardware.

### E

**Entrada/Salida (E/S):** Operaciones que permiten intercambiar información entre la computadora y dispositivos externos o de almacenamiento.

**Espera circular:** Condición de Coffman en la que existe una cadena cerrada de procesos, donde cada uno espera un recurso retenido por el siguiente.

**Estado seguro:** Estado de asignación de recursos en el que existe al menos una secuencia que permite finalizar todos los procesos.

**Exclusión mutua:** Propiedad por la cual un recurso no compartible solo puede ser utilizado por un proceso a la vez.

**Enfoque del avestruz:** Estrategia que consiste en no aplicar mecanismos específicos de tratamiento de interbloqueos cuando se considera que su frecuencia o impacto no justifica el costo de prevenirlos o detectarlos.

**Espera activa:** Técnica en la que un proceso o hilo comprueba repetidamente una condición mientras espera poder continuar.

**Evitación de interbloqueos:** Estrategia que analiza las solicitudes de recursos antes de concederlas para evitar que el sistema entre en un estado inseguro.

**Expropiación de recursos:** Acción de retirar un recurso previamente asignado a un proceso, cuando el tipo de recurso y el mecanismo de recuperación lo permiten.


### G

**Gestión de recursos:** Función del sistema operativo encargada de administrar y distribuir los recursos de hardware y software.

**Grafo de Asignación de Recursos (RAG):** Representación gráfica de procesos, recursos, asignaciones y solicitudes que ayuda a analizar posibles interbloqueos.

### H

**Hilo (Thread):** Unidad de ejecución dentro de un proceso que comparte recursos con otros hilos del mismo proceso.

### I

**Inanición (Starvation):** Situación en la que un proceso espera indefinidamente porque otros procesos reciben continuamente los recursos que necesita.

**Interbloqueo:** Véase *Deadlock*.

**Interrupción:** Señal o evento que provoca que el procesador suspenda temporalmente su ejecución actual para atender una situación específica.

**Interfaz gráfica de usuario (GUI):** Entorno visual que permite interactuar con el sistema operativo mediante ventanas, iconos, menús y otros elementos gráficos.

### K

**Kernel (Núcleo):** Componente central del sistema operativo responsable de gestionar procesos, memoria, dispositivos y otros recursos fundamentales.

**Kernel híbrido:** Arquitectura de núcleo que combina características de los núcleos monolíticos y los micronúcleos.

**Kernel monolítico:** Arquitectura en la que numerosos servicios del sistema operativo se ejecutan dentro del espacio del núcleo.

### L

**Llamada al sistema (System Call):** Mecanismo que permite a un programa solicitar servicios del núcleo del sistema operativo.

**Lock (Cerrojo):** Mecanismo de sincronización utilizado para controlar el acceso a recursos compartidos.

### M

**Matriz de asignación (Allocation):** Estructura que representa la cantidad de recursos de cada tipo que están asignados a los procesos.

**Matriz de necesidad (Need):** Estructura utilizada en el Algoritmo del Banquero que indica los recursos adicionales que puede necesitar cada proceso para finalizar. Se calcula como Need = Max - Allocation.

**Memoria RAM:** Memoria principal que almacena temporalmente los datos e instrucciones utilizados por los programas en ejecución.

**Microkernel:** Arquitectura que mantiene un conjunto reducido de funciones en el núcleo y ejecuta otros servicios en espacio de usuario.

**Modo núcleo:** Modo de ejecución privilegiado que permite al sistema operativo acceder a instrucciones y recursos protegidos.

**Modo usuario:** Modo de ejecución restringido en el que normalmente funcionan las aplicaciones.

**Monitor:** Mecanismo de sincronización que agrupa datos compartidos y operaciones protegidas para coordinar el acceso concurrente.

**Monitor residente:** Programa utilizado en los primeros sistemas de procesamiento por lotes para controlar automáticamente la ejecución sucesiva de trabajos.

**Multiprogramación:** Técnica que mantiene varios programas en memoria para aprovechar mejor el procesador.

**Multitarea:** Capacidad de un sistema operativo para gestionar la ejecución de múltiples tareas.

**Mutex:** Mecanismo de exclusión mutua que permite proteger una sección crítica.

### N

**No expropiación:** Condición de Coffman según la cual un recurso asignado no puede retirarse forzosamente al proceso que lo posee dentro del modelo considerado.

### O

**Operación atómica:** Operación que se ejecuta como una unidad indivisible respecto a las operaciones concurrentes que podrían interferir con ella.

### P

**Paralelismo:** Ejecución simultánea de diferentes tareas utilizando múltiples unidades de procesamiento.

**Planificación de procesos:** Actividad del sistema operativo que determina qué proceso o hilo utilizará el procesador.

**Prevención de interbloqueos:** Estrategia que establece restricciones para impedir que se cumpla simultáneamente alguna de las condiciones necesarias de Coffman.

**Problema productor-consumidor:** Problema clásico de sincronización en el que uno o varios productores generan datos y los consumidores los procesan mediante un espacio compartido.

**Proceso:** Programa en ejecución que posee un estado y recursos administrados por el sistema operativo.

**Procesamiento por lotes (Batch Processing):** Método que agrupa trabajos para ejecutarlos sin requerir interacción continua del usuario.

### Q

**Quantum:** Intervalo de tiempo durante el cual un proceso o hilo puede utilizar el procesador antes de que el planificador considere cederlo a otro.

### R

**Recuperación de interbloqueos:** Conjunto de acciones utilizadas para resolver un interbloqueo detectado, como finalizar procesos o recuperar recursos.

**Recurso compartido:** Elemento del sistema que puede ser utilizado por varios procesos o hilos y que puede requerir mecanismos de sincronización.

**Recursos disponibles (Available):** Vector que representa la cantidad de recursos de cada tipo que se encuentran libres y pueden asignarse a los procesos.

**Retención y espera:** Condición de Coffman en la que un proceso conserva recursos previamente asignados mientras espera obtener otros adicionales.

### S

**Sección crítica:** Fragmento de código que accede a recursos compartidos y necesita protección frente a accesos concurrentes incompatibles.

**Semáforo:** Mecanismo de sincronización que utiliza un contador y operaciones atómicas para controlar el acceso a recursos o coordinar procesos.

**Secuencia segura:** Orden de ejecución de procesos en el que cada uno puede obtener los recursos que necesita, finalizar y liberar sus recursos para permitir que continúen los demás.

**Sistema de archivos:** Estructura y conjunto de mecanismos que permiten organizar, almacenar, localizar y administrar archivos en un dispositivo de almacenamiento.

**Sistema operativo centralizado:** Sistema que administra principalmente los recursos de una computadora o sistema central.

**Sistema operativo distribuido:** Sistema que coordina recursos y servicios de varias computadoras conectadas para proporcionar un funcionamiento integrado.

**Sistema operativo embebido:** Sistema operativo diseñado para dispositivos electrónicos que realizan funciones específicas.

**Sistema operativo de tiempo real:** Sistema operativo diseñado para cumplir requisitos temporales definidos en la ejecución de tareas.


**Sincronización:** Coordinación de procesos o hilos para mantener un orden correcto de ejecución y evitar conflictos sobre recursos compartidos.

**Sistema operativo (SO):** Software fundamental que administra los recursos de una computadora y proporciona servicios a las aplicaciones y usuarios.

### T

**Tiempo compartido (Time-Sharing):** Técnica que distribuye el tiempo del procesador entre varias tareas o usuarios para ofrecer una ejecución interactiva.

**Transacción concurrente:** Operación que se ejecuta en un entorno donde otras transacciones pueden estar activas simultáneamente, por lo que requiere coordinación para mantener la consistencia de los datos.

### V

**Variable compartida:** Dato al que pueden acceder varios procesos o hilos y cuyo uso concurrente puede requerir sincronización.

**Vector de recursos máximos (Max):** Representación de la cantidad máxima de recursos de cada tipo que puede solicitar un proceso, utilizada en el Algoritmo del Banquero.
