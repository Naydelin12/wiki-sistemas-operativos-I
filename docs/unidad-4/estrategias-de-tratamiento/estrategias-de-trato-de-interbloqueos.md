---
sidebar_position: 1
title: Introducción a las estrategias
---

# Estrategias de Tratamiento de Interbloqueos

Los sistemas operativos utilizan diferentes estrategias para administrar los recursos compartidos y tratar los problemas de interbloqueo.

Estas estrategias permiten prevenir situaciones de bloqueo, evitar estados inseguros, detectar interbloqueos existentes o decidir cuándo resulta conveniente no intervenir.

## Principales estrategias

| Estrategia | Descripción |
|---|---|
| Prevención | Impide que se cumpla alguna de las condiciones necesarias para un interbloqueo. |
| Evitación | Analiza las solicitudes de recursos para mantener el sistema en un estado seguro. |
| Detección y recuperación | Identifica interbloqueos existentes y aplica mecanismos para resolverlos. |
| Enfoque del avestruz | Decide ignorar el problema cuando su tratamiento resulta más costoso que sus posibles consecuencias. |

## Importancia

No existe una única estrategia adecuada para todos los sistemas operativos.

La elección depende de los recursos disponibles, el comportamiento de los procesos, el costo de aplicar mecanismos de control y las consecuencias de un posible interbloqueo.

En las siguientes secciones se estudiará cada estrategia mediante explicaciones, ejemplos y simuladores interactivos.

---