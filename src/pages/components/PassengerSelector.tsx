import AsyncSelect from "react-select/async"
import axios from "axios";
import { SingleValue, ActionMeta } from "react-select";

export type PassengerInfo = {
  id?: number
  name?: string,
  email?: string,
};
export type SelectOptionType = { label: string, value: number }

interface PassengerSelectorProps {
  onChange: ((newValue: SingleValue<SelectOptionType>, actionMeta: ActionMeta<SelectOptionType>) => void) | undefined
}

export default function PassengerSelector(props: PassengerSelectorProps) {
  const loadOptions = (
    inputValue: string,
    callback: (options: SelectOptionType[]) => void
  ) => {
    setTimeout(() => {
      axios.get<PassengerInfo[]>(
        'https://localhost:8000/passengers',
        {
          params: {
            name: String(inputValue),
          }
        }
      ).then(response => {
        return callback(response.data.map(r => ({label: r.name || "", value: r.id || 0})))
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