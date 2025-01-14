import { actions as sdkActions } from '@commercetools-frontend/sdk';
import { MC_API_PROXY_TARGETS } from '@commercetools-frontend/constants';
import { actionTypes } from '../../reducers/cache';

export const setStateMachines = (payload) => ({
  type: actionTypes.SET_STATE_MACHINES,
  payload,
});

export const fetchStateMachines = (requestOptions) =>
  sdkActions.get({
    mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
    service: 'states',
    options: requestOptions,
  });
