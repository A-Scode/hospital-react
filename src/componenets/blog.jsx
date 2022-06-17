import { useEffect, useState } from "react";
import { useParams } from "react-router";
import "./css/blog.css";
import configs from "./../../configs.json";

const Blog= props=>{

    const [data , set_data] = useState({});

    const { user_id , blog_id} = useParams();

    useEffect(()=>{
        let xhr = new XMLHttpRequest();
        xhr.open("POST" , configs.api_base_url + "get_blog_data" );
        xhr.setRequestHeader("blog-id" , blog_id);

        xhr.onreadystatechange= ()=>{
            if (xhr.readyState == 4 && xhr.status==200){
                let response = JSON.parse(xhr.response);
                if(response.status == "success"){
                    set_data({...response.data});
                    console.log(response.data);
                }
            }
        }
        xhr.send();
    } , []);

    return (
        <div className="blog_container">
            <h1 align="center" className="blog_title">{data['blog_title']}</h1>
            <img src={configs.api_base_url+"media/"+data['image_path']} 
            style = {{backgroundImage : "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,34,77,1) 29%, rgba(0,182,255,1) 100%)"}}
            className="blog_image" />
            <span className = "category">{data['category']}</span>
            <div className="blog_content">
                <p dangerouslySetInnerHTML={{__html : data['content']}}></p>

            </div>
        </div>
    );
}

export {Blog};