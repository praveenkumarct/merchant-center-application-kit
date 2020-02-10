import React from 'react';
import { ApolloError } from 'apollo-client';
import { useQuery } from 'react-apollo';
import {
  GRAPHQL_TARGETS,
  TGraphQLTargets,
} from '@commercetools-frontend/constants';
import { reportErrorToSentry } from '@commercetools-frontend/sentry';
import {
  TFetchLoggedInUserQuery,
  TFetchLoggedInUserQueryVariables,
} from '../../types/generated/mc';
import LoggedInUserQuery from './fetch-user.mc.graphql';

type RenderFnArgs = {
  isLoading: boolean;
  error?: ApolloError;
  user: TFetchLoggedInUserQuery['user'];
};
type Props = {
  children: (args: RenderFnArgs) => React.ReactNode;
};

const FetchUser = (props: Props) => {
  const { loading, data, error } = useQuery<
    TFetchLoggedInUserQuery,
    TFetchLoggedInUserQueryVariables & { target: TGraphQLTargets }
  >(LoggedInUserQuery, {
    onError: reportErrorToSentry,
    variables: { target: GRAPHQL_TARGETS.MERCHANT_CENTER_BACKEND },
  });
  return (
    <>
      {props.children({ isLoading: loading, user: data && data.user, error })}
    </>
  );
};
FetchUser.displayName = 'FetchUser';

export default FetchUser;