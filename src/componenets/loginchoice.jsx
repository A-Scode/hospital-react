import React  from 'react';
import './css/userdetails.css'
import login from './images/login.svg'
import signup from './images/signup.svg'
import { useContext } from 'react';
import { user_data_conext } from '../App';

const Loginchoice = props=>{

    var user_data = useContext(user_data_conext);

    function chagne_data(data){
        props.user_data_change( data);
    }

    return (
        <div className="flex_container">
            <div className="choices"  onClick={ ()=>chagne_data({...user_data , 
                    task : 'login'  })}  >
            <img src={login} height={225} width={225} alt="Login" />    
                Login
            </div>
            <div className="choices" onClick={ ()=>chagne_data({...user_data,
                    task : 'signup' })} >
            <img src={signup} height={225} width={225}  alt="Signup" />    
                SignUp
            </div>
        </div>
    );
}

export {Loginchoice};