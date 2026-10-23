
import React from 'react';
import Link from '@docusaurus/Link';
import { useLocation } from '@docusaurus/router';
import { unidades } from '../unidadesNavegacion';
import styles from './styles.module.css';

export default function DocNavigation({ position = 'both' }) {
  const { pathname } = useLocation();
  const rutaActual = pathname.replace(/\/+$/, '') || '/';

  const indiceUnidad = unidades.findIndex((unidad) =>
    unidad.temas.some((tema) => rutaActual.endsWith(tema)),
  );

  const unidad = unidades[indiceUnidad];
  const indiceTema = unidad
    ? unidad.temas.findIndex((tema) => rutaActual.endsWith(tema))
    : -1;

  const mostrarSuperior = position === 'top' || position === 'both';
  const mostrarInferior = position === 'bottom' || position === 'both';

  const botonDeshabilitado = (texto, flecha) => (
    <span className={styles.disabledButton} aria-disabled="true">
      {flecha === 'izquierda' && <span aria-hidden="true">←</span>}
      {texto}
      {flecha === 'derecha' && <span aria-hidden="true">→</span>}
    </span>
  );

  if (!unidad || indiceTema === -1) {
    return mostrarSuperior ? (
      <div className={styles.navigation}>
        <Link className={styles.backButton} to="/explorar">
          <span aria-hidden="true">←</span>
          Volver a todas las unidades
        </Link>
      </div>
    ) : null;
  }

  const temaAnterior =
    indiceTema > 0 ? unidad.temas[indiceTema - 1] : null;

  const temaSiguiente =
    indiceTema < unidad.temas.length - 1
      ? unidad.temas[indiceTema + 1]
      : null;

  const unidadAnterior =
    indiceUnidad > 0 ? unidades[indiceUnidad - 1] : null;

  const unidadSiguiente =
    indiceUnidad < unidades.length - 1
      ? unidades[indiceUnidad + 1]
      : null;

  return (
    <div className={styles.navigation}>
      {mostrarSuperior && (
        <Link className={styles.backButton} to="/explorar">
          <span aria-hidden="true">←</span>
          Volver a todas las unidades
        </Link>
      )}

      {mostrarInferior && (
        <nav
          className={styles.bottomNavigation}
          aria-label="Navegación del contenido"
        >
          {temaAnterior ? (
            <Link className={styles.secondaryButton} to={temaAnterior}>
              <span aria-hidden="true">←</span>
              Tema anterior
            </Link>
          ) : (
            botonDeshabilitado('Tema anterior', 'izquierda')
          )}

          {temaSiguiente ? (
            <Link className={styles.primaryButton} to={temaSiguiente}>
              Tema siguiente
              <span aria-hidden="true">→</span>
            </Link>
          ) : (
            botonDeshabilitado('Tema siguiente', 'derecha')
          )}

          {unidadAnterior ? (
            <Link
              className={styles.secondaryButton}
              to={unidadAnterior.temas[0]}
            >
              <span aria-hidden="true">←</span>
              Unidad anterior
            </Link>
          ) : (
            botonDeshabilitado('Unidad anterior', 'izquierda')
          )}

          {unidadSiguiente ? (
            <Link
              className={styles.primaryButton}
              to={unidadSiguiente.temas[0]}
            >
              Siguiente unidad
              <span aria-hidden="true">→</span>
            </Link>
          ) : (
            botonDeshabilitado('Siguiente unidad', 'derecha')
          )}
        </nav>
      )}
    </div>
  );
}
