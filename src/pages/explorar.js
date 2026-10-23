
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import styles from './explorar.module.css';

const unidades = [
  {
    numero: '01',
    titulo: 'Unidad 1',
    descripcion:
      'Fundamentos, definición, evolución y funciones de los sistemas operativos.',
    enlace: '/docs/unidad-1/introduccion',
    temas: 'Conceptos fundamentales',
  },
  {
    numero: '02',
    titulo: 'Unidad 2',
    descripcion:
      'Procesos, estados, hilos y planificación del procesador.',
    enlace: '/docs/unidad-2/proceso-vs-programa',
    temas: 'Procesos y planificación',
  },
  {
    numero: '03',
    titulo: 'Unidad 3',
    descripcion:
      'Mecanismos de sincronización y comunicación entre procesos.',
    enlace: '/docs/unidad-3/seccion-critica',
    temas: 'Concurrencia y sincronización',
  },
  {
    numero: '04',
    titulo: 'Unidad 4',
    descripcion:
      'Interbloqueos, condiciones, prevención, evitación y recuperación.',
    enlace: '/docs/unidad-4/definicion-y-casos-de-interbloqueo',
    temas: 'Gestión de interbloqueos',
  },
  {
    numero: '05',
    titulo: 'Unidad 5',
    descripcion:
      'Organización, asignación y administración de la memoria.',
    enlace: '/docs/unidad-5/gestion-monoprogramados-vs-multiprogramados',
    temas: 'Administración de memoria',
  },
];

const recursos = [
  {
    numero: 'A',
    titulo: 'Motor de Transacciones Concurrentes',
    descripcion:
      'Explora el proyecto práctico relacionado con la ejecución concurrente y las transacciones.',
    enlace: '/docs/proyecto-2/motor-transacciones',
    tipo: 'Proyecto práctico',
  },
  {
    numero: 'B',
    titulo: 'Simulador de Memoria RAM',
    descripcion:
      'Accede al simulador práctico de procesos y administración de memoria RAM.',
    enlace: '/docs/recursos/simulador-procesos-ram',
    tipo: 'Herramienta interactiva',
  },
  {
    numero: 'C',
    titulo: 'Glosario',
    descripcion:
      'Consulta términos y definiciones importantes para comprender los temas del curso.',
    enlace: '/docs/glosario',
    tipo: 'Material de consulta',
  },
];

function TarjetaUnidad({ unidad }) {
  return (
    <Link to={unidad.enlace} className={styles.unitCard}>
      <div className={styles.cardTop}>
        <span className={styles.cardNumber}>{unidad.numero}</span>
        <span className={styles.cardArrow} aria-hidden="true">
          ↗
        </span>
      </div>

      <div className={styles.cardContent}>
        <span className={styles.cardEyebrow}>{unidad.temas}</span>
        <Heading as="h3">{unidad.titulo}</Heading>
        <p>{unidad.descripcion}</p>
      </div>

      <div className={styles.cardFooter}>
        <span>Explorar unidad</span>
        <span aria-hidden="true">→</span>
      </div>
    </Link>
  );
}

function TarjetaRecurso({ recurso }) {
  return (
    <Link to={recurso.enlace} className={styles.resourceCard}>
      <div className={styles.resourceNumber}>{recurso.numero}</div>

      <div className={styles.resourceContent}>
        <span className={styles.resourceType}>{recurso.tipo}</span>
        <Heading as="h3">{recurso.titulo}</Heading>
        <p>{recurso.descripcion}</p>

        <span className={styles.resourceLink}>
          Abrir recurso <span aria-hidden="true">→</span>
        </span>
      </div>
    </Link>
  );
}

export default function ExplorarWiki() {
  return (
    <Layout
      title="Explorar la wiki"
      description="Consulta las cinco unidades de aprendizaje, los proyectos prácticos y los recursos de Sistemas Operativos I."
    >
      <main className={styles.explorePage}>
        <section className={`container ${styles.contentSection}`}>
          <header className={styles.sectionHeading}>
            <div>
              <span className={styles.sectionLabel}>
                CONTENIDO ACADÉMICO
              </span>
              <Heading as="h1">Unidades de aprendizaje</Heading>
            </div>

            <p>
              Selecciona una unidad para consultar sus temas y materiales.
            </p>
          </header>

          <div className={styles.unitsGrid}>
            {unidades.map((unidad) => (
              <TarjetaUnidad key={unidad.numero} unidad={unidad} />
            ))}
          </div>

          <section className={styles.resourcesSection}>
            <header className={styles.sectionHeading}>
              <div>
                <span className={styles.sectionLabel}>
                  MATERIAL COMPLEMENTARIO
                </span>
                <Heading as="h2">Proyectos y recursos</Heading>
              </div>

              <p>
                Encuentra herramientas prácticas y material de consulta.
              </p>
            </header>

            <div className={styles.resourcesGrid}>
              {recursos.map((recurso) => (
                <TarjetaRecurso
                  key={recurso.numero}
                  recurso={recurso}
                />
              ))}
            </div>
          </section>
        </section>
      </main>
    </Layout>
  );
}
