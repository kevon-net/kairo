'use client';

import {
  CloseButton,
  Combobox,
  ComboboxChevron,
  ComboboxDropdown,
  ComboboxEmpty,
  ComboboxOption,
  ComboboxOptions,
  ComboboxSearch,
  ComboboxTarget,
  Group,
  InputBase,
  InputPlaceholder,
  Text,
  useCombobox,
} from '@mantine/core';
import { FormTask } from '@/hooks/form/task';
import { IconCategory, IconInbox } from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@/data/constants';
import { useState } from 'react';
import { useAppSelector } from '@/hooks/redux';
import { FormTaskView } from '@/hooks/form/task/view';

export default function Project({
  props,
}: {
  props: {
    formTask?: FormTask;
    formTaskView?: FormTaskView;
    inputProps?: { width?: any };
  };
}) {
  const [search, setSearch] = useState('');

  const combobox = useCombobox({
    onDropdownClose: () => {
      combobox.resetSelectedOption();
      combobox.focusTarget();
      setSearch('');
    },

    onDropdownOpen: () => {
      combobox.focusSearchInput();
    },
  });

  const categories = useAppSelector((state) => state.categories.value);

  const items = [
    { value: 'inbox', component: 'Inbox' },
    ...(categories || []).map((category) => {
      return {
        value: category.id,
        color: category.color,
        component: category.title,
      };
    }),
  ];

  const getFilteredOptions = (params: {
    data: any[];
    searchQuery: string;
    limit: number;
  }) => {
    const result: any[] = [];

    for (let i = 0; i < params.data.length; i += 1) {
      if (result.length === params.limit) {
        break;
      }

      const cat = categories?.find((c) => c.id == params.data[i].value);

      const searchVal = params.searchQuery.trim().toLowerCase();

      if (
        (cat && cat.title.toLowerCase().includes(searchVal)) ||
        params.data[i].value.includes(searchVal)
      ) {
        result.push(params.data[i]);
      }
    }

    return result;
  };

  const filteredOptions = getFilteredOptions({
    data: items,
    searchQuery: search,
    limit: 5,
  });

  const options = filteredOptions.map((item, index) => (
    <ComboboxOption key={index} value={item.value}>
      <Group gap={'xs'}>
        <IconCategory
          size={ICON_SIZE}
          stroke={ICON_STROKE_WIDTH}
          color={item.color}
        />

        <Text component={'span'} inherit>
          {item.component}
        </Text>
      </Group>
    </ComboboxOption>
  ));

  return (
    <Combobox
      store={combobox}
      withinPortal={false}
      onOptionSubmit={(val) => {
        if (props.formTask) {
          props.formTask.setFieldValue('properties.category_id', val);
        }

        if (props.formTaskView) {
          props.formTaskView.setFieldValue('filterBy.category', val);
        }

        combobox.closeDropdown();
        setSearch('');
      }}
    >
      <ComboboxTarget>
        <InputBase
          styles={{
            input: {
              backgroundColor: 'var(--mantine-color-body)',
            },
          }}
          component="button"
          type="button"
          size="xs"
          p={0}
          w={props.inputProps?.width || 'fit-content'}
          pointer
          onClick={() => combobox.toggleDropdown()}
          rightSection={
            props.formTask?.values.properties.category_id ||
            props.formTaskView?.values.filterBy.category ? (
              <CloseButton
                size="sm"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  if (props.formTask) {
                    props.formTask.setFieldValue('properties.category_id', '');
                  }

                  if (props.formTaskView) {
                    props.formTaskView.setFieldValue('filterBy.category', '');
                  }

                  combobox.closeDropdown();
                  setSearch('');
                }}
                aria-label="Clear value"
              />
            ) : (
              <ComboboxChevron />
            )
          }
          rightSectionPointerEvents={
            !(
              props.formTask?.values.properties.category_id ||
              props.formTaskView?.values.filterBy.category
            )
              ? 'none'
              : 'all'
          }
        >
          {props.formTask?.values.properties.category_id ||
          props.formTaskView?.values.filterBy.category ? (
            <Group gap={'xs'} fz={'sm'} pr={'xs'}>
              {(props.formTask?.values.properties.category_id ||
                props.formTaskView?.values.filterBy.category) == 'inbox' ? (
                <IconInbox size={ICON_SIZE / 1.25} stroke={ICON_STROKE_WIDTH} />
              ) : (
                <IconCategory
                  size={ICON_SIZE / 1.25}
                  stroke={ICON_STROKE_WIDTH}
                  color={
                    props.formTask?.values.properties.category_id ||
                    props.formTaskView?.values.filterBy.category
                      ? categories?.find(
                          (category) =>
                            category.id ==
                            (props.formTask?.values.properties.category_id ||
                              props.formTaskView?.values.filterBy.category)
                        )?.color
                      : undefined
                  }
                />
              )}

              <Text component="span" inherit>
                {(props.formTask?.values.properties.category_id ||
                  props.formTaskView?.values.filterBy.category) == 'inbox'
                  ? items[0].component
                  : categories?.find(
                      (category) =>
                        category.id ==
                        (props.formTask?.values.properties.category_id ||
                          props.formTaskView?.values.filterBy.category)
                    )?.title}
              </Text>
            </Group>
          ) : (
            <InputPlaceholder fz={'sm'}>
              <Group gap={'xs'} pr={'xs'}>
                <IconCategory
                  size={ICON_SIZE / 1.25}
                  stroke={ICON_STROKE_WIDTH}
                />
                Project
              </Group>
            </InputPlaceholder>
          )}
        </InputBase>
      </ComboboxTarget>

      <ComboboxDropdown miw={240}>
        <ComboboxSearch
          value={search}
          onChange={(event) => setSearch(event.currentTarget.value)}
          placeholder="Search all projects"
        />

        <ComboboxOptions>
          {options.length > 0 ? (
            options
          ) : (
            <ComboboxEmpty>Nothing found</ComboboxEmpty>
          )}
        </ComboboxOptions>
      </ComboboxDropdown>
    </Combobox>
  );
}
