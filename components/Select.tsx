'use client'

import { Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import ChevronUpDownIcon from '../public/chevrons-up-down.svg'
import CheckIcon from '../public/check-solid.svg'
import Image from 'next/image'
import { UserNotification } from '../interface/AddInterfaces'

interface SelectProps {
    users?: UserNotification[];
    selectedUser: UserNotification | null;
    onChangeSelectedUser: (user: UserNotification) => void;
}

export default function Select({ users = [], selectedUser, onChangeSelectedUser }: SelectProps) {
    return (
        <Listbox value={selectedUser} onChange={onChangeSelectedUser}>
            <Label className="block text-sm/6 font-medium text-white">Assigned to</Label>
            <div className="relative mt-2 mb-5">
                <ListboxButton className="grid w-full cursor-default grid-cols-1 rounded-md bg-gray-300 py-1.5 pr-2 pl-3 text-left text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
                    <span className="col-start-1 row-start-1 flex items-center gap-3 pr-6">
                        {selectedUser === null ? null : <Image width={500} height={500} alt="Selected user" src={selectedUser?.photoUrl} className="size-5 shrink-0 rounded-full" />}
                        <span className="block truncate">{selectedUser?.name} {selectedUser?.surname}</span>
                    </span>
                    <Image src={ChevronUpDownIcon} width={500} height={500}
                        aria-hidden="true" alt="Chevron Icon"
                        className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                    />
                </ListboxButton>

                <ListboxOptions
                    transition
                    className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-gray-300 py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-hidden data-leave:transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0 sm:text-sm"
                >
                    {users.map((user) => (
                        <ListboxOption
                            key={user.id}
                            value={user}
                            className="group relative cursor-default py-2 pr-9 pl-3 text-gray-900 select-none data-focus:bg-indigo-600 data-focus:text-white data-focus:outline-hidden"
                        >
                            <div className="flex items-center">
                                <Image alt="User Image" src={user.photoUrl} className="size-5 shrink-0 rounded-full" width={500} height={500} />
                                <span className="ml-3 block truncate font-normal group-data-selected:font-semibold">{user.name} {user.surname}</span>
                            </div>

                            <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-not-data-selected:hidden group-data-focus:text-white">
                                <Image src={CheckIcon} alt='Check Icon' width={500} height={500} aria-hidden="true" className="size-5" />
                            </span>
                        </ListboxOption>
                    ))}
                </ListboxOptions>
            </div>
        </Listbox>
    )
}
