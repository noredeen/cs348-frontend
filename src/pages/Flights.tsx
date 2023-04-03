import Link from "next/link"
import { useState, useEffect } from "react";
import AsyncSelect from "react-select/async"
import axios from "axios";
import AirportSelector from "./components/AirportSelector";
import CreateFlightModal from "./components/CreateFlightModal";

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
    const [showOnlyCancelled, setShowOnlyCancelled] = useState(false)
    const [hasCancelled, setHasCancelled] = useState(false)
    const [flights, setFlights] = useState<FlightType[]>([])
    const [modalOpen, setModalOpen] = useState(false)

    const getFlightsFrom = (opt?: SelectOptionType | null) => {
      setOrigin(opt?.value || "")
    }

    const getFlightsTo = (opt?: SelectOptionType | null) => {
      setDest(opt?.value || "")
    }

    const cancelFlight = (flight_id: number): void => {
      axios.get(
        'https://localhost:8000/cancel_flight',
        {params: {f_id: flight_id}}
      ).then(response => {
        setHasCancelled(true)
      })
    }

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

    useEffect(() => {
      const params: {
        page: number,
        results_per_page: number,
        origin: string,
        dest: string,
        status?: string
      } = {
        page: 1,
        results_per_page: 15,
        origin: String(origin),
        dest: String(dest),
      }
      if (showOnlyCancelled) {
        params['status'] = 'canceled'
      }
      axios.get<FlightType[]>(
        'https://localhost:8000/flights',
        { params }
      ).then(response => {
        setFlights(response.data)
        setHasCancelled(false)
      })
    }, [origin, dest, hasCancelled, showOnlyCancelled])

    return (
      <main>
        <CreateFlightModal open={modalOpen} setOpen={setModalOpen} />
        <div className="mx-auto max-w-3xl py-6 sm:px-6 lg:px-8">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">Flight Lookup</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">Enter the IATA codes for the origin and destination airports</p>
            <button
              type="button"
              className='mt-3 col-end-7 col-span-1 rounded bg-blue-800 px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca]'
              onClick={() => {
                setModalOpen(true)
              }}
            >
              Create Flight
            </button>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label for="first-name" class="block text-sm font-medium leading-6 text-gray-900">Origin</label>
                <div className="mt-2">
                  <AirportSelector isClearable={true} onChange={getFlightsFrom}/>
                </div>
              </div>

              <div className="sm:col-span-3">
                <label for="first-name" class="block text-sm font-medium leading-6 text-gray-900">Destination</label>
                <div className="mt-2">
                  <AirportSelector isClearable={true} onChange={getFlightsTo}/>
                </div>
              </div>
            </div>

              <div className="sm:col-span-3 mt-4">
                <label for="first-name" class="block text-sm font-medium leading-6 text-gray-900">Only Cancelled Flights</label>
                <div className="inline-flex items-center">
                  <label
                    className="relative flex cursor-pointer items-center rounded-full p-3"
                    for="checkbox-8"
                    data-ripple-dark="true"
                  >
                    <input
                      type="checkbox"
                      className="before:content[''] peer relative h-5 w-5 cursor-pointer rounded-md border border-blue-gray-500 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-blue-500 checked:bg-blue-500 checked:before:bg-blue-500 hover:before:opacity-10"
                      id="checkbox-8"
                      onChange={() => { setShowOnlyCancelled(!showOnlyCancelled) }}
                    />
                    <div className="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3.5 w-3.5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        stroke="currentColor"
                        stroke-width="1"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                    </div>
                  </label>
                </div>
              </div>
          </div>

          <div className="grid grid-cols-1 gap-4 justify-center">
            {flights.map(f => {
              const color = f.status && f.status === "canceled" ? "bg-red-400" : "bg-gray-200"
              const status = f.status && f.status === "canceled" ? "Cancelled" : "Scheduled"
              const className = `col-start-1 col-end-2 ${color} rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2`
              return (
              <div key={f.id} className="max-w-full rounded overflow-hidden shadow-lg bg-white">
                <div className="px-6 py-4">
                  <div className="flex font-bold text-xl">{f.airline_name} #{f.flight_number}:
                  <a href="#" className="ml-5 text-neutral-600">{f.origin_ap_code}</a>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-5 h-5 mx-2 mt-1">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                  <a href="#" className="text-neutral-600">{f.dest_ap_code}</a>
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
                <div className="grid grid-cols-6 gap-4 px-6 pt-4 pb-2">
                  <span className={className}>{status}</span>
                  <button
                    type="button"
                    disabled={f.status === "canceled"}
                    className={`col-end-7 col-span-1 rounded ${f.status === 'canceled' ? 'bg-gray-400' : 'bg-gray-800'} px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca]`}
                    onClick={() => {
                      cancelFlight(f.id)
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>);
            })}
          </div>
        </div>
      </main>
    );
}