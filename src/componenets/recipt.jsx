import {useEffect , useRef ,useState} from 'react'
import {useParams} from 'react-router-dom'
import configs from './../../configs.json'
import moment from 'moment'


const Recipt=props=>{

        const [details , set_details] = useState({});

        const ref = useRef({});

        const {appoint_id} = useParams();

        useEffect( ()=>{
            let xhr = new XMLHttpRequest();
            xhr.open( 'POST' ,configs.api_base_url + "appointment_details");
            xhr.setRequestHeader("appoint-id" , appoint_id);

            xhr.onreadystatechange = ()=>{
                if(xhr.status == 200 && xhr.readyState ==4 ){
                    let response = JSON.parse(xhr.response);

                    if(response.status == "success"){
                        set_details( {...response.details});
                        console.log(response.details);
                    }

                }
            }
            xhr.send();


        }, [ref]);

        


    return (
        <div className="dashboard receipt" style={{height: `calc(100vh - 40px)`, padding : "20px 10px"}}>
            <h1 align = "center">Receipt</h1>
        <div className="details">
        <table border={0}>

            <tr>
                <td>Doctor</td>
                <td>Dr. {details.doctor_name}</td>
            </tr>
            <tr>
                <td>start time </td>
                <td>{moment(details.start_time  , "HH:mm:ss").format("h:mm a")}</td>
            </tr>
            <tr>
                <td>end time</td>
                <td>{moment(details.end_time  , "HH:mm:ss").format("h:mm a")}</td>
            </tr>
            <tr>
                <td>Date</td>
                <td>{moment( details.date , "YYYY-MM-DD").format("Do MMMM, YYYY")}</td>
            </tr>
            <tr>
                <td>Required Speciality</td>
                <td>{details.req_speciality}</td>
            </tr>
        </table>
        </div>
        </div>
    )
}

export {Recipt}