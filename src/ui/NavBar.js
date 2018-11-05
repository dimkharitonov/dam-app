import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import ToolBar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

const styles = {
  rightSide: {
    textAlign: 'right'
  },
  menu: {
    marginLeft: '24px'
  }
};

const NavBar = ({handleLogout, isAuthenticated}) => (
  <div>
    <AppBar position="fixed">
      <ToolBar>
        <Typography variant="h6" color="inherit">
          WAM
        </Typography>
        {
          isAuthenticated
            ?
            <Grid container spacing={16}>
              <Grid item sm={8}>
                <div style={styles.menu}>
                  <Button color="inherit" size={"small"} href="/#">Assets</Button>
                  <Button color="inherit" size={"small"} href="/#/wikilinks">Wiki Links</Button>
                </div>
              </Grid>
              <Grid item sm={4} style={styles.rightSide}>
                <Button color="inherit" size={"small"} onClick={handleLogout} href={'/login'}>Logout</Button>
              </Grid>
            </Grid>
            :
            <div></div>
        }
      </ToolBar>
    </AppBar>
  </div>
);

export default NavBar;