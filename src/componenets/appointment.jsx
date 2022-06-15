import {useState , useEffect  , useContext} from 'react'
import configs from "./../../configs.json"
import { Link } from 'react-router-dom'
import "./css/appointment.css"
import { Login_context } from '../App'
import unkown_img from "./images/blank_user.svg"


const Doctor_list = props=>{

    const [doctor_list , set_doctor_list] = useState([]);

    useEffect(()=>{
        let xhr = new XMLHttpRequest();
        xhr.open('POST' , configs.api_base_url + "doctor_list" )
        xhr.onreadystatechange = ()=>{
            if(xhr.readyState ==4 && xhr.status == 200){
                let response = JSON.parse(xhr.response);
                if( response.status=="success"){
                    set_doctor_list(response.doc_list);
                    console.log(response.doc_list);
                }
            }
        }
        xhr.send();
    }, []);


    return (
        <div className="doc_container">

<h1 className="heading_doctors" align = "center">Doctors</h1>

        {doctor_list.length >0?
        doctor_list.map(item=>{
            return (<Doctor_apponint details = {item} key = {item.user_id} />);
        })
        :null}

        </div>
    );
}


const Doctor_apponint = props =>{
    const login_context = useContext( Login_context);
    return (
        <div className="appoint_container">
            <ImgUser user_id = {props.details.user_id} size={100}  />
            <label className="doctor_name"> {props.details.firstname +" "+props.details.lastname} </label>
            <Link to = {"/"+login_context.user_id+"/dashboard"}><
                span className="doctor_username">@{props.details.username}</span>
            </Link>
            <Link to = {'/'+login_context.user_id+"/Appoint/"+props.details.user_id}>
                <button className="appoint">Get Appointment</button>
            </Link>
        </div>
    );
}

const ImgUser =props=>{
    const login_context = useContext(Login_context);
    return (
        <Link to = {"/"+props.user_id+"/dashboard"} >
            <img width={props.size} height={props.size} style = {{backgroundImage : unkown_img}}
            src={configs.api_base_url+"media/profile_photos/"+props.user_id+".png"} className="doctor_img" />
        </Link>
    );
}

export {Doctor_list ,ImgUser};