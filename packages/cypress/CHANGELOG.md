# @commercetools-frontend/cypress

## 20.10.1

### Patch Changes

- [#2348](https://github.com/commercetools/merchant-center-application-kit/pull/2348) [`3247e604`](https://github.com/commercetools/merchant-center-application-kit/commit/3247e6048533a72c9f64cd316621dd51471cd1a8) Thanks [@renovate](https://github.com/apps/renovate)! - Update dependencies

* [#2342](https://github.com/commercetools/merchant-center-application-kit/pull/2342) [`91ba0910`](https://github.com/commercetools/merchant-center-application-kit/commit/91ba0910ce09ab7f3552fd381983724a63d7243d) Thanks [@renovate](https://github.com/apps/renovate)! - chore(deps): update all dependencies

- [#2308](https://github.com/commercetools/merchant-center-application-kit/pull/2308) [`c0a0329a`](https://github.com/commercetools/merchant-center-application-kit/commit/c0a0329ab5fced30bf7b3d118e5a004ff3bc508c) Thanks [@renovate](https://github.com/apps/renovate)! - Update dependency cypress to v8 while adding support to cypress v8 as a peer dependency.

* [#2356](https://github.com/commercetools/merchant-center-application-kit/pull/2356) [`e34fe076`](https://github.com/commercetools/merchant-center-application-kit/commit/e34fe076aab6681cdcc54622d84123f2c22020e6) Thanks [@ByronDWall](https://github.com/ByronDWall)! - set node version to 16.8 in nvmrc to avoid a bug in node/v8

* Updated dependencies [[`3247e604`](https://github.com/commercetools/merchant-center-application-kit/commit/3247e6048533a72c9f64cd316621dd51471cd1a8), [`91ba0910`](https://github.com/commercetools/merchant-center-application-kit/commit/91ba0910ce09ab7f3552fd381983724a63d7243d), [`e34fe076`](https://github.com/commercetools/merchant-center-application-kit/commit/e34fe076aab6681cdcc54622d84123f2c22020e6)]:
  - @commercetools-frontend/application-config@20.10.1

## 20.9.4

### Patch Changes

- Updated dependencies [[`d7b712e4`](https://github.com/commercetools/merchant-center-application-kit/commit/d7b712e44e0dbd7c3d477f08493e3e0004817d79), [`8c6c13a7`](https://github.com/commercetools/merchant-center-application-kit/commit/8c6c13a79f91ea9476983e12c48ae834ca4640c1)]:
  - @commercetools-frontend/application-config@20.9.4

## 20.9.3

### Patch Changes

- [#2318](https://github.com/commercetools/merchant-center-application-kit/pull/2318) [`83f2add2`](https://github.com/commercetools/merchant-center-application-kit/commit/83f2add2a56ba6696c51fd930a0a1dadbf36c134) Thanks [@renovate](https://github.com/apps/renovate)! - Update all dependencies

- Updated dependencies [[`83f2add2`](https://github.com/commercetools/merchant-center-application-kit/commit/83f2add2a56ba6696c51fd930a0a1dadbf36c134)]:
  - @commercetools-frontend/application-config@20.9.3

## 20.9.2

### Patch Changes

- Updated dependencies [[`9e6e31f4`](https://github.com/commercetools/merchant-center-application-kit/commit/9e6e31f4deddbbd1bb8a6cb67346af40fb6acbdd)]:
  - @commercetools-frontend/application-config@20.9.2

## 20.9.1

### Patch Changes

- Updated dependencies [[`b2d58de3`](https://github.com/commercetools/merchant-center-application-kit/commit/b2d58de3febf627296f7aa85e17dd7b74fc88174)]:
  - @commercetools-frontend/application-config@20.9.1

## 20.9.0

### Minor Changes

- [#2317](https://github.com/commercetools/merchant-center-application-kit/pull/2317) [`487fcca6`](https://github.com/commercetools/merchant-center-application-kit/commit/487fcca6bcc03a4df59830e5204ca89cc5395df4) Thanks [@emmenko](https://github.com/emmenko)! - Add support for defining the Custom Application config as JS files.

  Until now a Custom Application config file had to be defined as a JSON file with one of the following names:

  - `.custom-application-configrc`
  - `.custom-application-config.json`
  - `custom-application-config.json`

  On top of that, we built some "syntax features" to allow [variable placeholders](https://docs.commercetools.com/custom-applications/development/application-config#using-variable-placeholders) as a way to inject dynamic information into the static configuration file.

  However, there are still some use cases where the information you need to provide must be imported from another file, for example a constants file or something similar.

  To support such use cases, we now allow additional JS files to be used as a Custom Application config, specifically the following file extensions:

  - `.js`
  - `.cjs`
  - `.mjs`
  - `.ts`

  The file must obviously return the configuration object.

  > NOTE that you can still use variable placeholders.

  For example:

  ```js
  // constants.js
  const entryPointUriPath = 'test';
  module.exports = { entryPointUriPath };

  // custom-application-config.js
  const { entryPointUriPath } = require('./constants');

  const name = 'Test application';

  /**
   * @type {import('@commercetools-frontend/application-config').ConfigOptions}
   */
  const config = {
    name,
    cloudIdentifier: 'gcp-eu',
    entryPointUriPath,
    env: {
      production: {
        url: '${env:APP_URL}',
      },
    },
  };
  module.exports = config;
  ```

### Patch Changes

- Updated dependencies [[`487fcca6`](https://github.com/commercetools/merchant-center-application-kit/commit/487fcca6bcc03a4df59830e5204ca89cc5395df4)]:
  - @commercetools-frontend/application-config@20.9.0

## 20.8.0

### Minor Changes

- [#2312](https://github.com/commercetools/merchant-center-application-kit/pull/2312) [`ca4e1441`](https://github.com/commercetools/merchant-center-application-kit/commit/ca4e14410537c2eadaccfb537431036fb8fae883) Thanks [@emmenko](https://github.com/emmenko)! - Introduce a new configuration option for defining menu links when developing a Custom Application.

  At the moment, menu links are expected to be defined in a `menu.json` file and loaded by the Custom Application using a special prop `DEV_ONLY__loadNavbarMenuConfig` passed to the `<ApplicationShell>`. Something like this:

  ```js
  <ApplicationShell
    // ...
    DEV_ONLY__loadNavbarMenuConfig={() =>
      import('../../../menu.json').then((data) => data.default || data)
    }
  />
  ```

  This poses some issues and confusion:

  - The prop `DEV_ONLY__loadNavbarMenuConfig` is confusing, and users have to explicitly load the `menu.json` with code splitting, to avoid having the content in the production bundles.
  - The content of the `menu.json` is not validated at all, relying on try-error approaches from the users.
  - The `menu.json` is not really documented.
  - Having an extra `menu.json` file besides the `custom-application-config.json` is not ideal.

  Now we support defining the menu links in the `custom-application-config.json` itself, which aims to solve all the issues mentioned before. It also comes with some additional improvements such as:

  - Less configuration fields.
  - Support for two new variable placeholders:
    - `intl`: Given that menu labels are translated, you can reference a translation using the following syntax: `${intl:<local>:<translation_key>}`, for example `${intl:en:Menu.Avengers}`.
    - `path`: Reference a file to load the its content and inline it. This is usually useful for SVG icons. The path can be relative to the application folder, for example `${path:./app.svg}`, or from a module, for example `${path:@commercetools-frontend/assets/application-icons/heart.svg}`.

  > NOTE: This is an opt-in feature and is meant to replace the `menu.json` approach. For now it's fully backwards compatible.

  The menu links can be defined in the `custom-application-config.json` using the field `menuLinks`. You can check the JSON schema to inspect the supported fields.

  Example:

  ```json
  {
    // ...
    "menuLinks": {
      "icon": "${path:@commercetools-frontend/assets/application-icons/rocket.svg}",
      "defaultLabel": "${intl:en:Menu.StateMachines}",
      "labelAllLocales": [
        {
          "locale": "en",
          "value": "${intl:en:Menu.StateMachines}"
        },
        {
          "locale": "de",
          "value": "${intl:de:Menu.StateMachines}"
        }
      ],
      "submenuLinks": [
        {
          "uriPath": "echo-server",
          "defaultLabel": "${intl:en:Menu.EchoServer}",
          "labelAllLocales": [
            {
              "locale": "en",
              "value": "${intl:en:Menu.EchoServer}"
            },
            {
              "locale": "de",
              "value": "${intl:de:Menu.EchoServer}"
            }
          ]
        }
      ]
    }
  }
  ```

### Patch Changes

- [#2300](https://github.com/commercetools/merchant-center-application-kit/pull/2300) [`b3437eab`](https://github.com/commercetools/merchant-center-application-kit/commit/b3437eab6fd7b1529f5eac78eda658028474afa7) Thanks [@renovate](https://github.com/apps/renovate)! - fix(deps): update all dependencies

- Updated dependencies [[`ca4e1441`](https://github.com/commercetools/merchant-center-application-kit/commit/ca4e14410537c2eadaccfb537431036fb8fae883), [`b3437eab`](https://github.com/commercetools/merchant-center-application-kit/commit/b3437eab6fd7b1529f5eac78eda658028474afa7)]:
  - @commercetools-frontend/application-config@20.8.0

## 20.7.0

### Patch Changes

- [#2293](https://github.com/commercetools/merchant-center-application-kit/pull/2293) [`c7325b0d`](https://github.com/commercetools/merchant-center-application-kit/commit/c7325b0d4e45132ff0c9a5243132537057dfa406) Thanks [@renovate](https://github.com/apps/renovate)! - chore(deps): update all dependencies

- Updated dependencies [[`f5aa350a`](https://github.com/commercetools/merchant-center-application-kit/commit/f5aa350a29983383dd5933ac38c0beb56f0b9cf5)]:
  - @commercetools-frontend/application-config@20.7.0

## 20.5.2

### Patch Changes

- [#2273](https://github.com/commercetools/merchant-center-application-kit/pull/2273) [`b96d4f3d`](https://github.com/commercetools/merchant-center-application-kit/commit/b96d4f3d6ab177da66bc8cab337172bf3a85b2c6) Thanks [@renovate](https://github.com/apps/renovate)! - fix(deps): update all dependencies

- Updated dependencies [[`b96d4f3d`](https://github.com/commercetools/merchant-center-application-kit/commit/b96d4f3d6ab177da66bc8cab337172bf3a85b2c6)]:
  - @commercetools-frontend/application-config@20.5.2

## 20.5.1

### Patch Changes

- [#2264](https://github.com/commercetools/merchant-center-application-kit/pull/2264) [`e0ea1333`](https://github.com/commercetools/merchant-center-application-kit/commit/e0ea1333218aa7a916ff0971a52ed8175be4d697) Thanks [@renovate](https://github.com/apps/renovate)! - chore(deps): update all dependencies

* [#2268](https://github.com/commercetools/merchant-center-application-kit/pull/2268) [`c370f242`](https://github.com/commercetools/merchant-center-application-kit/commit/c370f242bb85bc0041b4825bc4ebc877eaaa61e4) Thanks [@renovate](https://github.com/apps/renovate)! - fix(deps): update all dependencies

* Updated dependencies [[`e0ea1333`](https://github.com/commercetools/merchant-center-application-kit/commit/e0ea1333218aa7a916ff0971a52ed8175be4d697), [`c370f242`](https://github.com/commercetools/merchant-center-application-kit/commit/c370f242bb85bc0041b4825bc4ebc877eaaa61e4)]:
  - @commercetools-frontend/application-config@20.5.1

## 20.4.0

### Patch Changes

- Updated dependencies [[`f8f759b6`](https://github.com/commercetools/merchant-center-application-kit/commit/f8f759b6f0f6d8cc677efd90fecbd19d103c6a4f)]:
  - @commercetools-frontend/application-config@20.4.0

## 20.3.3

### Patch Changes

- Updated dependencies [[`118efedd`](https://github.com/commercetools/merchant-center-application-kit/commit/118efeddf0c1349f18bc27a974bf88612a637004)]:
  - @commercetools-frontend/application-config@20.3.3

## 20.3.1

### Patch Changes

- Updated dependencies [[`4dd3398a`](https://github.com/commercetools/merchant-center-application-kit/commit/4dd3398a6cd951a29237e6e468f8accc8632981e)]:
  - @commercetools-frontend/application-config@20.3.1

## 20.3.0

### Patch Changes

- [#2223](https://github.com/commercetools/merchant-center-application-kit/pull/2223) [`6de28034`](https://github.com/commercetools/merchant-center-application-kit/commit/6de28034f51e53b3cd1f293eaa16b8f66d9ae9e0) Thanks [@renovate](https://github.com/apps/renovate)! - chore(deps): update all dependencies

* [#2212](https://github.com/commercetools/merchant-center-application-kit/pull/2212) [`5961c019`](https://github.com/commercetools/merchant-center-application-kit/commit/5961c019ab908bc1a5d58acd4511e7c579976797) Thanks [@renovate](https://github.com/apps/renovate)! - chore(deps): update all dependencies

* Updated dependencies [[`6de28034`](https://github.com/commercetools/merchant-center-application-kit/commit/6de28034f51e53b3cd1f293eaa16b8f66d9ae9e0), [`5961c019`](https://github.com/commercetools/merchant-center-application-kit/commit/5961c019ab908bc1a5d58acd4511e7c579976797)]:
  - @commercetools-frontend/application-config@20.3.0

## 20.1.2

### Patch Changes

- Updated dependencies [[`0bfa1613`](https://github.com/commercetools/merchant-center-application-kit/commit/0bfa16134450fb0699018b2210e0da904f646140)]:
  - @commercetools-frontend/application-config@20.1.2

## 20.0.1

### Patch Changes

- [#2178](https://github.com/commercetools/merchant-center-application-kit/pull/2178) [`26d4487a`](https://github.com/commercetools/merchant-center-application-kit/commit/26d4487a15dcee5c526de7b1f227e042e2711d3f) Thanks [@renovate](https://github.com/apps/renovate)! - chore(deps): update all dependencies

- Updated dependencies [[`26d4487a`](https://github.com/commercetools/merchant-center-application-kit/commit/26d4487a15dcee5c526de7b1f227e042e2711d3f)]:
  - @commercetools-frontend/application-config@20.0.1

## 19.3.1

### Patch Changes

- [#2157](https://github.com/commercetools/merchant-center-application-kit/pull/2157) [`e757dd2b`](https://github.com/commercetools/merchant-center-application-kit/commit/e757dd2b114f0c751400eca6179700bddbb3aecc) Thanks [@renovate](https://github.com/apps/renovate)! - chore(deps): update all dependencies

- Updated dependencies [[`e757dd2b`](https://github.com/commercetools/merchant-center-application-kit/commit/e757dd2b114f0c751400eca6179700bddbb3aecc)]:
  - @commercetools-frontend/application-config@19.3.1

## 19.1.1

### Patch Changes

- [#2136](https://github.com/commercetools/merchant-center-application-kit/pull/2136) [`4eddd6a5`](https://github.com/commercetools/merchant-center-application-kit/commit/4eddd6a5a8a81a506031c418bd9bf7c5c5a81ff4) Thanks [@renovate](https://github.com/apps/renovate)! - Update dependency cypress to v7 also allowing Cypress v7 as a peer dependency.

## 19.1.0

### Patch Changes

- Updated dependencies [[`53b27b0b`](https://github.com/commercetools/merchant-center-application-kit/commit/53b27b0b318b3d84f8f6828368b7c6a94008dcd3)]:
  - @commercetools-frontend/application-config@19.1.0

## 19.0.1

### Patch Changes

- [#2135](https://github.com/commercetools/merchant-center-application-kit/pull/2135) [`598d3bb5`](https://github.com/commercetools/merchant-center-application-kit/commit/598d3bb52a43b261f4ddf0393722927b76339870) Thanks [@renovate](https://github.com/apps/renovate)! - Update dependencies

- Updated dependencies [[`598d3bb5`](https://github.com/commercetools/merchant-center-application-kit/commit/598d3bb52a43b261f4ddf0393722927b76339870)]:
  - @commercetools-frontend/application-config@19.0.1

## 19.0.0

### Patch Changes

- Updated dependencies [[`a240f657`](https://github.com/commercetools/merchant-center-application-kit/commit/a240f6574a9240a2ac82febb67b0f6c814db979f), [`a240f657`](https://github.com/commercetools/merchant-center-application-kit/commit/a240f6574a9240a2ac82febb67b0f6c814db979f)]:
  - @commercetools-frontend/application-config@19.0.0

## 18.7.0

### Patch Changes

- [#2110](https://github.com/commercetools/merchant-center-application-kit/pull/2110) [`c850d6dc`](https://github.com/commercetools/merchant-center-application-kit/commit/c850d6dcf8edabb5eb9390e41def4b6b52879b7a) Thanks [@renovate](https://github.com/apps/renovate)! - chore(deps): update all dependencies

- Updated dependencies [[`8eed86e9`](https://github.com/commercetools/merchant-center-application-kit/commit/8eed86e977320aa00397b93e94c0cd29331d8c01), [`c850d6dc`](https://github.com/commercetools/merchant-center-application-kit/commit/c850d6dcf8edabb5eb9390e41def4b6b52879b7a)]:
  - @commercetools-frontend/application-config@18.7.0

## 18.6.0

### Patch Changes

- [#2099](https://github.com/commercetools/merchant-center-application-kit/pull/2099) [`d09a154b`](https://github.com/commercetools/merchant-center-application-kit/commit/d09a154b9e74bc180da033acd8e74ac8ed32fc75) Thanks [@renovate](https://github.com/apps/renovate)! - Update dependencies

- Updated dependencies [[`d09a154b`](https://github.com/commercetools/merchant-center-application-kit/commit/d09a154b9e74bc180da033acd8e74ac8ed32fc75)]:
  - @commercetools-frontend/application-config@18.6.0

## 18.5.6

### Patch Changes

- [`ca4ea6eb`](https://github.com/commercetools/merchant-center-application-kit/commit/ca4ea6eb17c14bf015a8448248c58881e005ac99) [#2085](https://github.com/commercetools/merchant-center-application-kit/pull/2085) Thanks [@renovate](https://github.com/apps/renovate)! - chore(deps): update all dependencies

- Updated dependencies [[`ca4ea6eb`](https://github.com/commercetools/merchant-center-application-kit/commit/ca4ea6eb17c14bf015a8448248c58881e005ac99)]:
  - @commercetools-frontend/application-config@18.5.6

## 18.5.2

### Patch Changes

- [`7f26c54e`](https://github.com/commercetools/merchant-center-application-kit/commit/7f26c54e55eff8aeac786ec0d011d36e40b0d263) [#2066](https://github.com/commercetools/merchant-center-application-kit/pull/2066) Thanks [@renovate](https://github.com/apps/renovate)! - fix(deps): update all dependencies

- Updated dependencies [[`7f26c54e`](https://github.com/commercetools/merchant-center-application-kit/commit/7f26c54e55eff8aeac786ec0d011d36e40b0d263)]:
  - @commercetools-frontend/application-config@18.5.2

## 18.5.1

### Patch Changes

- [`bb2ceac2`](https://github.com/commercetools/merchant-center-application-kit/commit/bb2ceac229b94836482dbed57824d679a9cbd5d6) [#2062](https://github.com/commercetools/merchant-center-application-kit/pull/2062) Thanks [@renovate](https://github.com/apps/renovate)! - chore(deps): update all dependencies

- Updated dependencies [[`bb2ceac2`](https://github.com/commercetools/merchant-center-application-kit/commit/bb2ceac229b94836482dbed57824d679a9cbd5d6)]:
  - @commercetools-frontend/application-config@18.5.1

## 18.4.1

### Patch Changes

- Updated dependencies [[`074ec33d`](https://github.com/commercetools/merchant-center-application-kit/commit/074ec33d97282fc9750fd59ccceb33ff0430da41)]:
  - @commercetools-frontend/application-config@18.4.1

## 18.4.0

### Patch Changes

- [`eb2fbb22`](https://github.com/commercetools/merchant-center-application-kit/commit/eb2fbb2279eff99048c91da352a69e1883eb54af) [#2044](https://github.com/commercetools/merchant-center-application-kit/pull/2044) Thanks [@renovate](https://github.com/apps/renovate)! - Update dependencies

- Updated dependencies [[`eb2fbb22`](https://github.com/commercetools/merchant-center-application-kit/commit/eb2fbb2279eff99048c91da352a69e1883eb54af)]:
  - @commercetools-frontend/application-config@18.4.0

## 18.1.4

### Patch Changes

- Updated dependencies [[`c9589f5e`](https://github.com/commercetools/merchant-center-application-kit/commit/c9589f5e3d1fd18393c7bf501c3b23b8ec402804)]:
  - @commercetools-frontend/application-config@18.1.4

## 18.1.2

### Patch Changes

- [`dbd896f5`](https://github.com/commercetools/merchant-center-application-kit/commit/dbd896f5fb44e75884ff9e161245d716ee26cd83) [#2008](https://github.com/commercetools/merchant-center-application-kit/pull/2008) Thanks [@emmenko](https://github.com/emmenko)! - Fix importing types into a `.d.ts` module.

## 18.1.1

### Patch Changes

- [`44494820`](https://github.com/commercetools/merchant-center-application-kit/commit/444948201f77e8655d1e3adb836754f04b61ba68) [#2007](https://github.com/commercetools/merchant-center-application-kit/pull/2007) Thanks [@emmenko](https://github.com/emmenko)! - Improve logs for `loginByOidc` Cypress command

* [`ac00a671`](https://github.com/commercetools/merchant-center-application-kit/commit/ac00a6718cdbf9c6bffac4e5a82e2f59faa21b7b) [#2005](https://github.com/commercetools/merchant-center-application-kit/pull/2005) Thanks [@emmenko](https://github.com/emmenko)! - Fix exporting types for command

## 18.1.0

### Minor Changes

- [`f264af3f`](https://github.com/commercetools/merchant-center-application-kit/commit/f264af3f8aa27d8c03a414b9ac301588bad83135) [#2004](https://github.com/commercetools/merchant-center-application-kit/pull/2004) Thanks [@emmenko](https://github.com/emmenko)! - Add more options to `loginByOidc` command.

### Patch Changes

- [`3bf32993`](https://github.com/commercetools/merchant-center-application-kit/commit/3bf329935a109a73a7c33580fdf618e60fdbcc2c) [#1971](https://github.com/commercetools/merchant-center-application-kit/pull/1971) Thanks [@tdeekens](https://github.com/tdeekens)! - Add internal opt-in support for combining feature flag adapters.

- Updated dependencies [[`3bf32993`](https://github.com/commercetools/merchant-center-application-kit/commit/3bf329935a109a73a7c33580fdf618e60fdbcc2c)]:
  - @commercetools-frontend/application-config@18.1.0

## 18.0.2

### Patch Changes

- [`b38cb57f`](https://github.com/commercetools/merchant-center-application-kit/commit/b38cb57f678e79a862f1b97df2d1c753838ffbb7) [#1991](https://github.com/commercetools/merchant-center-application-kit/pull/1991) Thanks [@renovate](https://github.com/apps/renovate)! - fix(deps): update all dependencies

## 17.10.1

### Patch Changes

- [`5557c5c`](https://github.com/commercetools/merchant-center-application-kit/commit/5557c5c5744bf34a981247d04dc2f1117c15767d) [#1976](https://github.com/commercetools/merchant-center-application-kit/pull/1976) Thanks [@renovate](https://github.com/apps/renovate)! - Update dependencies

- Updated dependencies [[`5557c5c`](https://github.com/commercetools/merchant-center-application-kit/commit/5557c5c5744bf34a981247d04dc2f1117c15767d)]:
  - @commercetools-frontend/application-config@17.10.1

## 17.10.0

### Minor Changes

- [`d86c2e8`](https://github.com/commercetools/merchant-center-application-kit/commit/d86c2e86179aca2729d92fa18545241e2bf36fca) [#1934](https://github.com/commercetools/merchant-center-application-kit/pull/1934) Thanks [@emmenko](https://github.com/emmenko)! - Introduce a new **experimental opt-in** feature to authenticate the application for local development, using an OIDC-like workflow.

  > Disclaimer: this is an opt-in experimental feature. Use it at your own risk.
  > We want to test this feature internally first. Until then, we discourage you to try it out.

  The feature can be enabled by setting the `ENABLE_OIDC_FOR_DEVELOPMENT=true` environment variable.

  In addition to that, we have a new package `@commercetools-frontend/cypress`, to include some useful commands for testing Custom Applications.

### Patch Changes

- Updated dependencies [[`d86c2e8`](https://github.com/commercetools/merchant-center-application-kit/commit/d86c2e86179aca2729d92fa18545241e2bf36fca), [`2d6dbaa`](https://github.com/commercetools/merchant-center-application-kit/commit/2d6dbaa5b5d1b0f29dcb5c88222a2a6fc9161cec)]:
  - @commercetools-frontend/application-config@17.10.0
