import AsyncSelect from "react-select/async"
import axios from "axios";
import { SingleValue, ActionMeta } from "react-select";

export type AirlineInfo = {
  airline_code?: string,
  airline_name?: string,
};
export type SelectOptionType = { label: string, value: string }

interface AirlineSelectorProps {
  onChange: ((newValue: SingleValue<SelectOptionType>, actionMeta: ActionMeta<SelectOptionType>) => void) | undefined
}

export default function AirlineSelector(props: AirlineSelectorProps) {
  const loadOptions = (
    inputValue: string,
    callback: (options: SelectOptionType[]) => void
  ) => {
    setTimeout(() => {
      axios.get<AirlineInfo[]>(
        'https://localhost:8000/airlines',
        {
          params: {
            airline_name: String(inputValue),
          }
        }
      ).then(response => {
        return callback(response.data.map(r => ({label: r.airline_name || "", value: r.airline_code || ""})))
      })
    }, 1000);
  };

  return (
    <AsyncSelect isClearable defaultOptions
      loadOptions={loadOptions}
      onChange={props.onChange}
    />
  )
}