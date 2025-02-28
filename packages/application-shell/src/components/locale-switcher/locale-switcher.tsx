import type { SingleValueProps } from 'react-select';

import { useCallback } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import SelectInput from '@commercetools-uikit/select-input';
import { WorldIcon } from '@commercetools-uikit/icons';
import { customProperties } from '@commercetools-uikit/design-system';

type CustomSingleValueProps = SingleValueProps<{
  label: string;
  value: string;
}> & {
  localeCount: number;
};
type Props = {
  projectDataLocale: string;
  setProjectDataLocale: (locale: string) => void;
  availableLocales: string[];
};

export const SingleValue = (props: CustomSingleValueProps) => (
  <div
    css={css`
      flex: 1;
      align-items: center;
      display: flex;
    `}
  >
    <WorldIcon size="big" />
    <span
      css={css`
        margin-left: 2px;
        flex: 1;
        color: ${customProperties.colorAccent};
      `}
    >
      {props.children}
    </span>
    <span
      css={css`
        width: 22px;
        height: 22px;
        border-radius: 100%;
        background: ${customProperties.colorAccent40};
        color: ${customProperties.colorSurface};
        font-size: 0.9rem;
        display: flex;
        justify-content: center;
        align-items: center;
      `}
    >
      {props.localeCount}
    </span>
  </div>
);
SingleValue.propTypes = {
  children: PropTypes.node.isRequired,
  localeCount: PropTypes.number.isRequired,
};
SingleValue.displayName = 'SingleValue';

const LocaleSwitcher = (props: Props) => {
  const { setProjectDataLocale } = props;
  const handleSelection = useCallback(
    (event) => {
      setProjectDataLocale(event.target.value);
    },
    [setProjectDataLocale]
  );
  return (
    <div
      css={css`
        position: relative;
        width: ${customProperties.constraint3};
      `}
      data-track-component="LocaleSwitch"
    >
      <SelectInput
        value={props.projectDataLocale}
        name="locale-switcher"
        aria-labelledby="locale-switcher"
        onChange={handleSelection}
        options={props.availableLocales.map((locale) => ({
          label: locale,
          value: locale,
        }))}
        components={{
          // eslint-disable-next-line react/display-name
          SingleValue: (
            valueProps: SingleValueProps<{ label: string; value: string }>
          ) => (
            <SingleValue
              {...valueProps}
              localeCount={props.availableLocales.length}
            />
          ),
        }}
        isClearable={false}
        backspaceRemovesValue={false}
        isSearchable={false}
      />
    </div>
  );
};

export default LocaleSwitcher;
