import React from 'react';
import LoadingButton from './LoadingButton';

import TextField from "@material-ui/core/TextField/TextField";
import Button from "@material-ui/core/Button/Button";
import Typography from '@material-ui/core/Typography';

const styles = {
  buttons: {
    marginRight: '24px'
  },
  message: {
    marginTop: '12px'
  },
  dataTable: {
    marginBottom: '24px'
  },
  multilineText: {
    width: '100%'
  }
};

export default ({handleSubmit, handleChange, data, isWorking, message, handleCancel}) => (
  <form onSubmit={handleSubmit}>
    <TextField
      id="dataToImport"
      name="dataToImport"
      label="data in CSV format"
      multiline
      value={data}
      onChange={handleChange}
      margin="normal"
      style={styles.multilineText}
    />

    <LoadingButton
      onClick={handleSubmit}
      color={'primary'}
      className="button"
      disabled={!data || isWorking}
      text="Parse Data"
      loadingText="Parsing..."
      isLoading={isWorking}
      style={styles.buttons}
    />
    <Button onClick={handleCancel} style={styles.buttons}>Cancel</Button>
    <Typography style={styles.message} variant={"body2"}>
      {message}
    </Typography>
  </form>
);

/*
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
    <div className="csv-import-form--message"></div>
 */