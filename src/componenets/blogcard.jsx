import { Link } from "react-router-dom";
import "./css/blogcard.css"
import configs from "./../../configs.json"
import { useContext, useEffect, useRef, useState } from "react";
import { Login_context } from "../App";

const Blogcard = props=>{
    const login_context = useContext(Login_context);

    const [data , set_data] = useState({});

    const [link_url , set_link_url] = useState(""); 

    const ref  = useRef({});

    useEffect(()=>{
        const el = ref.current.titleimg;
        if(!el.src){
            el.style.backgroundImage = "none";
        }
    } ,[ref]);

    useEffect(()=>{
        set_link_url( props.draft? ("/"+ login_context.user_id + "/upload-blog/"
        + props.blog_id ) :("/"+ login_context.user_id + "/Blog/"
        + props.blog_id ) )  ;


        let xhr = new XMLHttpRequest();
        xhr.open("POST" , configs.api_base_url + "get_blog_data" );
        xhr.setRequestHeader("blog-id" , props.blog_id);

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
        
    } , [props ])


    return  (
        <Link to = {link_url}>
        <div className="card">
            <img loading="lazy" src = {configs.api_base_url+"media/blog_title_imgs/"+data['blog_id']+".png"}
            style={{backgroundImage:"linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,34,77,1) 29%, rgba(0,182,255,1) 100%)"}}
            ref = {el=>ref.current.titleimg  = el} className="titleimg" />
            <span className="category">{data['category']}</span>
            <div className="description">
                {data['summary']}
            </div>
            <span className="date">{data['publish_datetime']}</span>
        </div>
        </Link>
    );
}

export {Blogcard};