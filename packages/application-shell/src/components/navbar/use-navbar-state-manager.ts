import type { TApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import type {
  TApplicationsMenu,
  TNavbarMenu,
} from '../../types/generated/proxy';
import type {
  TFetchProjectExtensionsNavbarQuery,
  TFetchProjectExtensionsNavbarQueryVariables,
} from '../../types/generated/settings';

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useReducer,
  useRef,
} from 'react';
import isNil from 'lodash/isNil';
import throttle from 'lodash/throttle';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import { reportErrorToSentry } from '@commercetools-frontend/sentry';
import { STORAGE_KEYS } from '../../constants';
import { useMcQuery } from '../../hooks/apollo-hooks';
import useApplicationsMenu from '../../hooks/use-applications-menu';
import FetchProjectExtensionsNavbar from './fetch-project-extensions-navbar.settings.graphql';
import nonNullable from './non-nullable';

type HookProps = {
  environment: TApplicationContext<{}>['environment'];
  DEV_ONLY__loadNavbarMenuConfig?: () => Promise<TApplicationsMenu['navBar']>;
};
type State = {
  activeItemIndex?: string;
  isExpanderVisible: boolean;
  isMenuOpen: boolean;
};
type Action =
  | { type: 'setActiveItemIndex'; payload: string }
  | { type: 'unsetActiveItemIndex' }
  | { type: 'setIsExpanderVisible' }
  | { type: 'toggleIsMenuOpen' }
  | { type: 'setIsMenuOpenAndMakeExpanderVisible'; payload: boolean }
  | { type: 'reset' };

const getInitialState = (isForcedMenuOpen: boolean | null): State => ({
  isExpanderVisible: true,
  isMenuOpen: isNil(isForcedMenuOpen) ? false : isForcedMenuOpen,
});

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'setActiveItemIndex':
      return { ...state, activeItemIndex: action.payload };
    case 'unsetActiveItemIndex':
      return { ...state, activeItemIndex: undefined };
    case 'setIsExpanderVisible':
      return { ...state, isExpanderVisible: true };
    case 'toggleIsMenuOpen':
      return { ...state, isMenuOpen: !state.isMenuOpen };
    case 'setIsMenuOpenAndMakeExpanderVisible':
      return { ...state, isExpanderVisible: true, isMenuOpen: action.payload };
    case 'reset':
      return {
        isExpanderVisible: false,
        isMenuOpen: false,
      };
    default:
      return state;
  }
};

const useNavbarStateManager = (props: HookProps) => {
  const navBarNode = useRef<HTMLElement>(null);
  const applicationsNavBarMenu = useApplicationsMenu<'navBar'>('navBar', {
    queryOptions: {
      onError: reportErrorToSentry,
    },
    environment: props.environment,
    loadMenuConfig: props.DEV_ONLY__loadNavbarMenuConfig,
  });
  const { data: projectExtensionsQuery } = useMcQuery<
    TFetchProjectExtensionsNavbarQuery,
    TFetchProjectExtensionsNavbarQueryVariables
  >(FetchProjectExtensionsNavbar, {
    skip: !props.environment.servedByProxy,
    context: {
      target: GRAPHQL_TARGETS.SETTINGS_SERVICE,
    },
    fetchPolicy: 'cache-and-network',
    onError: reportErrorToSentry,
  });
  const legacyCustomAppsMenu =
    projectExtensionsQuery &&
    projectExtensionsQuery.projectExtension &&
    projectExtensionsQuery.projectExtension.applications
      ? projectExtensionsQuery.projectExtension.applications
          .map<TNavbarMenu | undefined>((app) => {
            // Map the menu properties to match the one from the proxy schema.
            // This is to ensure that the menu object is the same from the proxy
            // config and the custom apps config, thus allowing them to be
            // concatenated and rendered the same way.
            if (!app.navbarMenu) return;
            return {
              key: app.navbarMenu.key,
              uriPath: app.navbarMenu.uriPath,
              labelAllLocales: app.navbarMenu.labelAllLocales || [],
              icon: app.navbarMenu.icon,
              featureToggle: app.navbarMenu.featureToggle,
              permissions: app.navbarMenu.permissions as string[],
              submenu: (app.navbarMenu.submenu || []).map((menu) => ({
                key: menu.key,
                uriPath: menu.uriPath,
                labelAllLocales: menu.labelAllLocales || [],
                featureToggle: menu.featureToggle,
                permissions: menu.permissions as string[],
                menuVisibility: undefined,
                actionRights: undefined,
                dataFences: undefined,
              })),
              menuVisibility: undefined,
              actionRights: undefined,
              dataFences: undefined,
              shouldRenderDivider: false,
            };
          })
          .filter(nonNullable)
      : [];
  const organizationCustomAppsMenu =
    projectExtensionsQuery &&
    projectExtensionsQuery.projectExtension &&
    projectExtensionsQuery.projectExtension.installedApplications
      ? projectExtensionsQuery.projectExtension.installedApplications
          .map<TNavbarMenu | undefined>((installedApplication) => {
            const application = installedApplication.application;
            // Map the menu properties to match the one from the proxy schema.
            // This is to ensure that the menu object is the same from the proxy
            // config and the custom apps config, thus allowing them to be
            // concatenated and rendered the same way.
            if (!application.menuLinks) return;
            return {
              key: application.id,
              uriPath: application.entryPointUriPath,
              labelAllLocales: application.menuLinks.labelAllLocales || [],
              icon: application.menuLinks.icon,
              permissions: application.menuLinks.permissions as string[],
              defaultLabel: application.menuLinks.defaultLabel,
              featureToggle: undefined,
              menuVisibility: undefined,
              actionRights: undefined,
              dataFences: undefined,
              shouldRenderDivider: false,
              submenu: (application.menuLinks.submenuLinks || []).map(
                (submenuLink) => ({
                  key: submenuLink.id,
                  uriPath: submenuLink.uriPath,
                  labelAllLocales: submenuLink.labelAllLocales || [],
                  permissions: submenuLink.permissions as string[],
                  defaultLabel: submenuLink.defaultLabel,
                  featureToggle: undefined,
                  menuVisibility: undefined,
                  actionRights: undefined,
                  dataFences: undefined,
                })
              ),
            };
          })
          .filter(nonNullable)
      : [];
  const cachedIsForcedMenuOpen = window.localStorage.getItem(
    STORAGE_KEYS.IS_FORCED_MENU_OPEN
  );
  const isForcedMenuOpen = isNil(cachedIsForcedMenuOpen)
    ? null
    : (JSON.parse(cachedIsForcedMenuOpen) as boolean);

  const [state, dispatch] = useReducer<
    (prevState: State, action: Action) => State
  >(reducer, getInitialState(isForcedMenuOpen));

  const checkSize = useCallback(
    throttle(() => {
      const shouldOpen = window.innerWidth > 1024;
      const canExpandMenu = window.innerWidth > 918;

      // If the screen is small, we should always keep the menu closed,
      // no matter the settings.
      if (!canExpandMenu) {
        if (state.isMenuOpen || state.isExpanderVisible) {
          // and resets the state to avoid conflicts
          dispatch({ type: 'reset' });
        }
      } else if (canExpandMenu && state.isExpanderVisible !== true) {
        dispatch({ type: 'setIsExpanderVisible' });
      } else if (isNil(isForcedMenuOpen) && state.isMenuOpen !== shouldOpen) {
        // User has no settings yet (this.props.isForcedMenuOpen === null)
        // We check the viewport size and:
        // - if screen is big, we open the menu
        // - if screen is small we close it
        dispatch({
          type: 'setIsMenuOpenAndMakeExpanderVisible',
          payload: shouldOpen,
        });
      } else if (
        !isNil(isForcedMenuOpen) &&
        state.isMenuOpen !== isForcedMenuOpen
      ) {
        // User has setting, we should use that and ignore the screen size.
        // Note: if viewport size is small, we should ignore the user settings.
        dispatch({
          type: 'setIsMenuOpenAndMakeExpanderVisible',
          payload: isForcedMenuOpen,
        });
      }
    }, 100),
    [isForcedMenuOpen, state.isExpanderVisible, state.isMenuOpen]
  );

  const shouldCloseMenuFly = useCallback<
    (e: React.MouseEvent<HTMLElement> | MouseEvent) => void
  >(
    (event) => {
      if (
        navBarNode &&
        navBarNode.current &&
        !navBarNode.current.contains(event.target as Node) &&
        !state.isMenuOpen
      )
        dispatch({ type: 'unsetActiveItemIndex' });
      else if (event.type === 'mouseleave')
        dispatch({ type: 'unsetActiveItemIndex' });
    },
    [state.isMenuOpen]
  );

  useEffect(() => {
    window.addEventListener('resize', checkSize);
    window.addEventListener('click', shouldCloseMenuFly, true);

    return () => {
      window.removeEventListener('resize', checkSize);
      window.removeEventListener('click', shouldCloseMenuFly, true);
    };
  }, [checkSize, shouldCloseMenuFly]);

  useEffect(() => {
    checkSize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // <-- run this only once!!

  useLayoutEffect(() => {
    if (state.isMenuOpen) document.body.classList.add('body__menu-open');
    if (!state.isMenuOpen) document.body.classList.remove('body__menu-open');
  }, [state.isMenuOpen]);

  const handleToggleItem = useCallback(
    (nextActiveItemIndex: string) => {
      if (state.activeItemIndex !== nextActiveItemIndex)
        dispatch({
          type: 'setActiveItemIndex',
          payload: nextActiveItemIndex,
        });
    },
    [state.activeItemIndex]
  );

  const handleToggleMenu = useCallback(() => {
    if (state.isMenuOpen && state.activeItemIndex) {
      dispatch({ type: 'unsetActiveItemIndex' });
    }
    dispatch({ type: 'toggleIsMenuOpen' });
    // Synchronize the menu state with local storage.
    window.localStorage.setItem(
      STORAGE_KEYS.IS_FORCED_MENU_OPEN,
      String(!state.isMenuOpen)
    );
  }, [state.activeItemIndex, state.isMenuOpen]);

  const allApplicationNavbarMenu = (applicationsNavBarMenu || [])
    .concat(legacyCustomAppsMenu)
    .concat(organizationCustomAppsMenu);

  return {
    ...state,
    navBarNode,
    handleToggleItem,
    handleToggleMenu,
    shouldCloseMenuFly,
    allApplicationNavbarMenu,
  };
};

export default useNavbarStateManager;
