import React, { lazy, Suspense, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Route, Routes } from 'react-router-dom';
import ProtectRoute from './components/auth/ProtectRoute';
import { LayoutLoader } from './components/layout/Loaders';
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux';
import { server } from './constants/config';
import { userExists, userNotExists } from './redux/slices/auth';
import { SocketProvider } from './socket';



// Lazy loading components
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Groups = lazy(() => import('./pages/Groups'));
const Chat = lazy(() => import('./pages/Chat'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'))
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'))
const ChatManagment = lazy(() => import('./pages/admin/ChatManagment'))
const Messages = lazy(() => import('./pages/admin/Messages'))
const UserManagement = lazy(() => import('./pages/admin/UserManagement'))


const App = () => {
  const { user, loader } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  useEffect(() => {
    axios.get(`${server}/api/v1/user/profile`, { withCredentials: true })
      .then(({ data }) => {
        if (data.success) {
          dispatch(userExists(data.user))
        }
      })
      .catch((err) => {

        dispatch(userNotExists())
        console.error(err.response?.data?.message || err.message)
      })

  }, [dispatch])

  if(loader==true){
    return <LayoutLoader/>
  }
  return (
    <>
      <Suspense fallback={<LayoutLoader />}>
        <Toaster position="top-right" />
        <Routes>
          <Route element={<ProtectRoute user={user} />}>

            <Route path='/' element={
              <SocketProvider>
                <Home />
              </SocketProvider>
            } />

            <Route path='/chat/:chatId' element={
              <SocketProvider>
                <Chat />
              </SocketProvider>
            } />
            <Route path='/groups' element={
              <SocketProvider>
                <Groups />
              </SocketProvider>
            } />
          </Route>
          <Route element={<ProtectRoute user={!user} redirect='/' />}>
            <Route path='/login' element={<Login />} />
          </Route>

          <Route path='/admin' element={<AdminLogin />} />
          <Route path='/admin/dashboard' element={<Dashboard />} />
          <Route path='/admin/users' element={<UserManagement />} />
          <Route path='/admin/chats' element={<ChatManagment />} />
          <Route path='/admin/messages' element={<Messages />} />

          <Route path='*' element={<NotFound />} />
        </Routes>
      </Suspense >
    </>
  )
};

export default App;
