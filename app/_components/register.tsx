'use client'
import { Button } from '@nextui-org/button';

import { Input } from '@nextui-org/react';
import { toast, Toaster } from 'react-hot-toast';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { subscribe } from '@/utils/actions';




export default function EventRegisterForm() {

  const router = useRouter()
  const [inputValue, setInputValue] = useState('')


  const submitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event?.preventDefault()
    try {
      if (inputValue === '') {
        toast.error('Please enter a username')
        throw new Error('Please enter a username')
      }
      await toast.promise(
        subscribe(inputValue)
        , {
          loading: 'Making subscription...',
          success: (response) => response,
          error: (error) => error.message
        })
      router.refresh()
      setInputValue('')
      return true;
    } catch (error) {
      router.refresh()
      setInputValue('')
      return false
    }

  }

  return (
    <>
      <div className='flex flex-col gap-4 items-center justify-center center '>
        <h1 className='text-4xl font-bold z-10'>Create subscription</h1>
        <form className='grid grid-rows-2  z-30 gap-2 justify-items-center align-middle' onSubmit={submitHandler}>
          <Input
            type='text'
            name='streamer'
            value={inputValue}
            onClear={() => setInputValue('')}
            isClearable
            className=' max-w-[250px] z-40 max-h-[50px] col-span-2 '
            classNames={{
              label: [
                "text-stone-400",
                "group-data-[filled-within=true]:text-indigo-400"

              ],
              inputWrapper: [
                "group-data-[focus=true]:border-indigo-800",
                "group-data-[hover=true]:border-grey-400"
              ]
            }} radius='md' variant='bordered' labelPlacement='inside' color='danger' label='Username' onChange={(event) => setInputValue(event.target.value)} />

          <Button size='sm' className=' col-span-2 font-semibold' color='primary' variant='shadow' type='submit'>SUBSCRIBE</Button>

        </form>
      </div>
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
    </>


  )
}