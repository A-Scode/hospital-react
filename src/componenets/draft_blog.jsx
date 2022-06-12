import { useContext, useEffect, useState } from "react";
import "./css/draftblog.css"
import configs from "./../../configs.json"
import { Login_context } from "../App";
import { useHistory } from "react-router";

const Draftblog = props=>{

    var login_context = useContext(Login_context);

    const history = useHistory();

    const [draft_list , set_draft_list] = useState([]);

    useEffect(()=>{

        if(!login_context.login) history.push("/");

        let xhr = new XMLHttpRequest();
        xhr.open("POST" , configs.api_base_url+"check_drafts");
        xhr.setRequestHeader('user-id' , JSON.stringify( login_context.user_id));
        console.log(login_context);

        xhr.onreadystatechange=()=>{
            if(xhr.readyState == 4 && xhr.status ==200){
                let response = JSON.parse(xhr.response);
                if(response.status == "success"){
                    if(response.data.length == 0){
                        history.push( "/"+login_context.user_id +"/upload-blog");
                        console.log("hii");
                        }
                    else{
                     set_draft_list([...response.data]);
                    }
                }
            }
        }
        xhr.send();

    } , []);

    return (
        <div className="draft_container">
            <h1 align = "center">Drafts</h1>
        </div>
    );
}

export {Draftblog}