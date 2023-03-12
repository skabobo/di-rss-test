import React, { useState, useEffect } from "react";
import "./LatestNews.css";

const LatestNews = () => {
    const [newsItems, setNewsItems] = useState([]);
    const [loading, setLoading] = useState(false);
  
    useEffect(() => {
      setLoading(true);
  
      fetch("https://www.di.se/rss")
        .then((response) => response.text())
        .then((xmlText) => {
          const parser = new DOMParser();
          const xml = parser.parseFromString(xmlText, "text/xml");

          const items = xml.querySelectorAll("item");

          const sortedItems = Array.from(items)
            .sort((a, b) => new Date(b.querySelector("pubDate").textContent) - new Date(a.querySelector("pubDate").textContent))
            .slice(0, 10);

          const parsedItems = sortedItems.map((item) => ({
            title: item.querySelector("title").textContent,
            link: item.querySelector("link").textContent,
            pubDate: new Date(item.querySelector("pubDate").textContent),
            creator: item.getElementsByTagName("dc:creator")[0]?.textContent ?? "",
            contentSnippet: item.querySelector("description").textContent,
            image: item.getElementsByTagName("media:content")[0]?.getAttribute("url") ?? ""
          }));
  
          setNewsItems(parsedItems);
        })
        .catch((error) => console.error(error))
        .finally(() => setLoading(false));
    }, []);
  
    const formatDate = (date) => {
      const options = {
        hour: "numeric",
        minute: "numeric",
        hour12: false,
        timeZone: "Europe/Stockholm"
      };
      return date.toLocaleTimeString("sv-SE", options);
    };
  
    return (
      <div className="site-body">
        <h1 className="main-heading">Senaste nytt från DI</h1>
        {loading ? <p>Laddar in senaste nytt...</p> : 
        <div>
          <ul className="news-list-wrapper">
            {newsItems.map((item, index) => (
              <li key={index} className="news-item">
                <div className="item-left">
                  <time>{formatDate(item.pubDate)}</time>
                  <p>{item.creator}</p>
                </div>
                <div className="item-right">
                  <div className="item-content-wrapper">
                    <a href={item.link} target="_blank">
                      <h2>{item.title}</h2>
                      <p>{item.contentSnippet}</p>
                    </a>
                  </div>
                  <div className="item-image">
                    <img src={item.image}></img>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>}
      </div>
    );
}

export default LatestNews