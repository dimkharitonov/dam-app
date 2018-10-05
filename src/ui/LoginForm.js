import React from 'react';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import LoadingButton from "./LoadingButton";

const styles = {
  formField: {
    width: '100%'
  },
  errorMessage: {
    height: '48px',
    marginTop: '24px'
  },
  form: {
    marginTop: '160px'
  }
};

const LoginForm = ({error, isNotValid, isLoading, handleSubmit, handleChange}) => (
  <div style={styles.form}>
    <Grid container>
      <Grid item sm={3}/>
      <Grid item sm={6}>
        <form onSubmit={handleSubmit}>
          <Typography variant={"title"}>
            Restricted Area
          </Typography>
          <TextField
            id="email"
            name="email"
            required
            label="Email"
            margin="normal"
            style={styles.formField}
            onChange={handleChange}
          />
          <TextField
            id="password"
            name="password"
            required
            type="password"
            label="Password"
            margin="normal"
            style={styles.formField}
            onChange={handleChange}
          />
          <LoadingButton
            type="submit"
            className="button"
            disabled={isNotValid}
            text="Login"
            loadingText="checking..."
            isLoading={isLoading}
          />
          <div style={styles.errorMessage}>
            <Typography color={"secondary"}>
              {error}
            </Typography>
          </div>
        </form>
      </Grid>
    </Grid>
  </div>
);


export default LoginForm;