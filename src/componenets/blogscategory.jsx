import { useEffect, useState } from "react";
import "./css/blogcategory.css"
import { Blogcard } from "./blogcard";
import configs from "./../../configs.json"

const Blogcategory = props=>{

    const [data , set_data] = useState({mental_health:[],
                                        heart_disease : [] ,
                                        covid19 : [] ,
                                        immunization :[]
    });

    useEffect(()=>{

        let xhr = new XMLHttpRequest();
        xhr.open('POST' , configs.api_base_url + "blog_by_category");
        xhr.onreadystatechange=()=>{
            if(xhr.readyState ==4 && xhr.status==200){
                let response = JSON.parse(xhr.response);
                console.log(response.data);
                if(response.status =="success"){
                    set_data({...response.data});
                }
            }
        }
        xhr.send();

    } , []);

    return (
        <div className="blogs">
            <h1 align= "center">Blogs</h1>
            <h2 >Metal Helth</h2>
            <div className="blogcategory">
                {data.mental_health.length == 0 ? "No blogs Found":
                (
                    data.mental_health.map(item=>{
                        return (<Blogcard blog_id = {item.blog_id} />)
                    })
                )
                
                
                }
                
            </div>
            <h2>Heart Disease</h2>
            <div className="blogcategory">
                {data.heart_disease.length == 0 ? "No blogs Found":
                (
                    data.heart_disease.map(item=>{
                        return (<Blogcard blog_id = {item.blog_id} />)
                    })
                )}

            </div>
            <h2>COVID-19</h2>
            <div className="blogcategory">
                {data.covid19.length == 0 ? "No blogs Found":
                (
                    data.covid19.map(item=>{
                        return (<Blogcard blog_id = {item.blog_id} />)
                    })
                )}

            </div>
            <h2>Immunization</h2>
            <div className="blogcategory">
                {data.immunization.length == 0 ? "No blogs Found":
                (
                    data.immunization.map(item=>{
                        return (<Blogcard blog_id = {item.blog_id} />)
                    })
                )}

            </div>
        </div>
    );
}

export {Blogcategory};