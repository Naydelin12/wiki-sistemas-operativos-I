---
sidebar_position: 8
title: Segmentación
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Segmentación

La **segmentación** es una técnica de administración de memoria que divide un programa en unidades lógicas de tamaño variable llamadas **segmentos**. Cada segmento representa una parte del programa que cumple una función determinada, como el código, los datos, la pila de ejecución o un conjunto de procedimientos.

A diferencia de la paginación, que divide la memoria en bloques de tamaño fijo, la segmentación respeta la organización lógica de un programa. Por ejemplo, el código de un programa puede estar en un segmento, sus variables en otro y la pila utilizada durante las llamadas a funciones en uno diferente.

El sistema operativo administra estos segmentos y mantiene una tabla que permite localizar cada uno en la memoria física. Así, los segmentos de un mismo proceso pueden encontrarse en diferentes regiones de la RAM, sin necesidad de estar almacenados de manera consecutiva.

## ¿Cómo se organiza la memoria mediante segmentos?

Un programa está formado por diferentes partes lógicas. La segmentación permite administrar esas partes por separado, de acuerdo con su función y tamaño.

<Tabs>
  <TabItem value="logica" label="Organización lógica" default>

    <div style={{textAlign: 'center'}}>

      **Partes de un programa**

      <div style={{maxWidth: 440, margin: '16px auto', border: '2px solid #64748b', borderRadius: 12, overflow: 'hidden'}}>
        <div style={{background: '#DCE7F5', color: '#243D63', padding: 20, fontWeight: 600, borderBottom: '2px solid #64748b'}}>
          Segmento de código
          <div style={{fontWeight: 400, fontSize: 14, marginTop: 5}}>Instrucciones del programa</div>
        </div>
        <div style={{background: '#D8F0E7', color: '#205C49', padding: 20, fontWeight: 600, borderBottom: '2px solid #64748b'}}>
          Segmento de datos
          <div style={{fontWeight: 400, fontSize: 14, marginTop: 5}}>Variables y datos utilizados</div>
        </div>
        <div style={{background: '#E2EAF5', color: '#334E68', padding: 20, fontWeight: 600, borderBottom: '2px solid #64748b'}}>
          Segmento de pila
          <div style={{fontWeight: 400, fontSize: 14, marginTop: 5}}>Llamadas a funciones y variables locales</div>
        </div>
        <div style={{background: '#E1F2EF', color: '#205C49', padding: 20, fontWeight: 600}}>
          Otros segmentos
          <div style={{fontWeight: 400, fontSize: 14, marginTop: 5}}>Procedimientos u otras estructuras</div>
        </div>
      </div>

    </div>

    Cada segmento representa una unidad lógica y puede tener un tamaño diferente. La cantidad y organización de los segmentos dependen del programa y del sistema que los administra.

  </TabItem>
  <TabItem value="fisica" label="Ubicación en la RAM">

    <div style={{textAlign: 'center'}}>

      **Segmentos ubicados en diferentes regiones**

      <div style={{maxWidth: 440, margin: '16px auto', border: '2px solid #64748b', borderRadius: 12, overflow: 'hidden'}}>
        <div style={{background: '#D8F0E7', color: '#205C49', padding: 22, fontWeight: 600, borderBottom: '2px solid #64748b'}}>
          Segmento de datos
        </div>
        <div style={{background: '#F1F5F9', color: '#475569', padding: 18, borderBottom: '2px solid #64748b'}}>
          Espacio ocupado por otros datos
        </div>
        <div style={{background: '#DCE7F5', color: '#243D63', padding: 22, fontWeight: 600, borderBottom: '2px solid #64748b'}}>
          Segmento de código
        </div>
        <div style={{background: '#F1F5F9', color: '#475569', padding: 18, borderBottom: '2px solid #64748b'}}>
          Espacio libre
        </div>
        <div style={{background: '#E2EAF5', color: '#334E68', padding: 22, fontWeight: 600}}>
          Segmento de pila
        </div>
      </div>

    </div>

    Los segmentos de un proceso no necesitan estar uno junto al otro en la memoria física. Cada uno puede ubicarse en una región diferente, y la tabla de segmentos permite encontrar su ubicación.

  </TabItem>
</Tabs>

## ¿Cómo funciona la tabla de segmentos?

Para administrar los segmentos, el sistema operativo utiliza una **tabla de segmentos**. Cada entrada contiene información necesaria para localizar el segmento y comprobar si una dirección solicitada pertenece a sus límites.

Dos datos fundamentales son:

- **Base:** dirección inicial del segmento en la memoria física.
- **Límite:** tamaño del segmento, es decir, la cantidad de posiciones que contiene.

Por ejemplo, si un segmento comienza en la dirección física 4000 y su límite es de 600 bytes, puede utilizar las direcciones desde 4000 hasta 4599, suponiendo que las direcciones se cuentan por bytes.

<Tabs>
  <TabItem value="tabla" label="Ejemplo de tabla" default>

    Supongamos que un proceso tiene los siguientes segmentos:

    | Número | Segmento | Base física | Límite |
    |---:|---|---:|---:|
    | 0 | Código | 1000 | 500 |
    | 1 | Datos | 3000 | 800 |
    | 2 | Pila | 5000 | 400 |

    La base indica dónde comienza cada segmento en la RAM, mientras que el límite indica cuánto espacio ocupa.

    En este ejemplo, el segmento de código ocupa 500 bytes, el de datos 800 bytes y el de pila 400 bytes. Los tamaños son distintos porque la segmentación permite unidades de longitud variable.

  </TabItem>
  <TabItem value="limites" label="Comprobación de límites">

    El límite también permite comprobar si una dirección lógica es válida.

    Si el segmento de datos tiene un límite de 800 bytes, sus desplazamientos válidos van de 0 a 799.

    - Desplazamiento 0: válido; apunta al inicio del segmento.
    - Desplazamiento 450: válido; se encuentra dentro del segmento.
    - Desplazamiento 799: válido; apunta a su última posición.
    - Desplazamiento 800: inválido; queda fuera del límite.

    Esta comprobación evita que una dirección acceda a posiciones que no pertenecen al segmento solicitado.

  </TabItem>
</Tabs>

## ¿Cómo se traduce una dirección lógica?

En la segmentación, una dirección lógica está formada por dos valores:

- **Número de segmento:** identifica la unidad lógica a la que se quiere acceder.
- **Desplazamiento (*offset*):** indica la posición dentro de ese segmento.

El sistema consulta la tabla de segmentos usando el número de segmento. Luego verifica que el desplazamiento sea menor que el límite. Si es válido, suma el desplazamiento a la base para obtener la dirección física.

<Tabs>
  <TabItem value="pasos" label="Proceso de traducción" default>

    <div style={{maxWidth: 460, margin: '16px auto', textAlign: 'center'}}>

      <div style={{padding: 16, border: '2px solid #64748b', borderRadius: 10, background: '#DCE7F5', color: '#243D63', fontWeight: 600}}>
        Dirección lógica
        <div style={{fontWeight: 400, marginTop: 6}}>Número de segmento + desplazamiento</div>
      </div>

      <div style={{fontSize: 24, padding: 7, color: '#2878a8'}}>↓</div>

      <div style={{padding: 16, border: '2px solid #3A9DAD', borderRadius: 10, background: '#D8F0E7', color: '#205C49', fontWeight: 600}}>
        Consulta de la tabla
        <div style={{fontWeight: 400, marginTop: 6}}>Obtener base y límite</div>
      </div>

      <div style={{fontSize: 24, padding: 7, color: '#2878a8'}}>↓</div>

      <div style={{padding: 16, border: '2px solid #64748b', borderRadius: 10, background: '#F1F5F9', color: '#334155', fontWeight: 600}}>
        Comprobar el desplazamiento
        <div style={{fontWeight: 400, marginTop: 6}}>¿Es menor que el límite?</div>
      </div>

      <div style={{fontSize: 24, padding: 7, color: '#2878a8'}}>↓</div>

      <div style={{padding: 16, border: '2px solid #3A9DAD', borderRadius: 10, background: '#D8F0E7', color: '#205C49', fontWeight: 600}}>
        Calcular dirección física
        <div style={{fontWeight: 400, marginTop: 6}}>Base + desplazamiento</div>
      </div>

    </div>

    Si el desplazamiento está dentro del límite, la dirección física se calcula sumándolo a la base. Si queda fuera, el acceso se rechaza y el sistema debe gestionar la excepción.

  </TabItem>
  <TabItem value="formula" label="Regla de traducción">

    La regla básica es:

    **Si el desplazamiento es menor que el límite:**

    ```text
    Dirección física = Base + Desplazamiento
    ```

    **Si el desplazamiento es igual o mayor que el límite:**

    ```text
    Dirección inválida: desplazamiento fuera del segmento
    ```

    Por ejemplo, un segmento con base 3000 y límite 800 acepta desplazamientos desde 0 hasta 799. Para un desplazamiento de 450, la dirección física será 3450. Para un desplazamiento de 800, no se calcula una dirección física válida.

  </TabItem>
</Tabs>

## Ejemplo práctico de segmentación

Supongamos que un proceso necesita acceder a la dirección lógica formada por el **segmento 1 y el desplazamiento 450**. Según la tabla del ejemplo anterior, el segmento 1 corresponde a los datos, comienza en la dirección física 3000 y tiene un límite de 800 bytes.

<Tabs>
  <TabItem value="datos-ejemplo" label="Datos del problema" default>

    | Elemento | Valor |
    |---|---:|
    | Número de segmento | 1 |
    | Desplazamiento | 450 |
    | Base del segmento 1 | 3000 |
    | Límite del segmento 1 | 800 |

    Primero se consulta la entrada correspondiente al segmento 1. Su base es 3000 y su límite es 800.

    Como el desplazamiento 450 es menor que 800, la dirección está dentro del segmento y puede traducirse.

  </TabItem>
  <TabItem value="calculo" label="Cálculo paso a paso">

    **Paso 1. Identificar el segmento**

    El número 1 indica que se debe consultar la entrada del segmento de datos.

    **Paso 2. Verificar el límite**

    ```text
    Desplazamiento = 450
    Límite = 800

    450 < 800 → Dirección válida
    ```

    **Paso 3. Calcular la dirección física**

    ```text
    Dirección física = Base + Desplazamiento

    Dirección física = 3000 + 450

    Dirección física = 3450
    ```

    **Resultado:** la dirección lógica segmento 1, desplazamiento 450, corresponde a la dirección física 3450.

  </TabItem>
  <TabItem value="invalido" label="¿Y si el desplazamiento es inválido?">

    Supongamos ahora que se solicita el segmento 1 con un desplazamiento de 850.

    ```text
    Desplazamiento = 850
    Límite = 800

    850 >= 800 → Dirección inválida
    ```

    Aunque la base del segmento sea 3000, no se debe calcular una dirección física para ese acceso, porque el desplazamiento supera el espacio asignado.

    Esta comprobación ayuda a proteger los límites de cada segmento y a detectar accesos fuera del rango permitido.

  </TabItem>
</Tabs>

## Ventajas y limitaciones de la segmentación

La segmentación ofrece una organización que se relaciona directamente con la estructura lógica del programa. Sin embargo, al permitir segmentos de tamaños variables, también presenta dificultades para administrar los espacios libres de la memoria física.

| Ventajas | Limitaciones |
|---|---|
| Representa la organización lógica de un programa. | Los segmentos tienen tamaños variables, lo que complica la asignación. |
| Permite asignar y proteger distintas partes de un proceso por separado. | Puede producir fragmentación externa. |
| Facilita establecer permisos diferentes para código, datos y otras áreas. | La tabla de segmentos necesita espacio adicional. |
| Permite compartir determinados segmentos entre procesos cuando el sistema lo admite. | La compactación puede ser necesaria para reunir espacios libres contiguos. |
| Comprueba que los desplazamientos estén dentro de los límites del segmento. | La traducción requiere consultar la información de la tabla y comprobar los límites. |

### Fragmentación en la segmentación

La **fragmentación externa** aparece cuando existen espacios libres separados entre segmentos ocupados. La suma de esos espacios podría ser suficiente para un nuevo segmento, pero puede que no haya un bloque libre contiguo lo bastante grande para alojarlo.

Por ejemplo, imagina que la RAM tiene estos espacios libres:

<Tabs>
  <TabItem value="fragmentacion" label="Espacios disponibles" default>

    <div style={{maxWidth: 440, margin: '16px auto', border: '2px solid #64748b', borderRadius: 12, overflow: 'hidden', textAlign: 'center'}}>
      <div style={{background: '#D8F0E7', color: '#205C49', padding: 18, fontWeight: 600, borderBottom: '2px solid #64748b'}}>
        Espacio libre: 100 KB
      </div>
      <div style={{background: '#DCE7F5', color: '#243D63', padding: 18, fontWeight: 600, borderBottom: '2px solid #64748b'}}>
        Segmento ocupado
      </div>
      <div style={{background: '#D8F0E7', color: '#205C49', padding: 18, fontWeight: 600, borderBottom: '2px solid #64748b'}}>
        Espacio libre: 150 KB
      </div>
      <div style={{background: '#DCE7F5', color: '#243D63', padding: 18, fontWeight: 600, borderBottom: '2px solid #64748b'}}>
        Segmento ocupado
      </div>
      <div style={{background: '#D8F0E7', color: '#205C49', padding: 18, fontWeight: 600}}>
        Espacio libre: 200 KB
      </div>
    </div>

    El total de memoria libre es:

    ```text
    100 KB + 150 KB + 200 KB = 450 KB
    ```

    Si se necesita colocar un nuevo segmento de 300 KB, no podrá asignarse en ninguno de los tres espacios por separado, aunque el total libre sea de 450 KB.

  </TabItem>
  <TabItem value="soluciones" label="¿Cómo se puede reducir?">

    Una técnica posible es la **compactación**, que consiste en reubicar segmentos para agrupar los espacios libres en una región contigua, siempre que el sistema y las condiciones de ejecución lo permitan.

    La compactación puede ayudar a encontrar un bloque suficientemente grande, pero implica mover información y actualizar las referencias correspondientes. Por ello, tiene un costo de procesamiento.

    Otra estrategia consiste en utilizar técnicas de asignación adecuadas para seleccionar espacios libres. Sin embargo, estas estrategias no eliminan por completo la fragmentación externa.

  </TabItem>
</Tabs>

## Segmentación y paginación: diferencias

Ambas técnicas permiten administrar la memoria de los procesos, pero organizan los bloques de manera diferente. La segmentación utiliza unidades lógicas de tamaño variable, mientras que la paginación utiliza bloques de tamaño fijo.

| Característica | Segmentación | Paginación |
|---|---|---|
| División de la memoria lógica | Segmentos de tamaño variable | Páginas de tamaño fijo |
| División de la memoria física | Regiones que alojan segmentos | Marcos de tamaño fijo |
| Criterio de organización | Estructura lógica del programa | Bloques de tamaño uniforme |
| Dirección lógica | Número de segmento y desplazamiento | Número de página y desplazamiento |
| Tabla utilizada | Tabla de segmentos con base y límite | Tabla de páginas que relaciona páginas y marcos |
| Fragmentación característica | Externa | Interna, especialmente en la última página |
| Comprobación de límites | El desplazamiento debe ser menor que el límite del segmento | El desplazamiento debe estar dentro del tamaño de página |
| Ventaja destacada | Organización lógica y protección por segmentos | Asignación flexible de marcos sin exigir continuidad física |

La diferencia esencial no es que una técnica sea siempre mejor que la otra, sino que resuelven la organización de la memoria de formas distintas. Algunos sistemas pueden combinar segmentación y paginación para aprovechar características de ambas.

## Comprueba lo aprendido

Selecciona una respuesta para cada pregunta. Después, pulsa **Comprobar respuestas** para revisar tu resultado.

<div className="quiz-memoria quiz-segmentacion">

  <p><strong>1. ¿Qué característica distingue a la segmentación de la paginación?</strong></p>

  <label><input type="radio" name="segmentacion-pregunta1" value="a" /> Divide el programa en segmentos lógicos de tamaño variable.</label>

  <label><input type="radio" name="segmentacion-pregunta1" value="b" /> Divide toda la memoria en bloques obligatoriamente iguales.</label>

  <label><input type="radio" name="segmentacion-pregunta1" value="c" /> Elimina la necesidad de una tabla para traducir direcciones.</label>

  <p><strong>2. Un segmento tiene base 2000, límite 500 y se solicita el desplazamiento 120. ¿Cuál es la dirección física?</strong></p>

  <label><input type="radio" name="segmentacion-pregunta2" value="a" /> 2120.</label>

  <label><input type="radio" name="segmentacion-pregunta2" value="b" /> 2500.</label>

  <label><input type="radio" name="segmentacion-pregunta2" value="c" /> La dirección es inválida porque el desplazamiento debe ser cero.</label>

  <p><strong>3. ¿Qué sucede si el desplazamiento es igual al límite del segmento?</strong></p>

  <label><input type="radio" name="segmentacion-pregunta3" value="a" /> Se utiliza la base como dirección física sin comprobar nada más.</label>

  <label><input type="radio" name="segmentacion-pregunta3" value="b" /> La dirección es inválida porque el desplazamiento queda fuera del segmento.</label>

  <label><input type="radio" name="segmentacion-pregunta3" value="c" /> El sistema aumenta automáticamente el tamaño del segmento.</label>

  <div style={{textAlign: 'center', marginTop: '24px'}}>

    <button
      className="button button--primary"
      onClick={() => {
        const root = document.querySelector('.quiz-segmentacion');
        const correctas = ['a', 'a', 'b'];
        let puntuacion = 0;
        let completas = true;

        correctas.forEach((correcta, i) => {
          const seleccionada = root.querySelector('input[name="segmentacion-pregunta' + (i + 1) + '"]:checked');

          if (!seleccionada) {
            completas = false;
          } else if (seleccionada.value === correcta) {
            puntuacion++;
          }
        });

        const resultado = root.querySelector('.resultado-segmentacion');

        if (!completas) {
          resultado.textContent = 'Responde las tres preguntas antes de comprobar.';
        } else {
          resultado.textContent = 'Resultado: ' + puntuacion + ' de 3 respuestas correctas.';
        }
      }}
    >
      Comprobar respuestas
    </button>

    <button
      className="button button--secondary"
      style={{marginLeft: '12px', backgroundColor: '#3A9DAD', borderColor: '#3A9DAD', color: '#FFFFFF'}}
      onClick={() => {
        const root = document.querySelector('.quiz-segmentacion');

        root.querySelectorAll('input[type="radio"]').forEach(input => {
          input.checked = false;
        });

        root.querySelector('.resultado-segmentacion').textContent = '';
      }}
    >
      Reiniciar cuestionario
    </button>

  </div>

  <p className="resultado-quiz resultado-segmentacion" aria-live="polite" style={{textAlign: 'center'}}></p>

</div>

## Idea clave

La segmentación organiza la memoria de acuerdo con las partes lógicas de un programa. Cada segmento tiene una base y un límite: la base indica dónde comienza en la memoria física y el límite determina cuánto espacio puede utilizar. Para traducir una dirección, el sistema comprueba primero que el desplazamiento esté dentro del límite y después suma ese desplazamiento a la base.

**Recuerda:** la segmentación utiliza bloques de tamaño variable y puede sufrir fragmentación externa, mientras que la paginación utiliza bloques de tamaño fijo y puede producir fragmentación interna.