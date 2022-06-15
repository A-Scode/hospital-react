import { user_data_conext } from "../App";
import { useCallback, useContext , useRef } from "react";
import './css/login.css'
import configs from '../../configs.json'
import { useHistory } from "react-router";

var Login = props=>{
    var user_data = useContext(user_data_conext);
    console.log(user_data);
    const ref =  useRef({});

    const history = useHistory();

    const login = useCallback(()=>{

        console.log(user_data)
        let data = {};
        data['username'] = ref.current['username'].value;
        data['password'] = ref.current['password'].value;
        data['user_type'] = user_data['user_type']

        var xhr = new XMLHttpRequest();

        xhr.open('POST' , configs.api_base_url+'login');
        xhr.setRequestHeader('data' , JSON.stringify(data));

        xhr.onreadystatechange = ()=>{
            if (xhr.readyState ==4 && xhr.status ==200){
                let response = JSON.parse(xhr.response);
                console.log(response);
                if(response.status !== "success"){
                    ref.current['password'].setCustomValidity(response.status);
                    ref.current['password'].reportValidity();
                }else{
                    ref.current['password'].setCustomValidity("");
                    ref.current['password'].reportValidity();

                    props.change_login_context({... response.data , login : true});

                    props.user_data_change({...user_data , task : "user_choice"})

                    history.push("/"+response.data['user_id']+"/dashboard/");

                }
            }
        }
        xhr.send()


    } , [ref])

    return (
        <div className="login_container">
            <form className="login" action="javascript:void(0);">
                
                <label htmlFor="username" className="labels" >Username</label>
                <input type="text" ref={el=>ref.current['username']=el}  id = "username" className="input" />
                <label htmlFor="password" className="labels" >Password</label>
                <input type="password" ref={el=>ref.current['password']=el}    id = "password" className="input" />
                <button className="submit" onClick={login} >Login</button>
            </form>
        </div>
    );
}

export {Login};