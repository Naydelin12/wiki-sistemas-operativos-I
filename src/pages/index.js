import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();

  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>

        <p className="hero__subtitle">
          {siteConfig.tagline}
        </p>

        <div>
          <Link
            className="button button--secondary button--lg"
            to="/docs/unidad-1/introduccion"
          >
            Explorar la Wiki 📚
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();

  return (
    <Layout
      title={siteConfig.title}
      description="Base de conocimiento de Sistemas Operativos l"
    >
      <HomepageHeader />

      <main>
        <section className="container margin-vert--lg">
          <div className="text--center">
            <Heading as="h2">
              Bienvenido a nuestra Wiki
            </Heading>

            <p>
              En este espacio se reúnen los principales conceptos,
              explicaciones y recursos del curso de Sistemas Operativos l.
            </p>
          </div>
        </section>
      </main>
    </Layout>
  );
}
