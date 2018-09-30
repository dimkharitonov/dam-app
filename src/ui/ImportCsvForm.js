import React from 'react';
import LoadingButton from './LoadingButton';
import './ImportCsvForm.css';

export default ({handleSubmit, handleChange, data, isWorking, message}) => (
  <div className="csv-import-form">
    <form>
      <div className="form-field">
        <label htmlFor="dataToImport">CSV Data</label>
        <textarea
          id="dataToImport"
          name="dataToImport"
          onChange={handleChange}
          value={data}
          disabled={isWorking}>
          </textarea>
      </div>
      <LoadingButton
        onClick={handleSubmit}
        className="button"
        disabled={!data || isWorking}
        text="Parse Data"
        loadingText="Parsing..."
        isLoading={isWorking}
      />
    </form>
    <div className="csv-import-form--message">{message}</div>
  </div>
);