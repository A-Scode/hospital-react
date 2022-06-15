import {useContext  , useRef , useEffect , useCallback} from 'react'
import { useParams } from 'react-router-dom';
import { Login_context } from '../App';
import { ImgUser } from './appointment';
import "./css/appointmentform.css"



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
          ref.current['authorize_button'].innerText = 'Refresh';
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
          ref.current['content'].innerText = 'No events found.';
          return;
        }
        // Flatten to string to display
        const output = events.reduce(
            (str, event) => `${str}${event.summary} (${event.start.dateTime || event.start.date})\n`,
            'Events:\n');
        ref.current['content'].innerText = output;
      })

      function insert_event (){
        gapi.client.calendar.events.insert({})
      }




    return (
        <div className="form_container">

<button id="authorize_button" ref = {el=>ref.current.authorize_button=el} hidden onClick={handleAuthClick}>Authorize</button>
    
    <div id="content" ref ={el=>ref.current.content=el} style={{whiteSpace:"pre"}}></div>




            <h1  align= "center" >Appointment</h1>
            <form action="javascript:void(0);"  className="appoint_form">
                <ImgUser user_id = {doctor_id} size= {150} />
                <label htmlFor="req_speciality">Required Speciality</label>
                <input required type="text" max={200} id="req_speciality" />
                <label htmlFor="date">Date</label>
                <input required type="date" id="date" />
                <label htmlFor="start_time">Start Time</label>
                <input required type="time" id="start_time" />
                <button className='confirm_form' onClick={handleAuthClick} >Confirm</button>
            </form>
        </div>
    );
}

export {Appointmentform};