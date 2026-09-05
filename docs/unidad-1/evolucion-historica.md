---
sidebar_position: 3
title: Evolución Histórica
---
import { LineaTiempoSO } from '@site/src/components/LineaTiempoSO';

# Evolución Histórica

---

# Evolución Histórica de los Sistemas Operativos

La historia de los Sistemas Operativos va de la mano con el avance continuo del hardware. Lo que hoy conocemos como un entorno amigable de ventanas e interacción táctil comenzó como gigantescas máquinas tubulares que requerían configuración eléctrica manual y directa sobre el circuito.

---

## 1. Línea de Tiempo Interactiva

Explora los hitos, arquitecturas y conceptos dominantes que transformaron la computación a lo largo de las décadas:

<LineaTiempoSO />

---

## 2. Eras Tecnológicas y Generaciones

---

### Generación Cero (1940 - 1955): Sin Sistema Operativo
* **Hardware clave:** Tubos al vacío y tableros de conmutadores.
* **Modo de trabajo:** Interacción directa con el hardware (*Bare Metal*).

Durante esta etapa **no existía el concepto de Sistema Operativo**. Los programadores interactuaban directamente con el código máquina (ceros y unos). 

* Se reservaba tiempo de la máquina en un libro de registro físico.
* El programador conectaba cables en tableros de clavijas (*plugboards*) para configurar las instrucciones del programa.
* Procesamiento estrictamente en serie: un solo usuario controlaba la máquina a la vez.

---

### Primera Generación (1955 - 1965): Sistemas por Lotes (Batch)
* **Hardware clave:** Transistores y tarjetas perforadas.
* **Innovación principal:** **Monitor Residente** y Procesamiento por Lotes (*Batch Processing*).

Para eliminar el tiempo muerto mientras los operadores humanos cambiaban tarjetas entre un programa y otro, nació el primer ancestro del SO: el **Monitor Residente**.

* **Sistemas destacados:** **GM-NAA I/O** (1956) para la IBM 704.
* **Funcionamiento:** El usuario entregaba sus tarjetas perforadas a un operador. Este agrupaba los trabajos similares ("lotes") en una cinta magnética y el Monitor Residente los cargaba en memoria secuencialmente.

---

### Segunda Generación (1965 - 1980): Multiprogramación y Tiempo Compartido
* **Hardware clave:** Circuitos Integrados (Chips).
* **Innovación principal:** Multiprogramación, Tiempo Compartido (*Time-Sharing*) y el origen de UNIX.

Al aumentar la potencia de los procesadores, mantenerlos ociosos esperando operaciones de Entrada/Salida resultaba costoso.

* **Multiprogramación:** La memoria RAM albergaba varios programas simultáneamente. Cuando un programa esperaba datos del disco, la CPU pasaba a ejecutar otro.
* **Tiempo Compartido:** Permitió que múltiples usuarios se conectaran mediante terminales e interactuaran en tiempo real asignándoles pequeñas fracciones de tiempo de procesador (*Quantum*).
* **Hitos clave:**
  * **IBM System/360 (1964):** Primera familia de computadoras que compartió un mismo SO (OS/360) a través de distintas gamas de hardware.
  * **UNIX (1969/1973):** Creado por Ken Thompson y Dennis Ritchie en los Laboratorios Bell. En 1973 fue reescrito en **lenguaje C**, estableciendo las bases de portabilidad, modulación y estructura que rigen los SO modernos.

---

### Tercera Generación (1980 - 1990): Computadoras Personales y la GUI
* **Hardware clave:** Microprocesadores y chips LSI/VLSI (Intel 8086).
* **Innovación principal:** Interfaz Gráfica de Usuario (GUI) y masificación de la Computadora Personal (PC).

La miniaturización de componentes permitió llevar el cómputo fuera de las grandes empresas directamente a los hogares y oficinas.

* **Sistemas por Línea de Comandos:**
  * **CP/M (1974):** Estándar inicial en microcomputadoras.
  * **MS-DOS (1981):** Creado por Microsoft para la IBM PC, dominó el mercado mediante una interfaz basada en texto.
* **La Revolución de la Interfaz Gráfica:**
  * **Apple Macintosh (1984):** Popularizó comercialmente la Interfaz Gráfica de Usuario (GUI) basada en ventanas, íconos y ratón.
  * **Microsoft Windows (1985+):** Nació como un entorno gráfico sobre MS-DOS hasta consolidarse como un SO independiente a partir de Windows 95.

---

### Cuarta Generación (1990 - Presente): Redes, Open Source y Sistemas Móviles
* **Hardware clave:** Procesadores Multinúcleo, Arquitecturas de 64-bits y Smartphones.
* **Innovaciones:** Internet nativo, Código Abierto y Sistemas Operativos Móviles.

* **El Nacimiento de GNU/Linux (1991):** Linus Torvalds creó el núcleo Linux y lo combinó con las herramientas del proyecto GNU de Richard Stallman, creando el sistema operativo libre que impulsa la mayoría de servidores web, supercomputadoras y dispositivos Android.
* **Evolución NT y 64-bits:** Windows NT/XP/11 reestructuraron la gestión de procesos para entornos distribuidos, seguros y multinúcleo.
* **La Era Móvil (Android / iOS):** Basados en núcleos UNIX/Linux, adaptaron la planificación de tareas a pantallas táctiles, sensores y restricciones energéticas de batería.

---

## 3. Matriz Comparativa de Generaciones

| Generación | Tecnología Dominante | Tipo de SO / Característica Principal | Ejemplo Representativo |
| :--- | :--- | :--- | :--- |
| **1a (1940-55)** | Tubos al vacío | **Sin SO** (Conmutadores manuales) | ENIAC / UNIVAC I |
| **2a (1955-65)** | Transistores | **Sistemas por Lotes** (Monitor Residente) | IBM 7094 / GM-NAA I/O |
| **3a (1965-80)** | Circuitos Integrados | **Multiprogramación y Tiempo Compartido** | UNIX / IBM OS/360 |
| **4a (1980-90)** | Microprocesadores | **PCs e Interfaces Gráficas (GUI)** | MS-DOS / Mac OS |
| **5a (1990+)** | Multinúcleos y Redes | **Sistemas Distribuidos, Móviles y Open Source** | GNU/Linux, Windows, Android |

---

## Resumen de la Lección

* La evolución de los Sistemas Operativos ha estado motivada por la necesidad de **maximizar el uso del hardware** y **simplificar la experiencia del usuario**.
* El paso crucial de procesamiento por lotes a **multiprogramación** y **tiempo compartido** sentó las bases de la multitarea moderna.
* La llegada del lenguaje C y **UNIX** estableció el paradigma de desarrollo portable sobre el cual están construidos casi todos los sistemas operativos actuales (Linux, macOS, Android, iOS).