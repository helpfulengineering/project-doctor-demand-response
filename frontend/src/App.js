import GAListener from 'components/GAListener';
import { EmptyLayout, LayoutRoute, MainLayout } from 'components/Layout';
import PageSpinner from 'components/PageSpinner';
import React from 'react';
import componentQueries from 'react-component-queries';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import axios from "axios";
import './styles/reduction.scss';
import SignupView from './views/SignupView';
import LoginView from './views/LoginView';
import UpdatePasswordView from './views/UpdatePasswordView';
import UpdatePasswordRequestView from './views/UpdatePasswordRequestView';
import ActivationView from './views/ActivationView';
import SystemDownView from './views/SystemDownView';

import PrivateRoute from './components/PrivateRoute';

const AlertPage = React.lazy(() => import('pages/AlertPage'));
const BadgePage = React.lazy(() => import('pages/BadgePage'));
const ButtonGroupPage = React.lazy(() => import('pages/ButtonGroupPage'));
const ButtonPage = React.lazy(() => import('pages/ButtonPage'));
const CardPage = React.lazy(() => import('pages/CardPage'));
const ChartPage = React.lazy(() => import('pages/ChartPage'));
const DashboardPage = React.lazy(() => import('pages/DashboardPage'));
const DropdownPage = React.lazy(() => import('pages/DropdownPage'));
const FormPage = React.lazy(() => import('pages/FormPage'));
const InputGroupPage = React.lazy(() => import('pages/InputGroupPage'));
const ModalPage = React.lazy(() => import('pages/ModalPage'));
const ProgressPage = React.lazy(() => import('pages/ProgressPage'));
const TablePage = React.lazy(() => import('pages/TablePage'));
const TypographyPage = React.lazy(() => import('pages/TypographyPage'));
const WidgetPage = React.lazy(() => import('pages/WidgetPage'));

const HomeView = React.lazy(() => import('views/HomeView'));
const RequestAndInventoryView = React.lazy(() => import('views/RequestAndInventoryView'));

const getBasename = () => {
  return `/${process.env.PUBLIC_URL.split('/').pop()}`;
};

class App extends React.Component {

  componentDidMount() {
    axios.defaults.headers.common['Authorization'] = localStorage.getItem('access_token');
  }
  render() {
    return (
      <BrowserRouter basename={getBasename()}>
        <GAListener>
          <Switch>
            <LayoutRoute
              exact
              path="/login"
              layout={EmptyLayout}
              component={props => (
                <LoginView {...props}  />
              )}
            />
            <LayoutRoute
              exact
              path="/updatePasswordRequest"
              layout={EmptyLayout}
              component={props => (
                <UpdatePasswordRequestView {...props}  />
              )}
            />
            <LayoutRoute
              exact
              path="/updatePassword"
              layout={EmptyLayout}
              component={props => (
                <UpdatePasswordView {...props}  />
              )}
            />
            
            <LayoutRoute
              exact
              path="/signup"
              layout={EmptyLayout}
              component={props => (
                <SignupView {...props} />
              )}
            />

            <LayoutRoute
              exact
              path="/activate"
              layout={EmptyLayout}
              component={props => (
                <ActivationView {...props} />
              )}
            />

            <LayoutRoute
              exact
              path="/systemDown"
              layout={EmptyLayout}
              component={props => (
                <SystemDownView {...props} />
              )}
            />

            <MainLayout breakpoint={this.props.breakpoint}>
              <React.Suspense fallback={<PageSpinner />}>
                <PrivateRoute exact path="/" component={HomeView} />
                <PrivateRoute exact path="/tempdb" component={DashboardPage} />
                <PrivateRoute exact path="/request-inventory" component={RequestAndInventoryView} />
                <PrivateRoute exact path="/buttons" component={ButtonPage} />
                <PrivateRoute exact path="/cards" component={CardPage} />
                <Route exact path="/widgets" component={WidgetPage} />
                <Route exact path="/typography" component={TypographyPage} />
                <Route exact path="/alerts" component={AlertPage} />
                <Route exact path="/tables" component={TablePage} />
                <Route exact path="/badges" component={BadgePage} />
                <Route
                  exact
                  path="/button-groups"
                  component={ButtonGroupPage}
                />
                <Route exact path="/dropdowns" component={DropdownPage} />
                <Route exact path="/progress" component={ProgressPage} />
                <Route exact path="/modals" component={ModalPage} />
                <Route exact path="/forms" component={FormPage} />
                <Route exact path="/input-groups" component={InputGroupPage} />
                <Route exact path="/charts" component={ChartPage} />
              </React.Suspense>
            </MainLayout>
            <Redirect to="/" />
          </Switch>
        </GAListener>
      </BrowserRouter>
    );
  }
}

const query = ({ width }) => {
  if (width < 575) {
    return { breakpoint: 'xs' };
  }

  if (576 < width && width < 767) {
    return { breakpoint: 'sm' };
  }

  if (768 < width && width < 991) {
    return { breakpoint: 'md' };
  }

  if (992 < width && width < 1199) {
    return { breakpoint: 'lg' };
  }

  if (width > 1200) {
    return { breakpoint: 'xl' };
  }

  return { breakpoint: 'xs' };
};

export default componentQueries(query)(App);
