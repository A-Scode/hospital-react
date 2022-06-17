import {useContext  , useRef , useEffect , useState, useCallback} from 'react'
import { useParams  , useHistory} from 'react-router-dom';
import { Login_context } from '../App';
import { ImgUser } from './appointment';
import "./css/appointmentform.css"
import  moment from 'moment'
import configs from "./../../configs.json"



const Appointmentform=props=>{
    
    const {doctor_id } = useParams();
    
    const login_context = useContext(Login_context);
    
    const ref = useRef({});
    
    // TODO(developer): Set to client ID and API key from the Developer Console
      const CLIENT_ID = '293723265975-4plu8eh5muqj5umaeid6f899r4pdjqfl.apps.googleusercontent.com';
      const API_KEY = 'AIzaSyD683WPw0x3xq4ioToy62Mz80QIpDxxbh0';
      
      // Discovery doc URL for APIs used by the quickstart
      const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
      
      // Authorization scopes required by the API; multiple scopes can be
      // included, separated by spaces.
      const SCOPES = 'https://www.googleapis.com/auth/calendar.events';
      
      let tokenClient;
      let gapiInited = false;
      let gisInited = false;
      
      
      /**
       * Enables user interaction after all libraries are loaded.
       */
      const maybeEnableButtons =useCallback( ()=> {
        if (gapiInited && gisInited) {
          
        }
      },[ref])


            const intializeGapiClient= async ()=>{
                await gapi.client.init({
                    apiKey: API_KEY,
                    discoveryDocs: [DISCOVERY_DOC],
                });
                gapiInited = true;
              maybeEnableButtons();
            } 

      const gapiLoaded = ()=> {
          
        gapi.load('client', intializeGapiClient);
      } 


      gapiLoaded();

      /**
       * Callback after Google Identity Services are loaded.
       */
      const gisLoaded= ()=> {
        tokenClient = google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: SCOPES,
          callback: '', // defined later
        });
        console.log("loaded");
        gisInited = true;
        maybeEnableButtons();
      }

      gisLoaded();


      /**
       *  Sign in the user upon button click.
       */
      const handleAuthClick = useCallback(()=>{
        tokenClient.callback = async (resp) => {
          if (resp.error !== undefined) {
            throw (resp);
          }
          
          await listUpcomingEvents();
        };

        if (gapi.client.getToken() === null) {
          // Prompt the user to select a Google Account and ask for consent to share their data
          // when establishing a new session.
          tokenClient.requestAccessToken({prompt: 'consent'});
        } else {
          // Skip display of account chooser and consent dialog for an existing session.
          tokenClient.requestAccessToken({prompt: ''});
        }
      })


      const listUpcomingEvents = useCallback(async ()=> {
        let response;
        try {
          const request = {
            'calendarId': 'primary',
            'timeMin': (new Date()).toISOString(),
            'showDeleted': false,
            'singleEvents': true,
            'maxResults': 10,
            'orderBy': 'startTime',
          };
          response = await gapi.client.calendar.events.list(request);
        } catch (err) {
          ref.current['content'].innerText = err.message;
          return;
        }

        const events = response.result.items;
        if (!events || events.length == 0) {
          
          return;
        }
        // Flatten to string to display
        const output = events.reduce(
            (str, event) => `${str}${event.summary} (${event.start.dateTime || event.start.date})\n`,
            'Events:\n');
      })

      const[doctor_details , set_doctor_details] = useState({});
      const[paitient_details , set_paitient_details] = useState({});
      
      useEffect(()=>{
        let xhr = new XMLHttpRequest();
        
        xhr.open('POST' , configs.api_base_url+ "get_user_details");
        xhr.setRequestHeader('userid'  , JSON.stringify(doctor_id));
        
        xhr.onreadystatechange = ()=>{
            if(xhr.readyState ==4 && xhr.status == 200){
                let response = JSON.parse(xhr.response);
                console.log(response);
                
                if(response["status"] == "fail"){
                    alert("no doctor exists");
                }else{
                    set_doctor_details({ ...JSON.parse(response['data'])});
                }
            }
        }
        xhr.send();

        let xhr1 = new XMLHttpRequest();
        
        xhr1.open('POST' , configs.api_base_url+ "get_user_details");
        xhr1.setRequestHeader('userid'  , JSON.stringify(login_context.user_id));
        
        xhr1.onreadystatechange = ()=>{
            if(xhr1.readyState ==4 && xhr1.status == 200){
                let response = JSON.parse(xhr1.response);
                console.log(response);
                
                if(response["status"] == "fail"){
                    alert("no doctor exists");
                }else{
                    set_paitient_details({ ...JSON.parse(response['data'])});
                }
            }
        }
        xhr1.send();


      } , [])

      const history = useHistory();
    
      const confirm_appoint = useCallback(()=> {

          const date = ref.current['date'].value;
          const start_time = ref.current['start_time'].value;

          const tmp_date = new Date(  date+"T"+start_time+":00");

         
          console.log(moment(tmp_date).add(45, 'minutes').format());


          handleAuthClick();

          var event = {
            'summary': 'Appointment with '+doctor_details.firstname + " " +doctor_details.lastname,
            'location': doctor_details.address,
            'description': 'Appointted doctor '+doctor_details.firstname + " " +doctor_details.lastname +" as "+ ref.current['req_speciality'],
            'start': {
              'dateTime':  moment(tmp_date).toISOString() ,
              'timeZone' : "Asia/Kolkata" 
    
              
            },
            'end': {
              'dateTime': moment(tmp_date).add(45 , 'minutes').toISOString(),
              'timeZone' : "Asia/Kolkata" 
              
            }
          };

          var request = gapi.client.calendar.events.insert({
            'calendarId': 'primary',
            'resource': event
          });
          
          request.execute();

          let data  = {
            doctor_id : doctor_id,
            paitient_id : login_context.user_id,
            doctor_name : `${login_context.firstname} ${login_context.lastname}`,
            req_speciality : ref.current["req_speciality"].value,
            date: moment(tmp_date).format("YYYY-MM-DD"),
            start_time : moment(tmp_date).format("HH:mm:ss"),
            end_time : moment(tmp_date).add(45 , 'minutes').format("HH:mm:ss")
          }

          let xhr = new XMLHttpRequest();
          xhr.open('POST' , configs.api_base_url+"book_appointment");
          xhr.setRequestHeader('data' , JSON.stringify(data));

          xhr.onreadystatechange=()=>{
            if (xhr.readyState ==4 && xhr.status==200){
              let response = JSON.parse(xhr.response);
              if(response.status == "success"){
                let appoint_id = response.appoint_id;
                console.log(appoint_id);

                setTimeout(()=>history.push("/"+login_context.user_id+"/Appoint/"+appoint_id+"/receipt"),
                5000);

              }
            }
          }

          xhr.send();

          // window.location.href = "/"+login_context.user_id +"/Appoint/"+doctor_id+"/receipt";
          
          

      } ,[ref , doctor_details])

      const date = new Date();



    return (
        <div className="form_container">


            <h1  align= "center" >Appointment</h1>
            <form action="javascript:void(0);"  onSubmit={confirm_appoint} className="appoint_form">
                <ImgUser user_id = {doctor_id} size= {150} />
                <label htmlFor="req_speciality">Required Speciality</label>
                <input required type="text" max={200} id="req_speciality" ref={el=>ref.current["req_speciality"]=el} />
                <label htmlFor="date" min ={ `${date.getFullYear()}-${'0'?date.getMonth() < 10:null}${date.getMonth()}-${'0'?date.getDate() < 10:null}${date.getDate()}`}>Date</label>
                <input onInput={e=>console.log( e.target.value)}
                 required type="date" min={moment().format('YYYY-MM-DD')} id="date" ref={el=>ref.current["date"]=el} />
                <label htmlFor="start_time">Start Time</label>
                <input  onInput={e=>console.log( e.target.value)}
                required type="time" id="start_time" ref={el=>ref.current["start_time"]=el} min={"09:00"} max={"19:00"}  />
                <button className='confirm_form' type="submit"  >Confirm</button>
            </form>
        </div>
    );
}

export {Appointmentform};