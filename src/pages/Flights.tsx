import Link from "next/link"
import { useState, useEffect } from "react";
import AsyncSelect from "react-select/async"
import axios from "axios";

type SelectOptionType = { label: string, value: string }
type GetAirportCodeResponse = {
  data: string[];
};

type FlightType = {
  id: number
  airline_name: string,
  flight_number: string,
  departure_time: string,
  origin_ap_code: string,
  dest_ap_code: string,
  from_city: string,
  to_city: string,
  airplane_model: string,
  pct_occupied: number,
  status: string
};

export default function Flights() {
    const [options, setOptions] = useState<{label:string, value:string}[]>([])
    const [origin, setOrigin] = useState("")
    const [dest, setDest] = useState("")
    const [flights, setFlights] = useState<FlightType[]>([])

    const getFlightsFrom = (opt?: SelectOptionType | null) => {
      setOrigin(opt?.value || "")
    }

    const getFlightsTo = (opt?: SelectOptionType | null) => {
      setDest(opt?.value || "")
    }


    const loadOptions = (
      inputValue: string,
      callback: (options: SelectOptionType[]) => void
    ) => {
      setTimeout(() => {
        axios.get<GetAirportCodeResponse>(
          'http://localhost:8000/airports',
          {params: {code: inputValue}}
        ).then(response => {
          return callback(response.data.data.map(r => ({label: r, value: r})))
        })
      }, 1000);
    };

    useEffect(() => {
      axios.get<FlightType[]>(
        'http://localhost:8000/flights',
        {params: {
          page: 1,
          results_per_page: 15,
          origin: String(origin),
          dest: String(dest),
        }}
      ).then(response => {
        setFlights(response.data)
      })
    }, [origin, dest])

    return (
      <main>
        <div className="mx-auto max-w-3xl py-6 sm:px-6 lg:px-8">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">Flight Lookup</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">Enter the IATA codes for the origin and destination airports</p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">Origin</label>
                <div className="mt-2">
                  <AsyncSelect isClearable cacheOptions defaultOptions
                    loadOptions={loadOptions}
                    onChange={getFlightsFrom}
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">Destination</label>
                <div className="mt-2">
                  <AsyncSelect isClearable cacheOptions defaultOptions
                    loadOptions={loadOptions} 
                    onChange={getFlightsTo}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 justify-center">
            {flights.map(f => {
              return (
              <div key={f.id} className="max-w-full rounded overflow-hidden shadow-lg bg-white">
                <div className="px-6 py-4">
                  <div className="flex font-bold text-xl">{f.airline_name} #{f.flight_number}:
                  <Link href="/" className="ml-5 text-neutral-600">{f.origin_ap_code}</Link>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-5 h-5 mx-2 mt-1">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                  <Link href="/" className="text-neutral-600">{f.dest_ap_code}</Link>
                  </div>
                  <p className="text-gray-700 text-xl mb-2">
                    {f.departure_time}
                  </p>
                  <p className="text-gray-700 text-base">
                    {f.from_city} -- {f.to_city}
                  </p>
                  <p className="text-gray-700 text-base">
                    {f.airplane_model}
                  </p>
                </div>
                <div className="w-auto mx-5 rounded bg-slate-100">
                  <div className="bg-primary p-0.5 text-center text-xs font-medium leading-none text-primary-100 bg-green-500" style={{"width": "25%"}}>25%</div>
                </div>
                <div className="px-6 pt-4 pb-2">
                  <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">Departed</span>
                </div>
              </div>);
            })}
          </div>
        </div>
      </main>
    );
}