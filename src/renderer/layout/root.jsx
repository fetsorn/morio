import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  HashRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import { useStore } from '@/store/index.js';
import styles from './root.module.css';

export function Root() {
  return (
    <Router>
      <Routes>
        <Route index element={<Page />} />
      </Routes>
    </Router>
  );
}

function Page() {
  const { t } = useTranslation();

  const location = useLocation();

  const [html, setHTML] = useState("<div>no feed</div>");

  const [
    initialize,
    feed,
    template
  ] = useStore((state) => [
    state.initialize,
    state.feed,
    state.template
  ]);

  useEffect(() => {
    setHTML(feed)
  }, [feed, template]);

  useEffect(() => {
    initialize(location.search);
  }, []);

  return (
    <>
      <main className={styles.main}>
        <p>running in {__BUILD_MODE__ === 'electron' ? "electron" : "browser"}</p>

        <div
          className={styles.feed}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </main>
    </>
  );
}
