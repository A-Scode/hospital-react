import { user_data_conext } from "../App";
import { useCallback, useContext, useRef } from "react";
import './css/login.css'
import './css/signup.css'
import addphoto from './images/add_photo.svg'
import configs from '../../configs.json'

var Signup = props=>{
    var user_data = useContext(user_data_conext);
    console.log(user_data);

    const ref = useRef({});

    var change_img= useCallback(()=>{
        const el = ref.current["img"];
        const label = ref.current['imglabel'];
        if(el.files[0].size > 5000000){
            window.alert("File size greater than 5Mb")
            return ;
        }
        if(el.value){
        let url = URL.createObjectURL(el.files[0]);
        label.style.backgroundImage = `url(${url})`;
        label.style.backgroundSize = `225px 225px`;
        }
    } ,[ref])

    const pass_validate = ()=>{
        const pass = ref.current["pass"];
        const check = "\"'?.,><}{[]+_)(*&^%$#@!";
        check.split("").forEach(val=>{
            if(pass.value.indexOf(val) !== -1){
                pass.setCustomValidity("No special Charcters allowed");
                pass.reportValidity();
                return false;
            }
        return true;
       })         
    }

    const check_user_exists= useCallback(()=>{
        const username = ref.current['username']
        let xhr = new XMLHttpRequest();
        xhr.open('POST' , configs.api_base_url+"username_exists")
        xhr.setRequestHeader('data' , JSON.stringify({'username': username.value}))
        xhr.send()

        

        xhr.onreadystatechange = ()=>{
            if (xhr.readyState == 4 && xhr.status == 200){
                const response = JSON.parse(xhr.response);
                console.log(response);
                if (response.username_exists){
                    username.classList.add('error');
                    username.setCustomValidity("This username already exists!!!");
                    username.reportValidity();
                }
                else{
                    username.classList.remove('error');
                    username.setCustomValidity("");
                    username.reportValidity();
                }
            }
        }

    } , [ref])

    const check_email_exists= useCallback(()=>{
        const email = ref.current['email']
        let xhr = new XMLHttpRequest();
        xhr.open('POST' , configs.api_base_url+"email_exists")
        xhr.setRequestHeader('data' , JSON.stringify({'email': email.value}))
        xhr.send()

        

        xhr.onreadystatechange = ()=>{
            if (xhr.readyState == 4 && xhr.status == 200){
                const response = JSON.parse(xhr.response);
                console.log(response);
                if (response.email_exists){
                    email.classList.add('error');
                    email.setCustomValidity("This email already exists!!!");
                    email.reportValidity();
                }
                else{
                    email.classList.remove('error');
                    email.setCustomValidity("");
                    email.reportValidity();
                }
            }
        }

    } , [ref])

        
    

    const submit_data = useCallback(()=>{
        const confirm = ref.current["confirm"];
        if(pass_validate() == false){
            return ;
        }
        if(ref.current["pass"].value !== confirm.value){
            console.log(ref.current["pass"].value , confirm.value)
            confirm.setCustomValidity("Password doesn't match ");
            confirm.reportValidity();
        }

        const data = {};

        
        data["firstname"] = ref.current["firstname"].value
        data["lastname"] = ref.current["lastname"].value
        data["username"] = ref.current["username"].value
        data["email"] = ref.current["email"].value
        data["password"] = ref.current["pass"].value
        data["address"] = ref.current["address"].value
        data["user_type"] = user_data['user_type']

        let form_data = new FormData();
        console.log(ref.current['img'].files)
        if (ref.current['img'].files.length >0) form_data.append("profile_photo",ref.current['img'].files[0]);

        let xhr = new XMLHttpRequest();
        xhr.open('POST' , configs.api_base_url+"signup")

        xhr.setRequestHeader('data' , JSON.stringify(data));
        xhr.send(form_data);

        xhr.onreadystatechange=()=>{
            if(xhr.readyState ==4 && xhr.status ==200){
                let response = JSON.parse(xhr.response);
                if(!response['status']) alert("failed to signup");
                else{
                    props.user_data_change({...user_data , "task" : "login"});
                }
            }
        }



    } , [ref])

    return (
        <div className="login_container signup_container">
            <form action="javascript:void(0);" onSubmit={submit_data} className="login signup_form">
                <label htmlFor="img"ref = {el=>ref.current["imglabel"]=el}
                 style={{backgroundImage:`url(${addphoto})`}} className = "photo" ></label>
                <input type="file" ref = {el=>ref.current["img"]= el} onInput={change_img}
                id = "img" placeholder="img" accept="image/jpg, image/png ,image/svg" hidden />

                <label htmlFor="firstname" className="labels" >First Name</label>
                <input type="text" max={50} required  id = "firstname"
                ref={el=>ref.current["firstname"]=el}
                placeholder="firstname" className="input" />

                <label htmlFor="lastname" className="labels" >Last Name</label>
                <input type="text" max={50}   id = "lastname"
                ref={el=>ref.current["lastname"]=el}
                placeholder="lastname" className="input" />

                <label htmlFor="username">Username</label>
                <input type="text" max={50} min={8} required  id = "username"
                ref={el=>ref.current["username"]=el}
                onInput = {check_user_exists}
                placeholder="username" className="input" />

                <label htmlFor="email">Email</label>
                <input type="email" required id = "email"
                ref={el=>ref.current["email"]=el}
                onInput = {check_email_exists}
                placeholder="email" className="input" />

                <label htmlFor="pass">password</label>
                <input type="password" required 
                onFocus={(e)=>{
                    e.target.setCustomValidity('');
                }}
                minLength={8} maxLength={50}
                id = "pass"
                ref={el=>ref.current["pass"]=el}
                placeholder="password" className="input" />

                <label htmlFor="confirmpass">confirm</label>
                <input type="password" required ref ={el=>ref.current["confirm"]=el}
                onFocus={(e)=>{
                    e.target.setCustomValidity('');
                }}
                minLength={8} maxLength={50}
                id = "confirmpass" placeholder="confirm" className="input" />

                <label htmlFor="addr">Full address</label>
                <input type="text"  id = "addr"
                ref={el=>ref.current["address"]=el}
                placeholder="line 1 , city, state, pincode" 
                 className="input" />


                <button className="submit" type = "submit"
                 >Signup</button>
            </form>
        </div>
    );
}

export {Signup};