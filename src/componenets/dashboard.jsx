import { useContext, useRef , useEffect , useState} from "react";
import { useHistory } from "react-router";
import { useParams } from "react-router"
import { Login_context } from "../App";
import './css/dashboard.css'

import blank_user_logo from './images/blank_user.svg'
import configs from './../../configs.json'

const Dashboard = props=>{

    const user_id = useParams()['user_id'];
    const history = useHistory();

    const ref  = useRef({});
    
    const login_context = useContext(Login_context);
    if(!login_context.login) history.push("/");

    const [user_data , set_user_data] = useState({
        "address": "",
        "​email_id": "",
        "​firstname": "",
        "​lastname": "",
        "username":"",
        "login": "",
        "​profile_picture_path": "",
        "​user_id": "",
        "​user_type": "",
    });

    
        
    useEffect(()=>{
        let xhr = new XMLHttpRequest();
        
        xhr.open('POST' , configs.api_base_url+ "get_user_details");
        xhr.setRequestHeader('userid'  , JSON.stringify(user_id));
        
        xhr.onreadystatechange = ()=>{
            if(xhr.readyState ==4 && xhr.status == 200){
                let response = JSON.parse(xhr.response);
                console.log(response);
                
                if(response["status"] == "fail"){
                    alert("no user exists");
                }else{
                    set_user_data({ ...JSON.parse(response['data'])});
                }
            }
        }
        xhr.send();
    } ,[ref] );

    useEffect(()=>{
        console.log(user_data.user_type);
        if (user_data.user_type == "Doctor"){
            ref.current.grad.style.backgroundImage =  "linear-gradient(147deg, rgba(255,182,0,1) 0%, rgba(91,182,136,1) 50%, rgba(109,0,255,1) 100%)";
        }    

    } , [user_data,ref]);


    return (
        <div className="dashboard">
            <div className="profile_photo">
                <span className="grad" ref = {el=>ref.current.grad  =el }  ></span>
                <img className="photo" style={{backgroundImage : `url(${blank_user_logo})`}}
                src = { configs.api_base_url+"media/profile_photos/"+user_id+".png"}
                />

                <span className="username" ref = {el=>ref.current['username']=el}>
                    {user_data.username}
                </span>
            </div>
            <hr />
            <div className="details">
                <table>
                    <tr>
                        <td>Firstname</td>
                        <td>:</td>
                        <td>{user_data["firstname"]}</td>
                    </tr>
                    <tr>
                        <td>Lastname</td>
                        <td>:</td>
                        <td>{user_data["lastname"]}</td>
                    </tr>
                    <tr>
                        <td>Username</td>
                        <td>:</td>
                        <td>{user_data["username"]}</td>
                    </tr>
                    <tr>
                        <td>Email</td>
                        <td>:</td>
                        <td>{user_data["email_id"]}</td>
                    </tr>
                    <tr>
                        <td>User-ID</td>
                        <td>:</td>
                        <td>{user_data["user_id"]}</td>
                    </tr>
                    <tr>
                        <td>Type</td>
                        <td>:</td>
                        <td>{user_data["user_type"]}</td>
                    </tr>
                    <tr>
                        <td>Address</td>
                        <td>:</td>
                        <td>{user_data["address"]}</td>
                    </tr>
                </table>
            </div>

        </div>
    )
}

export {Dashboard}