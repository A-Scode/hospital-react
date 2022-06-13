import { useCallback, useContext, useEffect, useMemo, useRef } from "react";
import { Login_context } from "../App";
import "./css/uploadblog.css"
import uploadImg from './images/add_photo.svg'
import configs from './../../configs.json'
import { useHistory } from "react-router";
import { useParams } from "react-router";



const Uploadblog = props=>{

    const login_context = useContext(Login_context);
    const ref = useRef({});
    const history = useHistory();


    const {blog_id} = useParams();
    
    useEffect(()=>{
        if(!login_context.login){
            history.push("/");
        }

        let xhr = new XMLHttpRequest();
        xhr.open("POST" , configs.api_base_url + "get_blog_data" );
        xhr.setRequestHeader("blog-id" , blog_id);

        xhr.onreadystatechange= ()=>{
            if (xhr.readyState == 4 && xhr.status==200){
                let response = JSON.parse(xhr.response);
                if(response.status == "success"){
                    let data = response.data;
                    console.log(response.data);
                    ref.current.blogimglabel.src = configs.api_base_url+"media/"+data['image_path'] ;
                    ref.current.blogimglabel.style.backgroundImage = "none";
                    ref.current.blog_title.value = data['blog_title'];
                    ref.current.category.value = data['category'];
                    ref.current.summary.innerText = data['summary'];
                    ref.current.content.innerText = data['content'];


                    
                }
            }
        }
        xhr.send();

    } , [login_context])


    const changeImage = useCallback(()=>{
        let label = ref.current.blogimglabel;
        let input = ref.current.blogimg;

        if(input.files.length >0){
            let url = URL.createObjectURL(input.files[0]);
            label.style.backgroundImage="";
            label.src = url;
        }else if (input.files.length ==0){
            label.style.backgroundImage=`url(${uploadImg})`;
        }
    } , [ref])

    const draft = useCallback((type)=>{
        if(ref.current.blog_title.value == ""){
            ref.current.blog_title.setCustomValidity("required");
            ref.current.blog_title.reportValidity();
        }
        let data = blog_id?{'blog_id' : blog_id}:{};
        data['user_id'] = login_context.user_id;
        data['blog_title'] = ref.current.blog_title.value;
        data['category'] = ref.current.category.value;
        data['summary'] = ref.current.summary.innerText;
        data['content'] = ref.current.content.innerText;
        data['type'] = type;

        let formdata = new FormData();
        if(ref.current.blogimg.files.length > 0){
            formdata.append('blog_title_imgae' , ref.current.blogimg.files[0]);
        }

        let xhr = new XMLHttpRequest();
        xhr.open("POST" , configs.api_base_url + "draft_blog");
        formdata.append('data' , JSON.stringify(data));

        xhr.onreadystatechange = ()=>{
            if(xhr.readyState ==4  && xhr.status ==200){
                let response= JSON.parse(xhr.response);
                if(response.status == "success"){
                    alert("Successfully Uploaded!!!");
                    history.push("/" + login_context.user_id + "/drafts/");
                }
            }
        }
        xhr.send(formdata);


    } , [ref , login_context])

    return (
        <div className="blog_details">

        <form action="javascript:void(0);" name  ="bd_form">
            <label htmlFor="tile_image_input">
            <img  width= "350px" style = {{backgroundImage : `url(${uploadImg})`}}
              className="title_image" id = "title_image" ref={el=>ref.current.blogimglabel = el} />
              </label>
            <input required type="file" onInput= {changeImage} id="tile_image_input" ref={el=>ref.current.blogimg = el}
            accept="image/jpg , image/png , image/svg"  hidden />

            <table className="blog_data">
                <tr>
                    <td><label htmlFor="blog_title">Title</label></td>
                    <td><input type="text" required name  ="bd_form"
                    onFocus = {e=>{
                        e.target.setCustomValidity("");e,target.reportValidity();}}
                      ref={el=>ref.current.blog_title = el} id="blog_title" /></td>
                </tr>
                <tr>
                    <td><label htmlFor="category">Category</label></td>
                    <td>
                        <select ref={el=>ref.current.category = el} required name  ="bd_form" id="category">
                        <option value="Metal Helth">Metal Helth</option>
                        <option value="Heart Disease">Heart Disease</option>
                        <option value="COVID-19">COVID-19</option>
                        <option value="Immunization">Immunization</option>
                    </select>
                    </td>
                </tr>
                <tr>
                    <td><label htmlFor="summary">Summary</label></td>
                    <td><div name  ="bd_form" required ref={el=>ref.current.summary = el}
                      id="summary" maxLength={200} cols="20" rows="5" contentEditable></div></td>
                </tr>
                <tr>
                    <td><label htmlFor="content">Content</label></td>
                    <td><div name  ="bd_form" required id="content" ref={el=>ref.current.content = el}
                     cols="20" rows="5" contentEditable></div></td>
                </tr>
                <tr>
                    <td><button onClick = {()=>draft("Draft")} type="button" id="draft_button">Draft</button></td>
                    <td><button onClick = {()=>draft("Uploaded")}  type="submit" id="submit_button">Submit</button></td>
                </tr>
            </table>
            </form>


        </div>
    );
}

export {Uploadblog};