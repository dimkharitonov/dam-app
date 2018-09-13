import React from 'react';

export default ({name, data}) =>
  <div className="taxonomy">
    <div className="taxonomy--title">
      {name}
    </div>
    <ul className="taxonomy--entries">
    {
      Object.keys(data)
        .sort((a, b) => data[b] - data[a])
        .map((item, idx) => <li className="taxonomy--entry" key={idx}><span className="entry--name">{item}</span> <span className="entry--value">{data[item]}</span></li>)
    }
    </ul>
  </div>