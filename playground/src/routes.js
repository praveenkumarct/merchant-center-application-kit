import { useCallback } from 'react';
import { Route, Switch, useRouteMatch, useHistory } from 'react-router-dom';
import { PageUnauthorized } from '@commercetools-frontend/application-components';
import { InjectReducers } from '@commercetools-frontend/application-shell';
import { useIsAuthorized } from '@commercetools-frontend/permissions';
import StateMachinesList from './components/state-machines-list';
import StateMachinesDetails from './components/state-machines-details';
import EchoServer from './components/echo-server';
import reducers from './reducers';
import { PERMISSIONS } from './constants';

const ApplicationRoutes = () => {
  const match = useRouteMatch();
  const history = useHistory();
  const canViewStateMachines = useIsAuthorized({
    demandedPermissions: [PERMISSIONS.ViewPlaygroundStateMachines],
  });
  const goToStateMachineDetail = useCallback(
    (id) => {
      history.push(`${match.url}/${id}`);
    },
    [history, match.url]
  );
  return (
    <InjectReducers id="state-machines" reducers={reducers}>
      <Switch>
        <Route path={`${match.path}/echo-server`}>
          <EchoServer />
        </Route>
        <Route
          path={`${match.path}/:id`}
          render={(routerProps) => {
            if (!canViewStateMachines) {
              return <PageUnauthorized />;
            }
            return (
              <StateMachinesDetails
                id={routerProps.match.params.id}
                projectKey={routerProps.match.params.projectKey}
                backToListPath={match.url}
              />
            );
          }}
        />
        <Route
          render={() => {
            if (!canViewStateMachines) {
              return <PageUnauthorized />;
            }
            return (
              <StateMachinesList
                goToStateMachineDetail={goToStateMachineDetail}
              />
            );
          }}
        />
      </Switch>
    </InjectReducers>
  );
};
ApplicationRoutes.displayName = 'ApplicationRoutes';

export default ApplicationRoutes;
