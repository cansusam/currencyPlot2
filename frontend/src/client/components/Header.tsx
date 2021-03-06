import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import * as React from 'react';
import { Link } from 'react-router-dom';

export const Header: React.FunctionComponent = () => (
  <AppBar position='static' color='default'>
    <Toolbar>
      <Button color='primary' component={(p: any) => <Link to='/finApp' {...p} />}>
        FinApp
      </Button>
    </Toolbar>
  </AppBar>
);
