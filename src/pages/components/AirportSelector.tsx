import AsyncSelect from "react-select/async"
import axios from "axios";
import { SingleValue, ActionMeta } from "react-select";

export type SelectOptionType = { label: string, value: string }
type GetAirportCodeResponse = {
  data: string[];
};

interface AirportSelectorProps {
  onChange: ((newValue: SingleValue<SelectOptionType>, actionMeta: ActionMeta<SelectOptionType>) => void) | undefined
  isClearable: boolean
}

export default function AirportSelector(props: AirportSelectorProps) {
  const loadOptions = (
    inputValue: string,
    callback: (options: SelectOptionType[]) => void
  ) => {
    setTimeout(() => {
      axios.get<GetAirportCodeResponse>(
        'https://localhost:8000/airports',
        {params: {code: inputValue}}
      ).then(response => {
        return callback(response.data.data.map(r => ({label: r, value: r})))
      })
    }, 1000);
  };

  return (
    <AsyncSelect isClearable={props.isClearable} cacheOptions defaultOptions
      loadOptions={loadOptions}
      onChange={props.onChange}
    />
  )
}