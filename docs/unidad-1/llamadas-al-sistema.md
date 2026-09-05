---
sidebar_position: 4
title: Llamadas al Sistema y Protección
---

# Llamadas al Sistema y Protección

---
Para garantizar la estabilidad y la seguridad del equipo, un Sistema Operativo no permite que las aplicaciones de usuario accedan directamente al hardware ni a la memoria de otros programas. El puente controlado que permite solicitar estos recursos privileged se conoce como **Llamadas al Sistema (*System Calls*)**.

---

## 1. Modos de Ejecución e Interrupciones

La arquitectura del procesador trabaja en conjunto con el SO mediante dos **modos de privilegio** principales:

<div style={{backgroundColor: '#e6f4ff', borderLeft: '5px solid #1890ff', padding: '12px 16px', borderRadius: '4px', marginBottom: '16px'}}>
  <strong style={{color: '#0958d9'}}> Modo Usuario:</strong>
  <p style={{margin: '4px 0 0 0', color: '#000000'}}>Modo restringido donde se ejecutan las aplicaciones. Si un programa intenta ejecutar una instrucción privilegiada (como escribir directamente en el disco duro), el procesador genera una excepción de hardware y detiene el proceso.</p>
</div>

<div style={{backgroundColor: '#fff1f0', borderLeft: '5px solid #ff4d4f', padding: '12px 16px', borderRadius: '4px', marginBottom: '16px'}}>
  <strong style={{color: '#cf1322'}}> Modo Núcleo / Kernel:</strong>
  <p style={{margin: '4px 0 0 0', color: '#000000'}}>Reservado exclusivamente para el Kernel del SO. Ofrece acceso completo e irrestricto al hardware y a todas las instrucciones del procesador.</p>
</div>

---

## 2. Mecanismo de una Llamada al Sistema

Cuando una aplicación necesita realizar una tarea de E/S (como leer un archivo o abrir un socket de red), debe realizar una **transición de modo**:

```text
[ Modo Usuario ]
  1. La App llama a una API de alto nivel (ej. open(), read())
  2. La API invoca una Interrupción por Software / Trap
 ─────────────────────────────────────────────────────────────
[ Modo Núcleo ]
  3. El procesador cambia el bit de modo a Kernel Mode
  4. El Kernel consulta la Tabla de Vectores de Interrupción
  5. Se ejecuta el manejador de la Syscall solicitada
  6. Se retorna el resultado y se restaura a Modo Usuario
  ```

---

## 3. Categorías Principales de Llamadas al Sistema

Las llamadas al sistema se agrupan según el tipo de servicio que solicitan al Kernel:

| Categoría | Función Principal | Ejemplos en POSIX (Linux/UNIX) | Ejemplos en Windows API |
| :--- | :--- | :--- | :--- |
| **Control de Procesos** | Crear, finalizar o esperar la ejecución de procesos. | `fork()`, `exec()`, `exit()`, `wait()` | `CreateProcess()`, `ExitProcess()` |
| **Gestión de Archivos** | Crear, leer, escribir y cerrar archivos o directorios. | `open()`, `read()`, `write()`, `close()` | `CreateFile()`, `ReadFile()`, `WriteFile()` |
| **Gestión de Dispositivos** | Solicitud y liberación de periféricos, lectura de buffers. | `ioctl()`, `read()`, `write()` | `SetCommState()`, `DeviceIoControl()` |
| **Mantenimiento de Información** | Obtener hora del sistema, datos de procesos y límites. | `getpid()`, `time()`, `alarm()` | `GetSystemTime()`, `GetCurrentProcessId()` |
| **Comunicación y Redes** | Crear conexiones entre procesos y sockets. | `pipe()`, `shmget()`, `socket()`, `connect()` | `CreatePipe()`, `MapViewOfFile()`, `WSAConnect()` |

---

## 4. Análisis Práctico: Rastreo de Syscalls en Linux

Para observar qué llamadas al sistema realiza una aplicación en tiempo real dentro de un entorno Linux, se utiliza la herramienta **`strace`**:


**Rastrear las llamadas al sistema del comando 'cat' al leer un archivo**
```text
strace cat archivo.txt
```

**Salida simplificada devuelta por el Kernel:**
```text
openat(AT_FDCWD, "archivo.txt", O_RDONLY) = 3  // Abre el archivo y asigna el FD 3
read(3, "Contenido del archivo...", 131072) = 24  // Lee los bytes en memoria
write(1, "Contenido del archivo...", 24)    = 24  // Imprime en la salida estándar (pantalla)
close(3)                                    = 0   // Cierra el archivo
```