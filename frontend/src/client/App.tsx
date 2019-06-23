import Grid from '@material-ui/core/Grid';
import * as React from 'react';
import { hot } from 'react-hot-loader';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
// Pages
import { Header } from './components/Header';
import { FinApp } from './components/FinApp';

const AppImpl = () => (
  <BrowserRouter>
    <div>
      <Grid container spacing={24}>
        <Header />
        <Switch>
          <Route path='/finApp' component={FinApp} />
        </Switch>
      </Grid>
    </div>
  </BrowserRouter>
);

export const App = hot(module)(AppImpl);
