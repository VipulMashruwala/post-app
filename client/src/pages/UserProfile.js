import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../App'
import profileImg from '../profile.jpg';
import {useHistory} from 'react-router-dom'
import { useParams } from 'react-router-dom';
import './Profile.css'

const UserProfile = () => {
    const { state, dispatch } = useContext(UserContext)
    const [mypost, setMypost] = useState(null)  ////// Note : Don't use useState([]) , instead  useState(null)
    const { userID } = useParams()
    const [follow, setFollow] = useState(state ? !state.following.includes(userID): true)
    const history = useHistory()

   

    // console.log(userID)

    

    useEffect(() => {
        fetch(`/user/${userID}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(resp => resp.json())
            .then(data => {
                if(data.user._id == state._id){
                    history.replace('/profile')
                }
                else{

                }
                setMypost(data)
                console.log(data)
            })
            .catch(err => console.log(err))
    }, [])

    const followHandler = (followId) => {
        fetch('/follow', {
            method: 'PUT',
            body: JSON.stringify({
                followId: followId
            }),
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
            .then(resp => resp.json())
            .then(data => {
                // setMypost(data)
                console.log(data)
                dispatch({
                    type: 'UPDATE', payload: {
                        followers: data.followers,
                        following: data.following
                    }
                })
                localStorage.setItem('user', JSON.stringify(data))
                setMypost((prevState) => {
                    return {
                        ...prevState,
                        user: {
                            ...prevState.user,
                            followers: [...prevState.user.followers, data._id]
                        }
                    }
                })
                setFollow(false)
            })
    }

    const unfollowHandler = (unfollowId) => {
        fetch('/unfollow', {
            method: 'PUT',
            body: JSON.stringify({
                unfollowId: unfollowId
            }),
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
            .then(resp => resp.json())
            .then(data => {
                // setMypost(data)
                console.log(data)
                dispatch({
                    type: 'UPDATE', payload: {
                        followers: data.followers,
                        following: data.following
                    }
                })
                localStorage.setItem('user', JSON.stringify(data))
                setMypost((prevState) => {
                    const newfollower = prevState.user.followers.filter(item => item !== data._id)
                    return {
                        ...prevState,
                        user: {
                            ...prevState.user,
                            followers: newfollower
                        }
                    }
                })
                setFollow(true)
            })
    }

    // console.log(mypost.length)
    // console.log(mypost.posts)
    // const userData = JSON.parse(localStorage.getItem('user')).name
    return (
        <>{mypost ?
            <div>
                <div className="card profile-class">
                    <div className="img-class">
                        <img src={mypost.user.userImage} className="profile-img" alt="My Post" />
                    </div>
                    <div className="profile-data">
                        <h4>{mypost.user.name}</h4>
                        <div className="follow-class">
                            <div className="follow-data">{mypost.posts.length} post</div>
                            <div className="follow-data">{mypost.user.followers.length} followers</div>
                            <div className="follow-data">{mypost.user.following.length} followings</div>
                        </div>
                        {follow
                            ?
                            <button className="btn waves-effect waves-light "
                                type="submit" name="action" onClick={() => followHandler(mypost.user._id)}>
                                Follow
                            </button>
                            :
                            <button className="btn waves-effect waves-light "
                                type="submit" name="action" onClick={() => unfollowHandler(mypost.user._id)}>
                                unFollow
                            </button>
                        }


                    </div>
                </div>
                <h5>Posts</h5>
                {mypost.posts.length ? mypost.posts.map(item => {
                    return (
                        <div className="wrapper">
                            <div className="item">
                                <div className="  card img-card">
                                    <div className="card-image waves-effect waves-block waves-light">
                                        <img className="activator post-img-size" src={item.image} alt="My Post" />
                                    </div>
                                    <div className="card-content">
                                        <span className="card-title activator grey-text text-darken-4"><p className="post-img-title comment-class">{item.title}</p>
                                            <i className="material-icons right post-img-title">comments</i></span>

                                    </div>
                                    <div className="card-reveal">
                                        <span className="card-title grey-text text-darken-4">Comment<i className="material-icons right post-img-title">close</i></span>
                                        <p>{item.body}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }) : "No Post Yet"}
            </div>

            : <h3>Loading</h3>}

        </>
    )
}

export default UserProfile;