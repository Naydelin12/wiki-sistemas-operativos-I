
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const unidades = [
  {
    numero: '01',
    titulo: 'Unidad 1',
    tema: 'Fundamentos de los sistemas operativos',
    descripcion:
      'Conoce el propósito, la evolución y las funciones de un sistema operativo.',
    enlace: '/docs/unidad-1/definicion-y-rol',
  },
  {
    numero: '02',
    titulo: 'Unidad 2',
    tema: 'Procesos y planificación',
    descripcion:
      'Explora los procesos, sus estados, los hilos y la planificación de CPU.',
    enlace: '/docs/unidad-2/proceso-vs-programa',
  },
  {
    numero: '03',
    titulo: 'Unidad 3',
    tema: 'Concurrencia y sincronización',
    descripcion:
      'Estudia la sección crítica y los mecanismos de coordinación entre procesos.',
    enlace: '/docs/unidad-3/seccion-critica',
  },
  {
    numero: '04',
    titulo: 'Unidad 4',
    tema: 'Interbloqueos',
    descripcion:
      'Comprende las condiciones y las estrategias para tratar los interbloqueos.',
    enlace: '/docs/unidad-4/definicion-y-casos-de-interbloqueo',
  },
  {
    numero: '05',
    titulo: 'Unidad 5',
    tema: 'Administración de memoria',
    descripcion:
      'Aprende sobre asignación, particiones, paginación y segmentación.',
    enlace: '/docs/unidad-5/asignacion-contigua-de-memoria',
  },
];

const recursos = [
  {
    numero: 'A',
    titulo: 'Motor de Transacciones Concurrentes',
    descripcion:
      'Consulta el proyecto práctico sobre transacciones y ejecución concurrente.',
    enlace: '/docs/proyecto-2/motor-transacciones',
  },
  {
    numero: 'B',
    titulo: 'Simulador de Memoria RAM',
    descripcion:
      'Accede al recurso práctico para trabajar con procesos y memoria RAM.',
    enlace: '/docs/recursos/simulador-procesos-ram',
  },
  {
    numero: 'C',
    titulo: 'Glosario',
    descripcion:
      'Consulta las definiciones de los conceptos importantes del curso.',
    enlace: '/docs/glosario',
  },
];

export default function InicioContenidos() {
  return (
    <div className={styles.contenidos}>
      <section className={styles.unidadesSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.etiqueta}>RECORRIDO ACADÉMICO</span>
          <Heading as="h2">Unidades de aprendizaje</Heading>
          <p>
            Selecciona una unidad para comenzar a estudiar sus temas.
          </p>
        </div>

        <div className={styles.unidadesGrid}>
          {unidades.map((unidad) => (
            <Link
              key={unidad.numero}
              to={unidad.enlace}
              className={styles.unidadCard}
            >
              <div className={styles.unidadTop}>
                <span className={styles.numero}>{unidad.numero}</span>
                <span className={styles.flecha} aria-hidden="true">
                  ↗
                </span>
              </div>

              <div className={styles.unidadBody}>
                <Heading as="h3">{unidad.titulo}</Heading>
                <span className={styles.tema}>{unidad.tema}</span>
                <p>{unidad.descripcion}</p>
              </div>

              <div className={styles.cardFooter}>
                <span>Consultar unidad</span>
                <span aria-hidden="true">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.recursosSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.etiqueta}>MATERIAL COMPLEMENTARIO</span>
          <Heading as="h2">Proyectos y recursos</Heading>
          <p>
            Herramientas y material de consulta que complementan las unidades.
          </p>
        </div>

        <div className={styles.recursosGrid}>
          {recursos.map((recurso) => (
            <Link
              key={recurso.numero}
              to={recurso.enlace}
              className={styles.recursoCard}
            >
              <span className={styles.recursoNumero}>{recurso.numero}</span>
              <div className={styles.recursoBody}>
                <Heading as="h3">{recurso.titulo}</Heading>
                <p>{recurso.descripcion}</p>
                <span className={styles.recursoLink}>
                  Abrir recurso <span aria-hidden="true">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
