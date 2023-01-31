import React, { useState,useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import M from 'materialize-css'
import './Signup.css'

const Signup = () => {

    const history = useHistory();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [image, setImage] = useState("")
    // const [imageUrl, setImageUrl] = useState("")  ////  it will not work in case of default
    const [imageUrl, setImageUrl] = useState(undefined)

    useEffect(()=>{
        if(imageUrl){
            postUserData()
        }

    },[imageUrl])

    const uploadImage = () =>{
        const formData = new FormData();
        formData.append('file', image);
        formData.append("upload_preset","insta-clone")
        formData.append("cloud_name","vipul17")

        fetch('https://api.cloudinary.com/v1_1/vipul17/image/upload',{
            method: 'POST',
            body: formData
           
        }).then(resp => resp.json())
        .then(data => {
            setImageUrl(data.url);
        })
        .catch(err => console.log(err))  
    }

    const postUserData = () => {
        // let mailformat = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        // if (email && !email.match(mailformat)) {
        //     M.toast({ html: "Invalid Credentials" });
        //     return;
        // }
        console.log(username)
        console.log(email)
        console.log(password)
        console.log(image)
        // event.preventDefault();

        const userData = {
            name: username,
            email: email,
            password: password,
            userImage: imageUrl 
        }

        fetch('/signup', {
            method: 'POST',
            body: JSON.stringify(userData),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(resp => resp.json())
            .then(data => {
                console.log(data)
                if (data.error) {
                    M.toast({ html: data.error, classes: "signup-error" });
                }
                if (data.message) {
                    M.toast({ html: data.message, classes: "signup-message" });
                    history.replace('/login');
                }

            })
            .catch(err => console.log(err))
    }

    const postCredentials = (event) => {
        if(image){
            uploadImage()
        }
        else{
            postUserData()
        }
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
                                    <input id="name" type="text" className="validate"
                                        onChange={(event) => setUsername(event.target.value)} />
                                    <label htmlFor="name">
                                        <i className="material-icons text-icon">perm_identity</i>
                                        Username
                                    </label>
                                </div>

                            </div>

                            <div className="file-field input-field">
                                <div className="btn">
                                    <span>Image<i className="material-icons right">file_upload</i></span>
                                    <input type="file" onChange={(event) => setImage(event.target.files[0])} />
                                </div>
                                <div className="file-path-wrapper">
                                    <input className="file-path validate" type="text" />
                                </div>
                            </div>

                            <div className="row">
                                <div className="input-field col s12">
                                    <input id="email" type="email" className="validate"
                                        onChange={(event) => setEmail(event.target.value)} />
                                    <label htmlFor="email"><i className="material-icons text-icon">email</i>
                                        Email
                                    </label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-field col s12">
                                    <input id="password" type="password" className="validate"
                                        onChange={(event) => setPassword(event.target.value)} />
                                    <label htmlFor="password"><i className="material-icons text-icon">lock</i>
                                        Password
                                    </label>
                                </div>
                            </div>
                            <div className="signup-btn">
                                <button className="btn waves-effect waves-light "
                                    type="submit" name="action"
                                    onClick={postCredentials}>
                                    Sign up
                                </button>
                            </div>
                            <p><Link to="/login">already have an account</Link></p>

                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Signup;