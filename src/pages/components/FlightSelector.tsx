import AsyncSelect from "react-select/async"
import axios from "axios";
import { SingleValue, ActionMeta } from "react-select";


export type FlightInfo = {
  id: number
  flight_number: string,
  departure_time: string,
  origin_ap_code: string,
  dest_ap_code: string,
};
export type SelectOptionType = { label: string, value: number }

interface FlightSelectorProps {
  onChange: ((newValue: SingleValue<SelectOptionType>, actionMeta: ActionMeta<SelectOptionType>) => void) | undefined
}

export default function FlightSelector(props: FlightSelectorProps) {
  const loadOptions = (
    inputValue: string,
    callback: (options: SelectOptionType[]) => void
  ) => {
    setTimeout(() => {
      axios.get<FlightInfo[]>(
        'https://localhost:8000/flights',
        {
          params: {
            id: Number(inputValue),
            page: Number(1),
            results_per_page: Number(20)
          }
        }
      ).then(response => {
        return callback(response.data.map(r => ({label: `${r.origin_ap_code} -> ${r.dest_ap_code} - ${r.departure_time}` , value: r.id})))
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