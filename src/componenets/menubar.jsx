import { Link } from "react-router-dom";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Login_context, user_data_conext } from "../App";
import "./css/menubar.css";

import dashboard_logo from "./images/dashboard.svg"
import blog_logo from "./images/blog.svg";
import upload_logo from "./images/upload.svg";
import logout_logo from "./images/logout.svg";
import menu1 from "./images/menu1.svg"
import menu2 from "./images/menu2.svg"
import doctor_logo from "./images/doctor.svg"
import configs from "./../../configs.json"
import { useHistory } from "react-router";


const Menubar = props=>{

    

    const login_context = useContext(Login_context);

    const ref  = useRef({});

    const history = useHistory();

    var mq = window.matchMedia("(min-width : 700px)");

    window.addEventListener('resize' , ()=>{
        try{
            if(mq.matches){
             ref.current.menu.style.transform = `translateX(0px)`;
             ref.current.menu_toggle.style.display = "none";
            }else { ref.current.menu.style.transform = `translateX(-300px)`;
            ref.current.menu_toggle.style.display = "block";
        
        }
    }catch(e){null}
    })

    useEffect(()=>{
        if(mq.matches) ref.current.menu.style.transform = `translateX(0px)`;

    } , [ref])

    const toggle_menu = useCallback(()=>{
        const el = ref.current.menu;
        if(el.style.transform == `translateX(0px)`){
            el.style.transform = `translateX(-300px)`;
            
        }else{
            el.style.transform = `translateX(0px)`;

        }
    } , [ref])

    const logout = useCallback(()=>{
        let xhr = new XMLHttpRequest();
        xhr.open('POST' , configs.api_base_url + "logout" );
        xhr.setRequestHeader('user-id' ,JSON.stringify( login_context.user_id));

        xhr.onreadystatechange =()=>{
            if(xhr.readyState == 4 && xhr.status ==200){
                let response = xhr.response;
                if(response.staus == "fail"){
                    alert("No user exists");
                }else{
                    props.change_login_context({login:false});
                    props.chage_user_data({...props.user_data , login : false});
                    localStorage.clear();
                    history.push("/");
                }
            }
        }
        xhr.send();
    } );


    return (<>
            <button className="menu_toggle" ref={el=>ref.current.menu_toggle = el}  
            onClick = {toggle_menu}  style = {{backgroundImage:`url(${menu2})`}}
            />
        <div className="menu_container" ref = {el=>ref.current.menu=el}>


            <Link to =  {"/"+login_context.user_id + "/dashboard/"} >
                <span className="icon" style = {{backgroundImage:`url(${dashboard_logo})`}} ></span>
                <div className="nav_button">Dashboard</div>
            </Link>
            <Link to = "/BlogsCategory">
                <span className="icon" style = {{backgroundImage:`url(${blog_logo})`}} ></span>
                <div className="nav_button">Blogs</div>
            </Link>
            {login_context.user_type == "Doctor" ?<Link to = {"/" + login_context.user_id + "/drafts/"}>
                <span className="icon" style = {{backgroundImage:`url(${upload_logo})`}} ></span>
                <div className="nav_button">Upload Blog</div>
            </Link> :null}
            {login_context.user_type == "Patient" ?<Link to = {"/" + login_context.user_id + "/Appoint/"}>
                <span className="icon" style = {{backgroundImage:`url(${doctor_logo})`}} ></span>
                <div className="nav_button">Doctors</div>
            </Link> :null}
            {login_context.login?<Link className="logout" onClick={logout} >
                    <span className="icon" style = {{backgroundImage:`url(${logout_logo})`}} ></span>
                <div className="nav_button">Logout</div>
            </Link>:null}
        </div>
        </>
    );

}

export {Menubar};