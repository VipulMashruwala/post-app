import React, { useState, useEffect,Fragment,useContext } from 'react';
import { Link } from 'react-router-dom';
import {UserContext} from '../App';
import M from 'materialize-css'
import './Home.css'
const Home = () => {
    const [post, setPost] = useState([]);
    const [comment, setComment] = useState("")
    const {state, dispatch} = useContext(UserContext);

    useEffect(() => {
        fetch('/posts', {
            method: 'GET',
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
            .then(resp => resp.json())
            .then(data => {
                // console.log(data)
                setPost(data);
            })
            .catch(err => console.log(err))
    }, [])

    const likePost = (id) => {
        fetch('/like',{
            method: 'PUT',
            body: JSON.stringify({
                postId: id
            }),
            headers:{
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
        .then(resp => resp.json())
        
        .then(data => {
            // console.log(data)
            const newData = post.map(item => {
                
                if(item._id == data._id){
                    return data
                }
                else{
                    return item
                }
            })
            setPost(newData)
        })
        .catch(err => console.log(err))
    }

    const unlikePost = (id) => {
        fetch('/unlike',{
            method: 'PUT',
            body: JSON.stringify({
                postId: id
            }),
            headers:{
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
        .then(resp => resp.json())
        .then(data => {
            const newData = post.map(item => {
                if(item._id == data._id){
                    return data
                }
                else{
                    return item
                }
            })
            setPost(newData)
        })
        .catch(err => console.log(err))
    }
    
    const addComments = (text,postId) => {
       
        fetch('/comment',{
            method: 'PUT',
            body: JSON.stringify({
                text: text,
                postId: postId
             
            }),
            headers:{
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(resp => resp.json())
        .then(data => {
            const newData = post.map(item => {
                if(item._id == data._id){
                    return data
                }
                else{
                    return item
                }
            })
            setPost(newData)
        })
        .catch(err => console.log(err))

        // setComment("")
    }

    const deletePost = (postId,postedById) => {
        fetch('/deletepost',{
            method: 'DELETE',
            body: JSON.stringify({
                postId: postId,
                postedById: postedById
            }),
            headers:{
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
        .then(resp => resp.json())
        .then((data)=> {

            if(data.message){
                M.toast({html: data.message , classes:"signup-message"});
            }
            // console.log(data)
            // console.log(post)
            const newData = post.filter(item =>{
                return item._id !== data.post._id
            })
            setPost(newData)
            
        })
        .catch(err => console.log(err))
    }

    // console.log(post)

    return (
        <Fragment>
            {
                post.map(item => {
                    return (
                        <div className="home" key={item._id}>
                            <div className="card card-all-post">
                               
                              <h5><Link to={`/profile/${item.postBy._id}`}>{item.postBy.name} </Link>
                              {(state._id===item.postBy._id) && <i className="material-icons right" 

                                onClick={() => deletePost(item._id,item.postBy._id)}>delete</i>}</h5>
                                <div className="card-image">
                                    <img className="img-all-post" src={item.image}
                                        alt="upload-post" />
                                </div>

                                <div className="card-content">
                                    <i className="material-icons text-icon favorite_border-icon">favorite_border</i>
                                    {item.likes.includes(state._id) 
                                    ? <i className="material-icons thumb_up-icon text-icon"
                                        onClick={() => unlikePost(item._id)}>thumb_down</i>
                                    : <i className="material-icons thumb_up-icon text-icon"
                                        onClick={() => likePost(item._id)}>thumb_up</i>}
                                     
                                    
                                    <h6>{item.likes.length} like</h6>
                                    <h6>{item.title}</h6>
                                    <p>{item.body}</p>
                                    {item.comments.map(comment => {
                                        return(
                                            <h6><span>{comment.postedBy.name}</span> {comment.text}</h6>
                                        )
                                    })}
                                    
                                    {/* <form  onSubmit={(event) => {
                                            
                                            event.preventDefault()
                                            console.log(event.target)
                                        }}> */}
                                        <input type="text" placeholder="add a comment" 
                                        onKeyPress={event => {
                                            if(event.key == 'Enter'){
                                              
                                                addComments(event.target.value,item._id)
                                            //    console.log(event.target.value)
                                            }
                                        }}/>
                                    {/* </form> */}
                                     
                                </div>
                            </div>
                        </div>
                    )
                })
            }

        </Fragment>
    )
}

export default Home;