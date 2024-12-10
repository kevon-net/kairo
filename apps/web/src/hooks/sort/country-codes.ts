import { Order } from '@repo/enums';
import { CountryData } from '@/types/bodies/response';
import { sortArray } from '@repo/utils/helpers';

export const useSortCountryCodes = (list: CountryData[] = []) => {
  const filteredList = filterCodes(list);
  const sortedValidatedList = sortList(filteredList);

  return sortedValidatedList;
};

export const getDialCode = (idd: CountryData['idd']) => {
  const withSuffix = idd.suffixes.length == 1;
  const dialCode = `${idd.root}${withSuffix ? idd.suffixes[0] : ''}`;

  return dialCode;
};

const filterCodes = (list: CountryData[] = []) => {
  const validCodes = list.filter((item) => {
    const dialCode = getDialCode(item.idd);
    return dialCode;
  });

  return validCodes;
};

const sortList = (list: CountryData[] = []) => {
  const fieldSelector = (item: CountryData) => {
    const dialCode = getDialCode(item.idd);
    const dialCodeWithoutPlus = dialCode.replace('+', '');
    return Number(dialCodeWithoutPlus);
  };

  return sortArray(list, fieldSelector, Order.ASCENDING);
};
