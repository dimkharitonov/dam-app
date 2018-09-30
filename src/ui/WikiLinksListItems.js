import React from 'react';

const styles = {
  list: {
    display: 'flex',
    flexFlow: 'column nowrap',
    margin: '3.5rem 1rem 1rem',
    fontSize: '0.875rem',
    lineHeight: '1.15rem',
  },
  header: {
    display: 'flex',
    flexFlow: 'row nowrap',
    flex: 1,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    margin: '0.25rem 0',
    borderTop: 'solid 2px #333',
    borderBottom: 'solid 2px #333',
  },
  row: {
    display: 'flex',
    flexFlow: 'row nowrap',
    flex: 1,
    margin: '0.125rem 0',
    borderBottom: 'solid 1px #DDD'
  },
  wideCol: {
    flex: 5,
    overflowX: 'hidden',
    whiteSpace: 'nowrap',
    padding: '0.125rem 0.25rem'
  },
  midCol: {
    flex: 3,
    padding: '0.125rem 0.25rem'
  },
  narrowCol: {
    flex: 1,
    padding: '0.125rem 0.25rem'
  }
};

export default ({items}) => (
  <div style={ styles.list }>
    <div style={ styles.header } key="headerrow">
      <div style={styles.wideCol}>title</div>
      <div style={styles.wideCol}>url</div>
      <div style={styles.narrowCol}>lang</div>
      <div style={styles.midCol}>type</div>
      <div style={styles.midCol}>Category</div>
      <div style={styles.midCol}>Location</div>
      <div style={styles.midCol}>Status</div>
    </div>

    { items.map((
      {
        articleLocale,
        articleID,
        articleTitle,
        articleType,
        articleCategory,
        articleCategoryRU,
        articleLocation,
        articleTag,
        articleStatus,
        articleCreated

    }, idx) => (
      <div style={styles.row} key={idx}>
        <div style={styles.wideCol}>{ articleTitle }</div>
        <div style={styles.wideCol}>{ articleID }</div>
        <div style={styles.narrowCol}>{ articleLocale.toUpperCase() }</div>
        <div style={styles.midCol}>{ articleType }</div>
        <div style={styles.midCol}>{ articleCategory }</div>
        <div style={styles.midCol}>{ articleLocation }</div>
        <div style={styles.midCol}>{ articleStatus }</div>
      </div>
    ))}
  </div>
);