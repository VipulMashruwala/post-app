import React, { useState , useContext} from 'react';
import {UserContext} from '../App'
import { Link , useHistory} from 'react-router-dom';
import M from 'materialize-css';

const Login = () => {

    const history = useHistory();
    const {state, dispatch} = useContext(UserContext)
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const loginHandler = (event) => {

        console.log(email)
        console.log(password)

        // let mailformat = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        // if (email && !email.match(mailformat)) {
        //     M.toast({ html: "Invalid Credentials" });
        //     return;
        // }

        const userData = {
            email: email,
            password: password
        }

        fetch('/login', {
            method: 'POST',
            body: JSON.stringify(userData),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(resp => resp.json())
        .then(data => {
            if(data.error){
                M.toast({html: data.error , classes:"signup-error"});
            }
            else{
                // console.log(data.user)
                localStorage.setItem("jwt",data.token)
                localStorage.setItem("user", JSON.stringify(data.user))
                dispatch({type: "USER", payload: data.user})
                // const {userName , userEmail } = data.user;
                // console.log(userName);
                // console.log(userEmail);
                M.toast({html: "Login Successfully!" , classes:"signup-message"});
                    history.replace('/');
            }
        })
    
            event.preventDefault();
    }

    return (
        <>
            <div className="signup">
                <div className="card auth-card">
                    <div className="row">
                        <h4 className="instagram-title">Instagram</h4>
                        <form className="col s12">
                            <div className="row">
                                <div className="input-field col s12">
                                    <input id="email" type="email" className="validate"
                                        onChange={(event) => setEmail(event.target.value)} />
                                    <label htmlFor="email"><i className="material-icons text-icon">email</i>Email</label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-field col s12">
                                    <input id="password" type="password" className="validate"
                                        onChange={(event) => setPassword(event.target.value)} />
                                    <label htmlFor="password"><i className="material-icons text-icon">lock</i>Password</label>
                                </div>
                            </div>

                            <button className="btn waves-effect waves-light "
                                type="submit" name="action"
                                onClick={loginHandler}>
                                Login
                            </button>
                            <p><Link to="/signup">create an account</Link></p>

                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login;