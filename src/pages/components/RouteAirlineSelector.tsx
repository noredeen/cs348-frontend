import AsyncSelect from "react-select/async"
import axios from "axios";
import { SingleValue, ActionMeta } from "react-select";

export type RouteInfo = {
  id?: number,
  airline_code?: string,
  airline_name?: string,
  airplane_code?: string,
  airplane_model?: string
};
export type SelectOptionType = { label: string, value: RouteInfo }

interface RouteAirlineSelectorProps {
  onChange: ((newValue: SingleValue<SelectOptionType>, actionMeta: ActionMeta<SelectOptionType>) => void) | undefined
  origin: string
  dest: string
  isDisabled: boolean
}

export default function RouteAirlineSelector(props: RouteAirlineSelectorProps) {
  const loadOptions = (
    inputValue: string,
    callback: (options: SelectOptionType[]) => void
  ) => {
    setTimeout(() => {
      axios.get<RouteInfo[]>(
        'https://localhost:8000/routes',
        {
          params: {
            origin_ap_code: String(props.origin),
            dest_ap_code: String(props.dest),
            airline_name: String(inputValue),
          }
        }
      ).then(response => {
        return callback(response.data.map(r => ({label: r.airline_name, value: r})))
      })
    }, 1000);
  };

  return (
    <AsyncSelect isClearable defaultOptions
      loadOptions={loadOptions}
      onChange={props.onChange}
      isDisabled={props.isDisabled}
    />
  )
}