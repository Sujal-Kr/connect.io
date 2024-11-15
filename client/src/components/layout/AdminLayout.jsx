import { CloseOutlined, MenuOutlined } from '@mui/icons-material';
import { Drawer, IconButton } from '@mui/material';
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { tabs } from '../constants/route';


export const Sidebar = () => {
    const pathname = useLocation().pathname
    console.log(pathname)
    return (
        <div className='p-6'>
            <h3 className='text-xl '>Connect.io</h3>
            <div className='flex flex-col gap-2 my-4 md:p-4'>
                {
                    tabs?.map((tab, index) => (
                        <Link key={index} to={tab.path} className={`sm:text-sm flex gap-2 items-center 
                         hover:bg-primary hover:text-white rounded-3xl p-3 md:px-6 sm:px-3 hover:shadow-sm md:py-4 text-xs 
                        ${pathname === tab.path && "bg-primary shadow-xl text-white"}`}>
                            <tab.icon />
                            {tab.name}
                        </Link>
                    ))
                }
            </div>
        </div>
    )
}

const   AdminLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    return (
        <div className="grid grid-cols-12 h-screen ">
            {/* Mobile menu button */}
            <div className="fixed top-4 right-4 z-20 md:hidden">
                <IconButton onClick={toggleSidebar} >
                    {isSidebarOpen ? <CloseOutlined /> : <MenuOutlined />}
                </IconButton>
            </div>

            {/* Desktop sidebar */}
            <div className="hidden md:block md:col-span-4  lg:col-span-3">
                <Sidebar />
            </div>

            {/* Main content */}
            <div className="col-span-12 md:col-span-8 lg:col-span-9 overflow-y-auto bg-slate-100 p-2 md:p-6 ">
                {children}
            </div>

            {/* Mobile sidebar drawer */}
            <Drawer
                anchor="left"
                open={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                classes={{ paper: 'w-3/4 sm:w-1/2' }}
            >
                <Sidebar />
            </Drawer>
        </div>
    );
};

export default AdminLayout;