import { Field, Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import * as yup from 'yup'
import "./style.css"
import { useQuery } from '@tanstack/react-query';
import { registerApi } from './Api/api';
import toast from 'react-hot-toast';
import {ClipLoader} from "react-spinners"
import { useNavigate } from 'react-router-dom';
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
export default function Register() {
  const URL = import.meta.env.VITE_BACKEND_URL
  const navigate= useNavigate();
  const [payload,setPayload] = useState(null);
  const [loader,setLoader] = useState('');
  const [errors,setError] = useState({});
  const [googleLoader,setGoogleLoader] = useState(false);
    


  const registerUser = useQuery({
        queryKey: ["registerUser",payload],
        queryFn: () => registerApi(payload),
        refetchOnWindowFocus: false,
        refetchOnmount: false,
        refetchOnReconnect: false,
        retry: false,
        enabled: payload!=null && Object.keys(errors).length === 0,
        onSuccess:(response)=>{
            
            let message = '';
            if(response.status===200){
                message=response?.data?.message;
                toast.success(message);
                navigate('/login');
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
    useEffect(()=>{
        setLoader(registerUser?.isFetching);
    },[registerUser?.isFetching])

    const handleSubmit = (values,errors,resetForm)=>{
        setError(errors);
        const size = Object.keys(errors).length;
        if(size>0){
            toast.error("Please fix all the errors before submitting")
        }
        else{
            setPayload(values);
            resetForm();
        }

        
    }
    const initialSchema = {
        first_name: '',
        last_name:'',
        email:'',
        password: '',
        confirm_password: '',
    }
    const validationSchema = yup.object().shape({
        first_name: yup.string().required("Required"),
        last_name: yup.string().required("Required"),
        email: yup.string().email('Invalid email').required('Required'),
        password: yup.string()
            .required('Please enter your password')
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                'Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character'
            ),
        confirm_password: yup.string()
            .oneOf([yup.ref('password'), null], 'Passwords must match')
            .required('Please confirm your password'),
    });
    
    const googleLogin = useGoogleLogin({
        onSuccess: (codeResponse) => {
          setGoogleLoader(true);
          // Send the authorization code to the backend server
          fetch(`${URL}/api/v3/auth/google`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code: codeResponse.code }),
          })
          .then(response => response.json())
          .then(data => {
            setGoogleLoader(false);
            var decode = jwtDecode(data.id_token)
            const payload = {"first_name":decode.name,"last_name":'',"email":decode.email,"password":decode.sub};
            setPayload(payload);registerUser.refetch();
          })
          .catch(error => {
            setGoogleLoader(false);
            console.error('Error:', error);
          });
        },
        onError: () => {
          // Handle login errors here
          setGoogleLoader(false);
          console.error('Google login failed');
        },
        flow: 'auth-code',
    });

  return (
    <Formik initialValues={initialSchema} validationSchema={validationSchema}>
      {({ values, errors, handleChange, handleBlur, touched,resetForm,isValid,dirty}) => (
        <div>
          <Form>
            <div className='form_container'>
                <div className='form_inner_container'>
                    <h2 className='title_style' style={{width:'100%'}}>Signup</h2>
                <div>
                </div>
                <div className='input_div_container'>
                    <div className='input_div' style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Field
                        onChange={handleChange('first_name')}
                        onBlur={handleBlur('first_name')}
                        type="text" placeholder="First Name"
                        value={values.first_name}
                        className='input_style'
                        />
                        {touched.first_name && errors.first_name && <p className='error_text'>{errors.first_name}</p>}
                    </div>
                    <div className='input_div' style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Field
                        onChange={handleChange('last_name')}
                        onBlur={handleBlur('last_name')}
                        type="text" placeholder="Last Name"
                        value={values.last_name}
                        className='input_style'
                        />
                        {touched.last_name && errors.last_name && <p className='error_text'>{errors.last_name}</p>}
                    </div>
                    <div className='input_div' style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Field
                        onChange={handleChange('email')}
                        onBlur={handleBlur('email')}
                        type="text" placeholder="Email"
                        value={values.email}
                        className='input_style'
                        />
                        {touched.email && errors.email && <p className='error_text'>{errors.email}</p>}
                    </div>
                    <div className='input_div' style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Field
                        onChange={handleChange('password')}
                        onBlur={handleBlur('password')}
                        type="password" placeholder="Password"
                        value={values.password}
                        className='input_style'
                        />
                        {touched.password && errors.password && <p className='error_text'>{errors.password}</p>}
                    </div>
                    <div className='input_div' style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Field
                        onChange={handleChange('confirm_password')}
                        onBlur={handleBlur('confirm_password')}
                        type="password" placeholder="Confirm Password"
                        value={values.confirm_password}
                        className='input_style'
                        />
                        {touched.confirm_password && errors.confirm_password && <p className='error_text'>{errors.confirm_password}</p>}
                    </div>
                    {loader && <div className='login_google_verification'>
                      Registering your id ...
                      <ClipLoader/>
                    </div>}
                    {!loader && <button type="button" className='btn' disabled={!isValid || !dirty}
                     style={{opacity:(!isValid || !dirty)?0.5:1}}
                     onClick={()=>handleSubmit(values,errors,resetForm)}>
                        Signup
                    </button>}
                {googleLoader && <div className='login_google_verification'>Google verification is going on <ClipLoader/></div>}
                <div className='google_sign_container'>
                    <span>Already have an account ? <a href='/login' className='redirect'>Login</a></span>
                    <button className='goggle_btn' type="button" onClick={googleLogin}>Signup with <span>Google</span></button>
                </div>
                </div>
                </div>
            </div>
            

          </Form>
        </div>
      )}
    </Formik>
  )
}
