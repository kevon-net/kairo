import { CountryData } from '@/types/bodies/response';
import { filterSearch } from '@/utilities/helpers/string';
import { useCombobox } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useSortCountryCodes } from '../sort/country-codes';

export const useComboboxCountryCodes = (
  list: CountryData[] = [],
  formValue: string
) => {
  const [search, setSearch] = useState('');
  const [value, setValue] = useState<string>(formValue);

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

  const sortedData = useSortCountryCodes(list);

  const getSearchResults = (): CountryData[] => {
    const fieldSelector = (item: CountryData) => item.name?.common;
    const searchResults = filterSearch(sortedData, search, fieldSelector);
    return searchResults;
  };

  useEffect(() => {
    if (formValue == '') {
      setValue(formValue);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValue]);

  return { search, setSearch, value, setValue, combobox, getSearchResults };
};
