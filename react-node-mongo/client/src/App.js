import './App.css';

import { useState } from "react";
import axios from 'axios'
import Cookies from 'universal-cookie';

import {
  BrowserRouter as Router,
  Routes, Route, Link,
  useMatch, useParams,
  createSearchParams, useNavigate, useLocation
} from 'react-router-dom'

const backendUrl = "http://localhost:3001";

import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';

function App() {
  const [user, setUser] = useState({});
  const cookies = new Cookies();

  if (!user.hasOwnProperty('token') && cookies.get('jwt-token') != undefined)
    setUser({token: cookies.get('jwt-token'), login: cookies.get('login')});

  return (
    <Router>
      { user.hasOwnProperty('token') ? <HomePage user={user} setUser={setUser} /> : <AuthPage user={user} setUser={setUser} /> }
    </Router>
  );
}

export default App;
