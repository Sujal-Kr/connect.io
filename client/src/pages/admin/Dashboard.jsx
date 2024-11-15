import React from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import { AdminPanelSettingsOutlined, GroupsOutlined, MessageOutlined, NotificationsOutlined, PeopleAltOutlined, Person2Outlined, SearchOutlined } from '@mui/icons-material'
import moment from 'moment'
import { DougnutChart, LineChart } from '../../components/specific/Charts'


const Dashboard = () => {
    const Widgets = <div>
        <div className=' grid grid-cols-3 gap-3 '>
            <Widget title="Users" value="34" icon={<PeopleAltOutlined sx={{fontSize:"1.5rem"}}/>}/>
            <Widget title="Groups" value="12" icon={<GroupsOutlined sx={{fontSize:"1.5rem"}}/>}/>
            <Widget title="Messages" value="300+" icon={<MessageOutlined sx={{fontSize:"1.5rem"}}/>}/>
        </div>
    </div>

    const Appbar = (
        <div className='bg-white shadow md:shadow rounded-xl py-5 px-3 md:p-6 flex items-center gap-3 '>
            <AdminPanelSettingsOutlined sx={{
                fontSize: { sm: '1rem', md: '2rem' }
            }} />
            <div className='flex flex-1 text-xs gap-2'>
                <input type="text"
                    className='p-2 border outline-none  rounded-lg w-full max-w-xs'
                    placeholder='Search..' />
                <button className='md:px-4 md:py-2 p-2  bg-primary rounded-lg border border-primary text-white flex gap-1 items-center  '><SearchOutlined fontSize='small' /><span className='hidden md:block'>Search</span></button>
            </div>
            <p className=' hidden md:block'>{moment().format('DD MMMM  yyyy')}</p>
            <NotificationsOutlined />
        </div>
    )

    return (
        <AdminLayout>
            <div className='flex flex-col gap-4'>
                <div className=''>
                    {Appbar}
                </div>
                <div className='flex  flex-wrap gap-4'>
                    <div className='shadow md:shadow rounded-xl flex-1 bg-white p-3 md:p-6 '>
                        <h1 className='text-3xl'>Last Messages</h1>
                        <LineChart/>
                    </div>
                    <div className='shadow md:shadow rounded    max-w-md flex-shrink-0 bg-white p-3 md:p-6 '>
                        <h4>Dougnut Chart</h4>
                        <DougnutChart value={[12,45]} labels={["Single Chat","Group Chat"]}/>
                        <div className='flex  justify-center items-center gap-2 mt-4 text-xs '>
                            <GroupsOutlined/>
                            <span className='font-semibold'>Vs </span>
                            <Person2Outlined/>
                        </div>
                    </div>
                </div>
                {Widgets}
            </div>
        </AdminLayout>
    )
}
const Widget = ({ title, value, icon }) => (
    <div className='flex flex-col  items-center justify-center 
     shadow rounded-3xl bg-white p-5 '>
        <p className='text-xl md:text-4xl font-semibold p-2'>{value}</p>
        {icon}
        <p className='text-slate-500 text-sm'>{title}</p>

    </div>
)
export default Dashboard