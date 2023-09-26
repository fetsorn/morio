import React, { useState, useEffect } from 'react';
import {
  HashRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import Parser from 'rss-parser';
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
  const location = useLocation();

  const [feed, setFeed] = useState({});

  const [
    initialize,
    feedXML,
    template,
    postID,
  ] = useStore((state) => [
    state.initialize,
    state.feedXML,
    state.template,
    state.postID,
  ]);

  async function parseFeed() {
    const parser = new Parser();

    if (feedXML) {
      try {
        const feedNew = await parser.parseString(feedXML);

        setFeed(feedNew);
      } catch {
        // do nothing
      }
    }
  }

  function renderMedia(url, mimetype) {
    if (mimetype.includes('audio')) {
      return <audio controls><source src={url} type={mimetype} /></audio>;
    }

    if (mimetype.includes('video')) {
      return <video controls><source src={url} type={mimetype} /></video>;
    }

    if (mimetype.includes('image')) {
      return <img src={url} />;
    }

    return (<object data={url} type={mimetype} />);
  }

  useEffect(() => {
    parseFeed();
  }, [feedXML, template]);

  useEffect(() => {
    initialize(location.search);
  }, []);

  useEffect(() => {
    if (postID) {
      const el = document.getElementById(postID);

      if (el) {
        window.scrollTo({ top: el.offsetTop, behavior: 'smooth' });
      }
    }
  });

  return (
    <main className={styles.main}>
      <h1>{feed?.title}</h1>
      <h2>{feed?.description}</h2>

      <br />

      <div>
        {feed?.items?.sort((a, b) => b?.pubDate?.localeCompare(a?.pubDate)).map((item) => (
          <div id={item.title} key={`item ${Math.random()}`}>
            <h3>{item.title}</h3>
            <p>{item.pubDate}</p>
            <p style={{ whiteSpace: 'pre' }}>{item.contentSnippet}</p>
            {item.enclosure ? renderMedia(item.enclosure.url, item.enclosure.type) : (<div />)}
            <br />
          </div>
        ))}
      </div>

      {feed.lastBuildDate ? (
        <p>
          UPD:
          {feed?.lastBuildDate}
        </p>
      ) : (<div />)}
    </main>
  );
}
