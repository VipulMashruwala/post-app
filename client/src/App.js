import React,{useEffect , createContext,useReducer ,useContext} from 'react';
import { Route, Switch ,useHistory } from 'react-router-dom';
import './App.css';
import NavBar from './components/NavBar';
import {BrowserRouter} from 'react-router-dom'
import Home from './pages/Home';
import Profile from './pages/Profile';
import UserProfile from './pages/UserProfile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CreatePost from './pages/CreatePost';
import {reducer , initialState } from './reducers/userReducer'


export const UserContext = createContext()

const Routing = () => {
      const history = useHistory();
      const {state,dispatch} = useContext(UserContext)
      useEffect(()=>{
            const user = JSON.parse(localStorage.getItem("user"))
            if(user){
                  dispatch({type: "USER",payload:user})
                  // history.replace('/')
            }
            else{
                  history.replace('/login')
            }
      },[])

      return(
            <Switch>
            <Route exact path='/'>
                  <Home />
            </Route>
            
            <Route exact path='/login'>
                  <Login />
            </Route>
            <Route exact path='/signup'>
                  <Signup />
            </Route>
            <Route exact path='/createpost'>
                  <CreatePost />
            </Route>
            <Route exact path='/profile'>
                  <Profile />
            </Route>
            <Route exact path='/profile/:userID'>
                  <UserProfile />
            </Route>
          </Switch>
      )
}

function App() {
      const [state , dispatch] = useReducer(reducer,initialState)
  return (
    <UserContext.Provider value={{state,dispatch}}>
            <BrowserRouter>
                  <NavBar />
                  <Routing />
            </BrowserRouter>
    </UserContext.Provider>   
  
  );
}

export default App;
