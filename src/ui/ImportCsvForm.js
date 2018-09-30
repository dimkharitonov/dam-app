import React from 'react';
import './ImportCsvForm.css';

export default ({handleSubmit, handleChange, data}) => (
  <div className="csv-import-form">
    <form onSubmit={handleSubmit}>
      <div className="form-field">
        <label htmlFor="dataToImport">CSV Data</label>
        <textarea
          id="dataToImport"
          name="dataToImport"
          onChange={handleChange}
          value={data}
        >
          </textarea>
      </div>
      <button type="submit" disabled={!data}>Parse Data</button>
    </form>
  </div>
);