
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();

  return (
    <header className={styles.heroBanner}>
      <div className={clsx('container', styles.heroContainer)}>
        <div className={styles.heroContent}>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowLine} />
            BASE DE CONOCIMIENTO ACADÉMICA
          </div>

          <Heading as="h1" className={styles.heroTitle}>
            {siteConfig.title}
            <span className={styles.titleAccent}>.</span>
          </Heading>

          <p className={styles.heroDescription}>
            Conceptos, temas y recursos del curso de Sistemas Operativos I,
            organizados en un solo lugar para facilitar el estudio y la consulta.
          </p>

          <div className={styles.heroActions}>
            <Link
              className={styles.primaryButton}
              to="/explorar"
            >
              Explorar la wiki
              <span className={styles.buttonArrow} aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        </div>

        <div className={styles.heroIndex} aria-hidden="true">
          <span>SO1</span>
          <span className={styles.indexDivider} />
          <span>RECURSOS ACADÉMICOS</span>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();

  return (
    <Layout
      title="Inicio"
      description="Wiki académica del curso de Sistemas Operativos I"
      noFooter
    >
      <HomepageHeader />

      <main className={styles.homeMain}>
        <section className={clsx('container', styles.introSection)}>
          <div className={styles.introHeading}>
            <span className={styles.sectionEyebrow}>
              SOBRE ESTA WIKI
            </span>

            <Heading as="h2">
              Fundamentos de
              <br />
              <span>los sistemas operativos.</span>
            </Heading>
          </div>

          <div className={styles.introBody}>
            <p>
              Aquí encontrarás los temas del curso, explicaciones y recursos
              que puedes consultar para repasar los contenidos de Sistemas
              Operativos I.
            </p>

            <Link
              className={styles.textLink}
              to="/explorar"
            >
              Comenzar el recorrido
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        <div className={styles.bottomRule} />
      </main>
    </Layout>
  );
}
