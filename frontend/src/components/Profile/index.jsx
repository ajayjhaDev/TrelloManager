import { Avatar, Drawer } from '@mui/material'
import React, { useState } from 'react'
import "./style.css"

export default function Profile({userProfile}) {
   const [open, setOpen] = useState(false);
    const toggleDrawer = (newOpen) => () => {
      setOpen(newOpen);
    };
  return (
    <div>
        <Avatar  onClick={toggleDrawer(true)} style={{background:'#fff',color:'#106BFD'}}>
            <span className='avatar_text'>
                {userProfile?.name[0]}  
            </span>
        </Avatar>
        <Drawer open={open} onClose={toggleDrawer(false)} anchor='right' >
            <div style={{width:'100%',display:'flex',justifyContent: 'center'}}>
                <Avatar onClick={toggleDrawer(true)} className='profile_name'>
                    <span className='font_size'>{userProfile?.name[0]}</span>
                </Avatar>
            </div>
            <span className='profile_text'>{userProfile?.name}</span>
            <span className='profile_email'>{userProfile?.email}</span>

            <div style={{display:'flex',flexDirection:'column'}}>
                <span className='todo_pill'>No. of task in your Todo App : {userProfile?.tasks}</span>
            </div>
        </Drawer>

    </div>
  )
}
