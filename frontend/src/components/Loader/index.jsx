import React from 'react'
import { BarLoader } from 'react-spinners'

export default function Loader() {
  return (
    <div style={{width:'100%',display:'flex',justifyContent:'center',marginTop:10}}>
        <BarLoader color='rgb(14,108,253)'/>
    </div>
  )
}
