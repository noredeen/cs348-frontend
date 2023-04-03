import AsyncSelect from "react-select/async"
import axios from "axios";
import { SingleValue, ActionMeta } from "react-select";

export type SelectOptionType = { label: string, value: GetAirportCodeResponse }
export type GetAirportCodeResponse = {
  airport_code: string
  route_id: number
  airplane_model: string
};

interface AirportSelectorProps {
  onChange: ((newValue: SingleValue<SelectOptionType>, actionMeta: ActionMeta<SelectOptionType>) => void) | undefined
  isClearable: boolean,
  isOriginSearch: boolean,
  origin?: string,
  dest?: string,
}

export default function AirportSelector(props: AirportSelectorProps) {
  const loadOptions = (
    inputValue: string,
    callback: (options: SelectOptionType[]) => void
  ) => {
    let params: {
      origin_ap_code?: string,
      dest_ap_code?: string,
      origin_ap_code_search?: string,
      dest_ap_code_search?: string
    } = {}
    if (props.isOriginSearch) {
        params = {
          origin_ap_code_search: String(inputValue), 
          dest_ap_code: props.dest
        }
    } else {
        params = {
          dest_ap_code_search: String(inputValue), 
          origin_ap_code: props.origin
        }
    }

    setTimeout(() => {
      axios.get<GetAirportCodeResponse[]>(
        'https://localhost:8000/airports',
        {params: params}
      ).then(response => {
        return callback(response.data.map(r => ({label: r.airport_code, value: r})))
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