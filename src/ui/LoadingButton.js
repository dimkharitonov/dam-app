import React from "react";
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = {
  progressCircle: {
    marginRight: '12px'
  }
};

export default (
  {
    isLoading,
    text,
    loadingText,
    className = "",
    color = 'inherit',
    disabled = false,
    ...props
  }
) =>
  <Button
    variant={"contained"}
    className={`LoadingButton ${className}`}
    disabled={disabled || isLoading}
    color={color}
    {...props}
  >
    {isLoading && <CircularProgress size={ 12 } color={color} style={styles.progressCircle}/> }
    {!isLoading ? text : loadingText}
  </Button>;