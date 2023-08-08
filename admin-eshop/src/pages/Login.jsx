import React, { useState } from 'react'
import CustomInput from '../components/CustomInput'
import{Link} from 'react-router-dom'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Email :', email)
    console.log('Password :', password)
    setEmail('')
    setPassword('')
  }

  return (
    <div className='py-5' style={{background: "#ffd333", minHeight: "100vh"}}>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <div className='my-5 w-25 bg-white rounded-3 mx-auto p-4'>
           <h3 className='text-center'>Đăng nhập</h3>
           <p className='text-center'>Đăng nhập vào tài khoảng của bạn</p>
           <form action='' onSubmit={handleSubmit}>
           <CustomInput 
           type="text" 
           label="Email Address" 
           id="email"
           value = {email}
           onChange= {handleEmailChange}
           />
            <CustomInput 
            type="password" 
            label="Password" 
            id="pass"
            value = {password}
            onChange= {handlePasswordChange}
            />
            <div className='mb3 text-end'>
                <Link
                to='/forgot-password'
                className=''
                >Quên mật khẩu?</Link>
            </div>
           <Link
            className='border-0 px-3 py-2 text-white fw-bold w-100 text-center text-decoration-none fs-5' 
           style={{background: "#ffd333"}}
           type='submit'

           >Đăng nhập</Link>
           </form>
        </div>
    </div>
  )
}

export default Login