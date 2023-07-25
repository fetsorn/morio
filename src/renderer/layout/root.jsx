import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

  const location = useLocation();

  const [feed, setFeed] = useState({});

  const [
    initialize,
    feedXML,
    template
  ] = useStore((state) => [
    state.initialize,
    state.feed,
    state.template
  ]);

  async function parseFeed() {
    const parser = new Parser()

    if (feedXML) {
      try {
        const feed = await parser.parseString(feedXML)

        console.log(feed)

        setFeed(feed)
      } catch {
        // do nothing
      }
    }
  }

  function renderMedia(url, mimetype) {
    if (mimetype.includes('audio')) {
      return <audio controls><source src={url} type={mimetype}/></audio>
    }

    if (mimetype.includes('video')) {
      return <video controls><source src={url} type={mimetype}/></video>
    }

    return (<object data={url} type={mimetype}/>)
  }

  useEffect(() => {
    parseFeed()
  }, [feedXML, template]);

  useEffect(() => {
    initialize(location.search);
  }, []);

  return (
    <>
      <main className={styles.main}>
        <h1>{feed?.title}</h1>
        <h2>{feed?.description}</h2>

        <br/>

        <div>
          {feed?.items?.sort((a,b) => b?.pubDate?.localeCompare(a?.pubDate)).map((item) => (
            <div key={`item ${Math.random()}`}>
              <h3>{item.title}</h3>
              <p>{item.pubDate}</p>
              <p style={{whiteSpace: "pre"}}>{item.contentSnippet}</p>
              {item.enclosure ? renderMedia(item.enclosure.url, item.enclosure.type) : (<div></div>)}
              <br/>
            </div>
          ))}
        </div>

        {feed.lastBuildDate ? (<p>UPD: {feed?.lastBuildDate}</p>) : (<div></div>)}
      </main>
    </>
  );
}
