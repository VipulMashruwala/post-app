import React ,{useState ,useEffect} from 'react'
import {  useHistory} from 'react-router-dom';
import './CreatePost.css'
import M from 'materialize-css';
const CreatePost = () => {

    const [title,setTitle] = useState("")
    const [body,setBody] = useState("")
    const [image, setImage] = useState("")
    const [imageUrl, setImageUrl] = useState("")
    const history = useHistory();

    useEffect(()=>{
        if(imageUrl){
            fetch('/addpost',{
                method : 'POST',
                body : JSON.stringify({
                    title : title,
                    body : body,
                    image : imageUrl
                }),
                headers : {
                    'Content-Type' : 'application/json',
                    "Authorization" : "Bearer "+localStorage.getItem("jwt")
                }
            }).then(resp => resp.json())
            .then(data => {
                console.log(data)
                // if(data.error){
                //     M.toast({html: data.error , classes:"signup-error"});
                // }
                // else{
                    M.toast({html: "Post Created Successfully" , classes:"signup-message"});
                    history.replace('/')
                // }
            })
            .catch(err => console.log(err));
        }
    },[imageUrl])

    const uploadPost = (event) => {
  
       if(!image || !title || !body){
           console.log("True")
           M.toast({html: "Please add all details" , classes:"signup-error"});
            return;
       }
      
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

    return (
        <div className="card card-create-post">
            <h5>Create Post</h5>
            <div className="input-field">
                <input id="title" type="text" 
                    onChange={(event)=> setTitle(event.target.value)}/>
                <label htmlFor="title">Title</label>
            </div>
            <div className="input-field">
                <input id="body" type="text" 
                    onChange={(event)=> setBody(event.target.value)}/>
                <label htmlFor="body">Body</label>
            </div>
            <div className="file-field input-field">
                <div className="btn">
                    <span>Photo<i className="material-icons right">file_upload</i></span>
                    <input type="file" onChange={(event) => setImage(event.target.files[0])}/>
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                </div>
            </div>

            <button className="btn waves-effect waves-light create-btn" type="submit" name="action"
                onClick={uploadPost}>Create
                <i className="material-icons right">create</i>
            </button>
        </div>
    )
}

export default CreatePost;