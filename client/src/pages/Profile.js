import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../App'

import './Profile.css'

const Profile = () => {
    const { state, dispatch } = useContext(UserContext)
    const [mypost, setMypost] = useState(null)
    const [image, setImage] = useState("")
    // const [imageUrl, setImageUrl] = useState("")  ////  it will not work in case of default
    // const [imageUrl, setImageUrl] = useState(undefined)

    // console.log(state._id)
    useEffect(() => {
        fetch('/myposts', {
            method: 'GET',
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(resp => resp.json())
            .then(data => {
                // setMypost(data)
                console.log(data)
                setMypost(data)

            })
        .catch(err => console.log(err))

    }, [])
    // console.log(mypost)

    // useEffect(() => {
        
    //     fetch(`/user/${state._id}`, {
    //         headers: {
    //             "Authorization": "Bearer " + localStorage.getItem("jwt")
    //         }
    //     }).then(resp => resp.json())
    //         .then(data => {
    //             console.log(data)
    //             setMypost(data)
    //         })
    //         .catch(err => console.log(err))
    // }, [])

    useEffect(() => {
        if (image) {
            const formData = new FormData();
            formData.append('file', image);
            formData.append("upload_preset", "insta-clone")
            formData.append("cloud_name", "vipul17")

            fetch('https://api.cloudinary.com/v1_1/vipul17/image/upload', {
                method: 'POST',
                body: formData

            }).then(resp => resp.json())
                .then(data => {
                    // console.log(data)
                    // setImageUrl(data.url);
                    
                    fetch('/updateimage',{
                        method:'PUT',
                        body: JSON.stringify({
                            userImage: data.url
                        }),
                        headers:{
                            'Content-Type': 'application/json',
                            "Authorization": "Bearer " + localStorage.getItem("jwt")
                        }
                    })
                    .then(resp => resp.json())
                    .then(result => {
                            localStorage.setItem('user',JSON.stringify({...state , userImage : result.userImage}))
                            dispatch({type: "UPDATE_IMAGE", payload: result.userImage})
                    })
                    .catch(err => console.log(err))
                })
                .catch(err => console.log(err))
        }
    }, [image])

    const updateProfileImage = (file) => {
        setImage(file)
    }

    // const userData = JSON.parse(localStorage.getItem('user')).name
    return (
        <>{mypost
            ?
            <div>
                <div className="card profile-class">
                    <div className="img-class">
                        <img src={state ? state.userImage : 'Loading...'} className="profile-img" alt="My Image" />
                        <div className="file-field input-field">
                            <div className="btn update-img-btn">
                                <span>Photo<i className="material-icons right">file_upload</i></span>
                                <input type="file" onChange={(event) => updateProfileImage(event.target.files[0])} />
                            </div>
                            <div className="file-path-wrapper">
                                <input className="file-path validate" type="text" />
                            </div>

                        </div>
                    </div>

                    <div className="profile-data">
                        <h4>{mypost.user.name}</h4>
                        <div className="follow-class">
                            <div className="follow-data">{mypost.myposts.length} post</div>
                            <div className="follow-data">{mypost.user.followers.length} followers</div>
                            <div className="follow-data">{mypost.user.following.length} followings</div>
                        </div>


                    </div>

                </div>
                <h5>Posts</h5>
                {mypost.myposts.length ? mypost.myposts.map(item => {
                    return (
                        <div className="wrapper">
                            <div className="item">
                                <div className=" card img-card">
                                    <div className="card-image waves-effect waves-block waves-light">
                                        <img className="activator post-img-size" src={item.image} alt="My Post" />
                                    </div>
                                    <div className="card-content">
                                        <span className="card-title activator grey-text text-darken-4"><p className="post-img-title comment-class">{item.title}</p>
                                            <i className="material-icons right post-img-title">comments</i></span>

                                    </div>
                                    <div className="card-reveal">
                                        <span className="card-title grey-text text-darken-4">Content<i className="material-icons right post-img-title">close</i></span>
                                        <p>{item.body}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }) : <h5>No Post Yet</h5>}
            </div>
            :
            <div>Loading</div>
        }




        </>
    )
}

export default Profile;