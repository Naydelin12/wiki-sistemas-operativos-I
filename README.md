# Wiki de Sistemas Operativos I

Wiki académica desarrollada para la asignatura **Sistemas Operativos I**, que reúne contenidos de estudio e integra herramientas prácticas para comprender y demostrar conceptos relacionados con los sistemas operativos.

El proyecto utiliza Docusaurus para la documentación web e incorpora simuladores que permiten observar el funcionamiento de la administración de memoria y la ejecución de operaciones concurrentes.

## Descripción del proyecto

El objetivo de la wiki es centralizar los contenidos académicos de la asignatura y complementar el aprendizaje mediante herramientas interactivas.

El proyecto contempla dos componentes prácticos principales:

- **Simulador de memoria RAM:** desarrollado en Python, permite observar la administración de la memoria, los procesos y la disponibilidad de recursos.
- **Motor de transacciones concurrentes:** desarrollado con Node.js y Express, permite ejecutar pruebas relacionadas con las transferencias, las condiciones de carrera, la sincronización y la detección y recuperación de interbloqueos.

Cada componente cuenta con su propia implementación y documentación técnica. Este README presenta una visión general del proyecto, sus tecnologías, su arquitectura y las instrucciones principales para trabajar con la wiki.

## Tecnologías utilizadas

| Tecnología | Función |
|---|---|
| Docusaurus | Estructura y generación de la wiki. |
| React | Desarrollo de la interfaz web interactiva. |
| JavaScript | Implementación de la interfaz y del backend de transacciones. |
| Node.js | Entorno de ejecución del backend. |
| Express | Creación y administración de los endpoints de la API. |
| CORS | Configuración de solicitudes entre la interfaz y el backend. |
| Worker Threads | Ejecución de tareas concurrentes en hilos de trabajo. |
| SharedArrayBuffer | Compartición de memoria entre hilos en las pruebas que lo requieren. |
| Atomics | Coordinación de operaciones sobre memoria compartida. |
| Python | Desarrollo del simulador de memoria RAM. |
| WSL2 | Entorno Linux utilizado durante el desarrollo y las pruebas locales. |
| Render | Alojamiento del backend de transacciones mediante una URL pública. |

## Arquitectura general

El proyecto separa la documentación web de los componentes que ejecutan las simulaciones. La wiki se encarga de presentar los contenidos y ofrecer acceso a las herramientas, mientras que cada simulador ejecuta su propia lógica.

### Wiki y motor de transacciones

La interfaz del motor está desarrollada en React y se encuentra dentro del proyecto Docusaurus. Esta interfaz se comunica mediante solicitudes HTTP con el backend publicado en Render.

El flujo de funcionamiento es el siguiente:

1. El usuario accede a la wiki desde un navegador.
2. Abre la página del motor de transacciones.
3. La interfaz solicita al backend el estado actual del motor.
4. Cuando el usuario selecciona una prueba, la interfaz envía la solicitud correspondiente.
5. El backend ejecuta la operación y actualiza sus datos.
6. La interfaz consulta nuevamente el estado y presenta los resultados recibidos.

El backend utiliza el endpoint `GET /api/estado` para proporcionar la información que necesita la interfaz. Las operaciones de prueba se solicitan mediante endpoints `POST`.

### Entorno de desarrollo y publicación

Durante el desarrollo se utilizó WSL2 como entorno Linux local. El backend del motor de transacciones se publicó posteriormente en Render y la interfaz se configuró para comunicarse con su dirección pública.

La URL configurada en la interfaz es:

**Backend del motor de transacciones:** https://motor-concurrente-sol.onrender.com

La respuesta de la ruta principal del backend proporciona información sobre el proyecto y su estado. El campo `entorno` devuelve el valor `WSL2`, definido en el código del servidor; este valor identifica la etiqueta declarada por la aplicación, pero no demuestra por sí solo que Render esté ejecutando WSL2.

## Simuladores del proyecto

### 1. Simulador de memoria RAM

El simulador de memoria RAM está desarrollado en Python y cuenta con una interfaz gráfica. Su propósito es representar la administración de la memoria y permitir observar el comportamiento de los procesos durante la ejecución.

Entre los aspectos que contempla se encuentran:

- Capacidad total y memoria disponible.
- Creación y administración de procesos.
- Consumo de memoria por parte de los procesos.
- Cola de espera cuando no hay recursos suficientes.
- Liberación de memoria cuando finalizan los procesos.

El simulador permite relacionar los conceptos teóricos de administración de memoria con una representación práctica de los procesos y los recursos disponibles.

Su implementación y sus instrucciones específicas de ejecución se documentan en el README propio del simulador de memoria RAM.

### 2. Motor de transacciones concurrentes

El motor de transacciones concurrentes está desarrollado con Node.js y Express. Su propósito es demostrar cómo se comportan las operaciones que se ejecutan concurrentemente y cómo pueden aparecer problemas relacionados con la sincronización y el uso de recursos compartidos.

La interfaz presenta información sobre el estado del motor, las cuentas, los hilos de trabajo, los eventos y los resultados de las pruebas.

#### Transferencias entre cuentas

La prueba ejecuta dos transferencias concurrentes:

- **T1:** transfiere 100 unidades de la cuenta A a la cuenta B.
- **T2:** transfiere 50 unidades de la cuenta B a la cuenta A.

Las cuentas comienzan con un saldo de 1,000 unidades cada una. La prueba permite observar los movimientos y el estado final de las cuentas.

#### Carrera de datos

Esta prueba ejecuta dos hilos de trabajo, cada uno con 100,000 operaciones sobre un contador compartido.

El resultado esperado es de 200,000 operaciones acumuladas. El motor compara el resultado esperado con el obtenido y presenta información sobre las actualizaciones perdidas y la integridad del resultado.

#### Carrera protegida

Esta prueba utiliza una variante protegida para comparar el resultado con el de la carrera de datos sin protección.

También ejecuta dos hilos de trabajo con 100,000 operaciones cada uno. La comparación permite observar cómo los mecanismos de sincronización ayudan a evitar actualizaciones perdidas y a mantener la integridad del contador compartido.

#### Detección de deadlock

La prueba simula un interbloqueo mediante dos hilos que intentan acceder a recursos en un orden opuesto.

El backend construye un grafo de asignación de recursos (RAG) y utiliza la detección de ciclos para identificar una posible situación de interbloqueo. La interfaz presenta el estado detectado, las relaciones del grafo y los eventos registrados.

#### Recuperación del deadlock

Después de detectar el interbloqueo, el usuario puede iniciar el procedimiento de recuperación.

En la implementación actual, el backend selecciona a T2 como víctima y utiliza mecanismos de cancelación y coordinación para permitir que la ejecución se recupere. La interfaz refleja los estados y resultados comunicados por el servidor.

#### Reinicio del motor

La opción de reinicio permite limpiar los datos de las pruebas y regresar a un estado inicial. Entre otras acciones, restablece los saldos de las cuentas a 1,000 unidades, limpia los eventos y las relaciones del grafo, y reinicia el estado de las pruebas.

## API del motor de transacciones

El backend expone los siguientes endpoints:

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/` | Devuelve información general del servidor. |
| GET | `/api/estado` | Consulta el estado actual del motor. |
| POST | `/api/transferencias` | Ejecuta la prueba de transferencias concurrentes. |
| POST | `/api/carrera` | Ejecuta la prueba de carrera de datos. |
| POST | `/api/carrera-protegida` | Ejecuta la prueba de carrera protegida. |
| POST | `/api/deadlock` | Inicia la prueba de detección de interbloqueo. |
| POST | `/api/resolver` | Inicia la recuperación del interbloqueo detectado. |
| POST | `/api/reiniciar` | Restablece el estado del motor. |

Los endpoints `GET` permiten consultar información, mientras que los endpoints `POST` inician operaciones o modifican el estado de las pruebas.

## Estructura del proyecto

La estructura principal se organiza de la siguiente manera:

```text
wiki-sistemas-operativos/
├── docs/
│   └── Contenidos académicos de la wiki
├── src/
│   └── pages/
│       └── motor-transacciones/
│           └── index.js
├── motor-concurrente/
│   ├── servidor.js
│   ├── package.json
│   ├── package-lock.json
│   ├── worker-transferencia.js
│   ├── worker-deadlock.js
│   ├── worker-carrera.js
│   └── Otros módulos del motor
├── docusaurus.config.js
├── sidebars.js
├── package.json
└── README.md
```

La carpeta `docs` contiene la documentación académica; `src/pages/motor-transacciones/index.js` implementa la interfaz del motor, y `motor-concurrente` contiene el servidor y los módulos utilizados en las pruebas.

El simulador de memoria RAM conserva su propia estructura y documentación, según la organización que tenga dentro del repositorio.

## Requisitos

Para trabajar localmente con la wiki se necesita:

- Node.js versión 20 o superior.
- npm.
- Git, si se desea clonar el repositorio.

Para desarrollar o ejecutar los componentes por separado, también se requieren las dependencias específicas de cada simulador.

## Instalación y ejecución local de la wiki

### 1. Instalar las dependencias

Desde la carpeta raíz del proyecto, ejecutar:

```bash
npm install
```

### 2. Iniciar el servidor de desarrollo

```bash
npm run start
```

Docusaurus iniciará la wiki y mostrará en la terminal la dirección local para abrirla en el navegador.

### 3. Compilar la wiki

Para generar la versión de producción:

```bash
npm run build
```

### 4. Probar la compilación localmente

Después de compilar el proyecto, ejecutar:

```bash
npm run serve
```

Esto permite revisar localmente la versión generada por Docusaurus.

## Ejecución local del motor de transacciones

Para ejecutar el backend de manera independiente durante el desarrollo:

1. Entrar en la carpeta del motor:

   ```bash
   cd motor-concurrente
   ```

2. Instalar sus dependencias:

   ```bash
   npm install
   ```

3. Iniciar el servidor:

   ```bash
   node servidor.js
   ```

El servidor está configurado para utilizar el puerto `3001` y escuchar en `0.0.0.0`.

**Nota:** la interfaz publicada utiliza la URL de Render. Si se desea probar la interfaz contra un backend local, debe configurarse para utilizar la dirección local correspondiente. La wiki y el backend son componentes separados; iniciar Docusaurus no inicia automáticamente el motor de transacciones.

## Uso de la versión publicada

Para utilizar el proyecto publicado:

1. Abrir la dirección pública de la wiki.
2. Acceder al apartado del simulador que se desea utilizar.
3. En el motor de transacciones, esperar a que la interfaz consulte el estado del backend.
4. Seleccionar la prueba correspondiente.
5. Observar los eventos, los estados y los resultados presentados.
6. Reiniciar el motor cuando sea necesario para repetir una prueba desde el estado inicial.

La disponibilidad de las funciones en línea depende de que la wiki y el servicio backend estén accesibles.

## Consideraciones técnicas

- La wiki y el backend de transacciones son componentes separados.
- La interfaz del motor utiliza solicitudes HTTP para comunicarse con la API.
- Express administra las rutas del backend.
- Worker Threads permite ejecutar tareas en hilos de trabajo.
- SharedArrayBuffer y Atomics se utilizan en las pruebas que requieren memoria compartida y coordinación.
- El grafo de asignación de recursos permite representar las relaciones entre procesos y recursos durante la detección de interbloqueos.
- La prueba de carrera protegida permite comparar los resultados de una ejecución con y sin protección.
- WSL2 se utilizó como entorno de desarrollo y pruebas locales; Render es el servicio de alojamiento configurado para el backend.
- Los resultados mostrados por la interfaz dependen de las respuestas recibidas del servidor.

## Conclusión

La Wiki de Sistemas Operativos I reúne documentación académica y herramientas prácticas que ayudan a comprender conceptos fundamentales de los sistemas operativos.

El simulador de memoria RAM permite observar aspectos de la administración de memoria y los procesos, mientras que el motor de transacciones concurrentes facilita el estudio de la concurrencia, las condiciones de carrera, la sincronización y los interbloqueos.

La separación entre la wiki y el backend permite publicar la interfaz y el servicio de transacciones de manera independiente, facilitando el acceso al sistema desde un navegador.

Para conocer detalles específicos de cada simulador, se debe consultar también la documentación correspondiente a su implementación.
