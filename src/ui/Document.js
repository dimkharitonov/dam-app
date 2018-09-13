import React from 'react';
import wu from "../lib/WikiUtils";

export default ({fileName, fileType, origin, extension, title, categories, coordinates, summary, relatedImages, created}) => {

  const { lat, lon } = coordinates ? JSON.parse(coordinates) : {};

  const formatCoordiates = (lat, lon) => {
    return (lat && lon)
      ? <a href={`https://www.google.com/maps/@${lat},${lon},13z`} target="_blank" rel="noopener noreferrer">
        {lat},{lon}
      </a>
      : '-';
  };

  const reduceTextByWordsCount = (text, count) => {
    const words = (text && text.split(' ')) || [];
    return words.slice(0, Math.min(count, words.length)).join(' ') + (count < words.length ? '...' : '');
  };

  return(
    <div className="assets-list--asset" key={fileName}>
      <ul className="asset--meta">
        <li className="meta--title">{title}</li>
        <li className="meta--type">{ origin && wu.getLanguage(origin)}</li>
        <li className="meta--file">{fileName}{extension}</li>
        <li className="meta--coordinates">{ formatCoordiates(lat, lon) }</li>
        <li className="meta--type">{ Array.isArray(relatedImages) ? relatedImages.length : '-' }</li>
        <li className="meta--type">{ new Date(created).toLocaleDateString() }</li>
      </ul>
      <div className="asset--summary">{ reduceTextByWordsCount(summary, 18) }</div>
    </div>
  );
}