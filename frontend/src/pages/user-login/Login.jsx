import React from 'react'
import userLoginStore from '../../store/useUserStore'

const Login = () => {
  const {step, setStep, setUserPhoneData, userPhoneData, resetLoginState} = userLoginStore();
  return (
    <div>Login</div>
  )
}

export default Login