/* eslint-disable prettier/prettier */
// This file was automatically generated by json-schema-to-typescript.
// DO NOT MODIFY IT BY HAND. Instead, modify the source schema.json file.

export type EnvVariablePlaceholder = string;
export type CspDirective = string[];

export interface JSONSchemaForCustomApplicationConfigurationFiles {
  /**
   * The ID of the Custom Application (when you register the application in the Merchant Center)
   */
  id?: string;
  /**
   * The name of the Custom Application
   */
  name: string;
  /**
   * The unique route path of the Custom Application. This is the identifier that the Merchant Center Proxy uses to match the HTTP request and to forward it to the Custom Application URL. This value also needs to be used in the application client side routes. The value must be the same as the `navbarMenu.uriPath` in the `menu.json` and the application route path when registering the Custom Application. For example, if the Custom Application should be served at the route `/:projectKey/avengers`, the `entryPointUriPath` must be set to `avengers` and the same for the application routes.
   */
  entryPointUriPath: string;
  /**
   * The cloud identifier where the Custom Application is running. This value is used to derive the Merchant Center API URL. Alternatively you can use the `mcApiUrl` property.
   */
  cloudIdentifier: ('gcp-au' | 'gcp-eu' | 'gcp-us' | 'aws-fra' | 'aws-ohio') | EnvVariablePlaceholder;
  /**
   * The URL of the Merchant Center API. We usually recommend to use the `cloudIdentifier` option to avoid possible typos.
   */
  mcApiUrl?: string;
  /**
   * This is an object of keys that represents different environments (for example `production`). The environment used depends on the environment variable `MC_APP_ENV`. If `MC_APP_ENV` isn't set then `NODE_ENV` will be used. If neither is set, it defaults to `development`
   */
  env: {
    /**
     * Configuration for production only
     */
    production: {
      /**
       * The URL where the Custom Application is hosted
       */
      url: string;
      /**
       * The URL where the Custom Application static assets are hosted, like an external CDN. If the static assets are hosted alongside the Custom Application, you can omit this option and the Custom Application URL will be used instead.
       */
      cdnUrl?: string;
    };
  };
  /**
   * Additional environment values unique to your Custom Application that are injected in the application context.
   */
  additionalEnv?: {
    [k: string]: unknown;
  };
  /**
   * Configuration for HTTP headers
   */
  headers?: {
    /**
     * Configuration for the HTTP Content-Security-Policy header (https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy)
     */
    csp: {
      'connect-src': CspDirective;
      'font-src'?: CspDirective;
      'img-src'?: CspDirective;
      'script-src'?: CspDirective;
      'style-src'?: CspDirective;
    };
    /**
     * Configuration for the HTTP Feature-Policy header (https://developer.mozilla.org/en-US/docs/Web/HTTP/Feature_Policy/Using_Feature_Policy)
     */
    featurePolicies?: {
      [k: string]: unknown;
    };
  };
}