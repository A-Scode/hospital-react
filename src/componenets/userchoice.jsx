import React, { useContext }  from 'react';
import './css/userdetails.css'
import doctor from './images/doctor.svg'
import patient from './images/person.svg'
import { useCallback } from 'react';
import { user_data_conext } from '../App';

const Userchoice = props=>{
    var user_data = useContext(user_data_conext);

    function chagne_data(data){
        props.user_data_change( data);
    }

    return (
        <div className="flex_container">
            <div className="choices" onClick={ ()=>chagne_data({...user_data , user_type : "Doctor" ,
                    task : 'login_choice' })}>
            <img src={doctor} height={225} width={225} alt="Doctor" />    
                Doctor
            </div>
            <div className="choices"  onClick={ ()=>chagne_data({...user_data , user_type : "Patient" ,
                    task : 'login_choice' })} >
            <img src={patient} height={225} width={225}  alt="Patient" />    
                Patient
            </div>
        </div>
    );
}

export {Userchoice};