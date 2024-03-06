import { useEffect, useState , useContext  , useCallback} from 'react'
import React from 'react'
import './App.css'
import {BrowserRouter as Router  , Route , Switch} from 'react-router-dom'

import { Appheader } from './componenets/Appheader'
import { Userchoice } from './componenets/userchoice';
import { Loginchoice } from './componenets/loginchoice';
import { Login } from './componenets/login';
import { Signup } from './componenets/signup';
import { Dashboard } from './componenets/dashboard';
import { Menubar } from './componenets/menubar'
import { Draftblog } from './componenets/draft_blog'
import { Uploadblog } from './componenets/uploadblog'
import { Blog } from './componenets/blog'
import { Blogcategory } from './componenets/blogscategory'
import { Doctor_list } from './componenets/appointment'
import { Appointmentform } from './componenets/appointmentform'
import { Recipt } from './componenets/recipt'


const user_data_conext = React.createContext({});
const Login_context = React.createContext({});

function App() {

  
  const [login_context , set_login_context] = useState({login:false});
      
  const change_login_context = useCallback(data=>{
    set_login_context(data);
    localStorage.setItem("login_context" , JSON.stringify(data)) ;
  },[])

  useEffect(()=>{
    var data  = JSON.parse(localStorage.getItem("login_context"));
    change_login_context(data);
  },[] )

    const chage_user_data = data=>{
      set_user_data_state(data);
    }
    var userchoice = <Userchoice user_data_change = {data=>chage_user_data(data)} /> ;
    var  loginchoice  = <Loginchoice user_data_change = {data=>chage_user_data(data)}  />;
    var login = <Login 
    change_login_context={change_login_context}
    user_data_change = {data=>chage_user_data(data)}  />
    var signup = <Signup user_data_change = {data=>chage_user_data(data)}  />

    const [comp_state ,set_comp_state ] = useState(userchoice);

    var user_data = useContext(user_data_conext);


    
    const [user_data_state , set_user_data_state] = useState({user_type : null ,
      task : 'user_choice' ,
      login : false});
      
      useEffect(()=>{
        
        if (user_data_state.task == "user_choice") set_comp_state(userchoice);
        else if (user_data_state.task == "login_choice") set_comp_state(loginchoice);
        else if (user_data_state.task == "login") set_comp_state(login);
        else if (user_data_state.task == "signup") set_comp_state(signup);

        console.log(user_data_state);
      } , [user_data_state]);


  
  return (
    <Router>
    <Login_context.Provider value = {login_context}>
    <user_data_conext.Provider  value = {user_data_state}>
    <div className="App">
      <Appheader />

          <div style={{display:"flex",
        placeItems:"center", justifyContent : "center",minHeight:"calc(100vh - 34pt - 20px)",padding:"0px 0" }}>
    <Switch>
          <Route exact path = "/">
          {comp_state}
        </Route>


        <Route  path = "/:user_id"><>
          <Menubar change_login_context={change_login_context} chage_user_data={chage_user_data}  user_data = {user_data} />
<Switch>
          <Route exact path = "/:user_id/dashboard">
          <Dashboard user_data_change = {data=>chage_user_data(data)} />

        </Route >
        <Route exact path = "/:user_id/drafts" >
          <Draftblog  />
        </Route>
        <Route exact path = "/:user_id/upload-blog/:blog_id?" >
          <Uploadblog />          
        </Route>
        <Route exact path = "/:user_id?/Blog/:blog_id">
          <Blog  />
        </Route>
        <Route exact path = "/:user_id?/BlogsCategory">
          <Blogcategory />
        </Route>
        <Route exact path = "/:user_id?/Appoint">
          <Doctor_list />
        </Route>
        <Route exact path = "/:user_id?/Appoint/:doctor_id">
          <Appointmentform />
        </Route>
        <Route exact path = "/:user_id?/Appoint/:appoint_id/receipt">
          <Recipt />
        </Route>
  </Switch>
        </>
        </Route>


    </Switch>    
        </div>
    </div>
    </user_data_conext.Provider>
    </Login_context.Provider>
    </Router>
  )
}

export default App;
export {user_data_conext , Login_context};
