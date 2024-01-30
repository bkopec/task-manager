import { useState, useRef, useEffect } from "react";
import axios from 'axios'
import config from '../config.js'
import Cookies from 'universal-cookie';

const backendUrl = config.backendUrl;


function AuthPage({user, setUser}) {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({passwordTooShort: false, passwordInvalid : false});
  
    const handleInputChange = (event, setter) =>  {
      setter(event.target.value);
      setErrors({...errors, passwordInvalid:false, passwordTooShort:false});
    };
  
    const handleSubmit = (event) => {
      event.preventDefault();
  
      const postData = {};
      postData.login = login;
      postData.password = password;
      if (password.length < 4) {
        setErrors({...errors, passwordTooShort:true});
        return;
      }
      axios
      .post(backendUrl + '/api/users', postData)
      .then(response => {
        setUser({token: response.data.token, login: response.data.login});
        const cookies = new Cookies();
        cookies.set("jwt-token", response.data.token);
        cookies.set("login", response.data.login);
      })
      .catch(error => {
        if (error.response && error.response.status == 401) {
          const data = error.response.data;
          if (data.error == "INVALID_PASSWORD") {
            setErrors({...errors, passwordInvalid:true});
            }
        else
          console.log(error);
      }});
    };

    return (
      <div>
        <h1>Login and register</h1>
        <form className="signupForm">
        <input className={errors.passwordInvalid ? "inError" : null} placeholder="Username" onChange={(e) => handleInputChange(e, setLogin)} name="login" />
      {errors.passwordInvalid &&
      <p className="error">This username is already in use, or you input the wrong password.</p>
      }
        <input className={errors.passwordInvalid || errors.passwordTooShort ? "inError" : null} placeholder="" onChange={(e) => handleInputChange(e, setPassword)} type='password' name="password" />
      {errors.passwordTooShort && 
      <p className="error">Password needs at least four characters</p>} 
        <button label="Sign Up" onClick={handleSubmit} type="submit">Submit</button>
        </form>
      </div>
    )
  }
  
  export default AuthPage;