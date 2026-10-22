---
sidebar_position: 2
title: Prevención de Interbloqueos
---

import SimuladorPrevencion from '@site/src/components/SimuladorPrevencion';

# Prevención de Interbloqueos

## 1. Introducción

En los sistemas operativos, varios procesos pueden competir por recursos compartidos, como impresoras, archivos, dispositivos de almacenamiento y regiones de memoria.

Cuando los procesos solicitan recursos sin una organización adecuada, pueden producirse interbloqueos (*deadlocks*), situaciones en las que dos o más procesos quedan esperando indefinidamente recursos que otros procesos mantienen ocupados.

La **prevención de interbloqueos** consiste en establecer reglas para administrar los recursos de manera que no puedan cumplirse simultáneamente las cuatro condiciones de Coffman.

Su objetivo es impedir que se forme un interbloqueo antes de que ocurra.

---

## 2. ¿Qué es la prevención de interbloqueos?

La prevención de interbloqueos es un conjunto de estrategias que restringen la forma en que los procesos solicitan, utilizan y liberan recursos compartidos.

Estas estrategias buscan eliminar al menos una de las cuatro condiciones necesarias para que ocurra un interbloqueo:

1. Exclusión mutua.
2. Retención y espera.
3. No expropiación.
4. Espera circular.

Si se impide que se cumpla cualquiera de estas condiciones, se evita que se produzca un interbloqueo.

### Diferencia entre prevención y evitación

Aunque ambos mecanismos buscan impedir interbloqueos, funcionan de manera diferente.

| Prevención | Evitación |
|---|---|
| Establece restricciones generales sobre el uso de recursos | Evalúa las solicitudes de recursos antes de concederlas |
| Impide que se cumpla alguna condición de Coffman | Busca mantener el sistema en un estado seguro |
| No requiere evaluar continuamente estados seguros | Puede utilizar algoritmos como el del banquero |
| Puede limitar el aprovechamiento de recursos | Requiere información sobre las necesidades de los procesos |

La evitación se estudiará con mayor profundidad en el siguiente tema.

---

## 3. Prevención de la exclusión mutua

La exclusión mutua establece que determinados recursos solamente pueden ser utilizados por un proceso a la vez.

Una estrategia preventiva consiste en permitir que ciertos recursos puedan compartirse entre varios procesos.

### Ejemplo práctico

Supongamos que dos procesos necesitan consultar un archivo.

Si ambos solamente necesitan leerlo, el sistema puede permitir que lo hagan simultáneamente.

De esta manera, no es necesario que uno espere a que el otro termine.

### Limitación

No todos los recursos pueden compartirse.

Por ejemplo, una impresora física necesita coordinar sus trabajos para evitar que las salidas se mezclen.

Por ello, eliminar la exclusión mutua no siempre es posible.

---

## 4. Prevención de la retención y espera

Esta estrategia busca impedir que un proceso conserve recursos mientras espera obtener otros adicionales.

Existen dos mecanismos principales.

### 4.1 Solicitud anticipada de recursos

El proceso solicita todos los recursos que necesitará antes de comenzar su ejecución.

Si todos están disponibles, el sistema se los asigna.

Si alguno no está disponible, el proceso espera sin conservar recursos.

**Ejemplo:**

P1 necesita R1 y R2.

- Si ambos están disponibles, P1 obtiene los dos.
- Si R2 está ocupado, P1 espera sin adquirir R1.
- Cuando ambos están disponibles, P1 puede comenzar.

### 4.2 Liberación antes de solicitar

Otra estrategia consiste en exigir que el proceso libere los recursos que posee antes de solicitar nuevos recursos.

Esto evita que conserve recursos mientras permanece esperando otros.

### Ventajas

- Impide la condición de retención y espera.
- Reduce las dependencias entre procesos.
- Facilita la administración de determinados recursos.

### Desventajas

- Puede disminuir el aprovechamiento de los recursos.
- Algunos procesos no conocen anticipadamente todos los recursos que necesitarán.
- La espera prolongada puede ocasionar inanición si no existe una política de asignación adecuada.

---

## 5. Prevención de la no expropiación

La condición de no expropiación establece que los recursos asignados a un proceso no pueden retirarse obligatoriamente.

Una estrategia preventiva consiste en permitir la recuperación controlada de determinados recursos.

### Ejemplo práctico

Supongamos que:

1. P1 tiene asignado R1.
2. P1 solicita R2.
3. R2 no está disponible.
4. El sistema puede suspender la operación de P1 y recuperar R1 de manera segura.
5. P1 espera hasta que pueda continuar con los recursos necesarios.

Esta técnica puede requerir guardar y restaurar el estado del proceso.

### Limitaciones

No todos los recursos pueden recuperarse de forma segura.

Por ejemplo, retirar una impresora mientras se está imprimiendo un documento puede ocasionar resultados incorrectos.

Por ello, la expropiación se utiliza principalmente cuando los recursos y las operaciones permiten recuperar o restaurar su estado.

---

## 6. Prevención de la espera circular

Esta estrategia consiste en impedir que los procesos formen ciclos de espera por recursos.

Uno de los mecanismos más utilizados es establecer un **orden global de adquisición de recursos**.

### Ejemplo práctico

Supongamos que tenemos dos recursos:

- R1: recurso con prioridad de adquisición 1.
- R2: recurso con prioridad de adquisición 2.

El sistema establece la siguiente regla:

**Todos los procesos deben solicitar primero R1 y después R2.**

De esta manera:

1. P1 solicita R1.
2. Si P1 obtiene R1, puede solicitar R2.
3. P2 no puede adquirir R2 primero para después solicitar R1.
4. Se evita la formación de un ciclo de espera.

### Ventajas

- Es una estrategia relativamente sencilla de implementar.
- Evita la espera circular cuando todos respetan el orden.
- Resulta útil para organizar la adquisición de bloqueos.

### Desventajas

- Es necesario definir un orden para los recursos.
- Puede resultar poco flexible en sistemas complejos.
- Los procesos deben respetar estrictamente las reglas establecidas.

---

## 7. Comparación de las estrategias preventivas

| Estrategia | Condición que elimina | Mecanismo principal | Limitación |
|---|---|---|---|
| Compartir recursos | Exclusión mutua | Permitir accesos compatibles | No todos los recursos son compartibles |
| Solicitud anticipada | Retención y espera | Solicitar todos los recursos conjuntamente | Puede reducir la utilización |
| Recuperación controlada | No expropiación | Retirar recursos que admitan recuperación segura | No siempre es posible |
| Orden global | Espera circular | Solicitar recursos siguiendo un orden | Reduce la flexibilidad |

La elección de una estrategia depende del tipo de recursos, las necesidades de los procesos y las características del sistema operativo.

---

## 8. Ejemplo general de prevención

Consideremos dos procesos y dos recursos exclusivos:

- P1 necesita R1 y R2.
- P2 necesita R1 y R2.
- Cada recurso tiene una sola instancia.

### Sin prevención

1. P1 adquiere R1.
2. P2 adquiere R2.
3. P1 solicita R2 y queda bloqueado.
4. P2 solicita R1 y queda bloqueado.

Se forma el ciclo:

```text
P1 → R2 → P2 → R1 → P1
```

El sistema entra en interbloqueo.

### Con prevención mediante orden global

Establecemos la regla:

```text
Primero R1 → Después R2
```

Ahora:

1. P1 adquiere R1.
2. P2 solicita R1 y debe esperar.
3. P1 adquiere R2.
4. P1 termina y libera ambos recursos.
5. P2 adquiere R1 y después R2.
6. P2 termina y libera los recursos.

En este escenario no se forma una espera circular y ambos procesos pueden finalizar.

---

## 9. Ventajas y desventajas de la prevención

### Ventajas

- Impide la formación de interbloqueos cuando se aplican correctamente las restricciones.
- Facilita el razonamiento sobre la seguridad de la asignación de recursos.
- Permite establecer reglas de adquisición y liberación.
- Puede reducir la necesidad de mecanismos posteriores de recuperación.

### Desventajas

- Puede disminuir la concurrencia.
- Algunos recursos permanecen reservados sin utilizarse.
- Determinadas estrategias pueden provocar esperas prolongadas.
- No todas las técnicas pueden aplicarse a cualquier recurso.

Por esta razón, los sistemas operativos pueden combinar diferentes mecanismos de administración de recursos.

---

## 10. Simulador Interactivo de Prevención de Interbloqueos

En esta sección incorporaremos un simulador que permitirá observar cómo distintas estrategias preventivas modifican la asignación de recursos.

El simulador incluirá:

- Dos procesos: P1 y P2.
- Dos recursos exclusivos: R1 y R2.
- Un escenario sin prevención que produce interbloqueo.
- Prevención mediante solicitud anticipada.
- Prevención mediante orden global de recursos.
- Prevención mediante recuperación controlada.
- Ejecución paso a paso.
- Estados de los procesos y recursos.
- Registro de eventos.
- Botón para reiniciar la simulación.

El objetivo será comparar el comportamiento del sistema cuando no se aplican restricciones y cuando se utilizan estrategias preventivas.

**Nota:** El simulador representará escenarios educativos simplificados. Las estrategias preventivas deberán aplicarse según las características reales de los recursos.

<SimuladorPrevencion />

---

## 11. Conclusión

La prevención de interbloqueos es una técnica fundamental para administrar recursos compartidos de manera segura.

Su funcionamiento se basa en impedir que se cumplan simultáneamente las cuatro condiciones de Coffman.

Entre sus principales estrategias se encuentran compartir recursos compatibles, solicitar anticipadamente los recursos necesarios, permitir la recuperación controlada y establecer un orden global de adquisición.

Aunque estas estrategias pueden reducir la concurrencia o el aprovechamiento de recursos, permiten evitar situaciones en las que los procesos quedan bloqueados permanentemente.

Comprender la prevención es importante para diseñar sistemas concurrentes confiables y eficientes.

---