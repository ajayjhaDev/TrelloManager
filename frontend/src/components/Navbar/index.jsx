import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NotepadIcon from '../../assets/white-notepad.png';
import './style.css';
import Profile from '../Profile';
import { getUserProfileApi } from './Api/api';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ClipLoader } from 'react-spinners';

export default function Navbar() {
  const navigate = useNavigate();
  const path = location.pathname;
  const active = path.includes('/sign-in');
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  const [userProfile,setUserProfile] = useState(null);
  const [loader,setLoader] = useState(false);

  const getUserProfile = useQuery({
    queryKey: ["getUserProfile"],
    queryFn: () => getUserProfileApi(userId,token),
    refetchOnWindowFocus: false,
    refetchOnmount: false,
    refetchOnReconnect: false,
    retry: false,
    enabled: userId!==null && token!==null,
    onSuccess:(response)=>{
        let message = '';
        if(response.status===200){
          setUserProfile(response.data);
        }
        else{
            message=response?.response?.data?.message;
            toast.error(message);
        }
    },
    onError:(err)=>{
        let message = response?.response?.data?.message;
        toast.error(err);
    }
  });

  useEffect(()=>{setLoader(getUserProfile?.isFetching)},[getUserProfile?.isFetching])
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignup = () => {
    navigate('/sign-in');
  };

  return (
    <div style={{
      width: '100%', height: 50, background: '#0c6dfd',
      display: 'flex', justifyContent: 'space-between',
      alignItems: 'center', position: 'sticky'
    }}>
      <div style={{ padding: 8, width: '5%',cursor:'pointer' }} onClick={()=>(navigate('/'))}>
        <img style={{ width: 30, height: 30, objectFit: 'cover' }} src={NotepadIcon} alt="notepad icon" />
      </div>
      <div style={{ width: 120, display: 'flex', gap: 28, paddingRight: 8 }}>
        {!token && (
          <>
            <button className={`${!active ? 'active' : 'non_active'}`} onClick={handleLogin}>
              Login
            </button>
            <button className={`${active ? 'active' : 'non_active'}`} onClick={handleSignup}>
              SignUp
            </button>
          </>
        )}
        {token && (
          <div className='profile'>
            <button className='logout_btn' type='button' onClick={handleLogout}>
              Logout
            </button>
            {loader && <div><ClipLoader color={'#fff'}/></div>}
            {!loader && <Profile userProfile={userProfile}/>}
          </div>

        )}
      </div>
    </div>
  );
}
