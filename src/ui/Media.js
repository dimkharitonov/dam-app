import React from 'react';
import { S3Image } from 'aws-amplify-react'

function   getImageKey(file, extension) {
  const filePrefix = ['.jpg','.jpeg','.png'].reduce((acc, val) =>  acc || val === extension.toLowerCase() , false)
    ? 'thumbnails/240/'
    : 'media/';

  const imageKey = [filePrefix, file, extension].join('');
  return imageKey;
};

export default ({fileName, extension, title, created}) =>
  <div className="media-cards--card" key={fileName}>
    <div className="card--info">
      <h2 className="info--title">{title}</h2>
      <p className="info--details">File {fileName}{extension}</p>
      <p className="info--details">Created { new Date(created).toLocaleDateString() }</p>
    </div>
    <div className="card--preview">
      <S3Image imgKey={getImageKey(fileName, extension)} />
    </div>
  </div>
;
