import { Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { WindowIcon } from '@heroicons/react/24/outline'
import AirportSelector, { GetAirportCodeResponse } from './AirportSelector'
import AirlineSelector from './AirlineSelector'
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import { Moment } from 'moment'
import axios from 'axios'

interface CreateFlightModalProps {
  setOpen: (arg: boolean) => void
  open: boolean
}

export default function CreateFlightModal(props: CreateFlightModalProps) {
  const cancelButtonRef = useRef(null)
  const { open, setOpen } = props
  const [origin, setOrigin] = useState("")
  const [dest, setDest] = useState("")
  const [route, setRoute] = useState<GetAirportCodeResponse>()
  const [airlineCode, setAirlineCode] = useState("")
  const [datetime, setDatetime] = useState("")
  const [flightNumber, setFlightNumber] = useState("")
  const [durationMins, setDurationMins] = useState(0)
  const [distanceMiles, setDistanceMiles] = useState(0)

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-auto rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                      <WindowIcon className="h-6 w-6 text-blue-600" aria-hidden="true" />
                    </div>
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                        Create a Flight
                      </Dialog.Title>
                      <div className="mt-2">
                        <div className="pb-12">
                          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="sm:col-span-3">
                              <label className="block text-sm font-medium leading-6 text-gray-900">Origin</label>
                              <div className="mt-2">
                                { <AirportSelector isOriginSearch={true} dest={dest} isClearable={false} onChange={(s) => { 
                                    setOrigin(s?.value.airport_code || "")
                                    if (dest) {
                                      setRoute(s?.value)
                                    }
                                  }}/> }
                              </div>
                            </div>

                            <div className="sm:col-span-3">
                              <label className="block text-sm font-medium leading-6 text-gray-900">Destination</label>
                              <div className="mt-2">
                                { <AirportSelector isOriginSearch={false} origin={origin} isClearable={false} onChange={(s) => {
                                    setDest(s?.value.airport_code || "")
                                    if (origin) {
                                      setRoute(s?.value)
                                    }
                                  }}/> }
                              </div>
                            </div>

                            <div className="sm:col-span-6">
                              <label className="block text-sm font-medium leading-6 text-gray-900">Airline:</label>
                              <div className="mt-2">
                                { <AirlineSelector
                                    onChange={(s) => {
                                      setAirlineCode(s?.value || "") 
                                    }}
                                  />
                                }
                              </div>
                            </div>

                            <div className="sm:col-span-6">
                              <label className="block text-sm font-medium leading-6 text-gray-900">Equipment:</label>
                              <div className="mt-2">
                                <input
                                  disabled
                                  type="text"
                                  name="price"
                                  id="price"
                                  className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                  placeholder={route?.airplane_model}
                                />
                              </div>
                            </div>

                            <div className="sm:col-span-6">
                              <label className="block text-sm font-medium leading-6 text-gray-900">Flight Number:</label>
                              <div className="mt-2">
                                <input
                                  onChange={(v) => { setFlightNumber(v.target.value) }}
                                  type="text"
                                  name="price"
                                  id="price"
                                  className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                  placeholder="#"
                                />
                              </div>
                            </div>

                            <div className="sm:col-span-6">
                              <label className="block text-sm font-medium leading-6 text-gray-900">Duration (Minutes):</label>
                              <div className="mt-2">
                                <input
                                  onChange={(v) => { setDurationMins(Number(v.target.value)) }}
                                  type="number"
                                  name="price"
                                  id="price"
                                  className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                  placeholder=""
                                />
                              </div>
                            </div>

                            <div className="sm:col-span-6">
                              <label className="block text-sm font-medium leading-6 text-gray-900">Distance (Miles):</label>
                              <div className="mt-2">
                                <input
                                  onChange={(v) => { setDistanceMiles(Number(v.target.value)) }}
                                  type="number"
                                  name="price"
                                  id="price"
                                  className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                  placeholder=""
                                />
                              </div>
                            </div>

                            <div className="sm:col-span-6">
                              <label className="block text-sm font-medium leading-6 text-gray-900">Departure Time:</label>
                              <div className="mt-2">
                                <Datetime onChange={(t) => { setDatetime(t.format("YYYY-MM-DD HH:mm:ss")); console.log(datetime)} } />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                    onClick={() => { 
                      axios.get(
                        'https://localhost:8000/createflight',
                        {
                          params: {
                            route_id: route?.route_id,
                            flight_number: String(flightNumber),
                            departure_time: String(datetime),
                            airline_code: String(airlineCode),
                            distance_miles: distanceMiles,
                            duration_minutes: durationMins
                          }
                        }
                      ).then(response => {
                        if (response.status == 200 || response.status == 201) {
                          console.log("Good!")
                          alert("Flight Created")
                        } else {
                          console.log("TERRIBLE")
                        }
                        setOpen(false) 
                      })
                    }}
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => setOpen(false)}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}