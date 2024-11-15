import React from 'react'

export const LayoutLoader = () => {
    return (
        <div className='h-[calc(100vh_-_4rem)]  grid grid-cols-12 gap-2'>
            <div className='hidden  sm:block sm:col-span-3 md:cols-3 '>
                <div className='flex flex-col gap-2 justify-evenly h-full p-2'>
                {
                    Array.from({ length: 10 }).map((_, index) => (
                        <div key={index} className=' h-12 flex items-center justify-start gap-4 '>
                            <div className=' w-12 h-full rounded-full animate-pulse bg-slate-200'></div>
                            <div className='flex-1 flex flex-col gap-4 '>
                                <div className='h-2 w-1/2  rounded-sm animate-pulse bg-slate-200'></div>
                                <div className='h-2  animate-pulse bg-slate-200 rounded-sm'></div>
                            </div>
                        </div>
                    ))
                }
                </div>
            </div>
            <div className='col-span-12 sm:col-span-8 md:col-span-5 lg:col-span-6   '>
            <div className='flex flex-col gap-2 p-2'>
                {
                    Array.from({ length: 20 }).map((_, index) => (
                        <div key={index} className={`animate-pulse bg-slate-50/80  h-2 rounded-md ${index%2==0?"self-start w-3/5":"w-1/4 self-end"}`}></div>
                    ))
                }
                </div>
            </div>
            <div className='hidden md:block md:col-span-4 lg:col-span-3  gap-4 '>
                
            </div>
        </div>
    )
}
