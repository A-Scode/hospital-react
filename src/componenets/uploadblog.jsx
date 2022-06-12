import { useCallback, useContext, useMemo, useRef } from "react";
import { Login_context } from "../App";
import "./css/uploadblog.css"
import uploadImg from './images/add_photo.svg'
import configs from './../../configs.json'
import { useHistory } from "react-router";


const Uploadblog = props=>{

    const login_context = useContext(Login_context);
    const ref = useRef({});
    const history = useHistory();

    var old_data = {};

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

    const draft = useCallback(()=>{
        if(ref.current.blog_title.value == ""){
            ref.current.blog_title.setCustomValidity("required");
            ref.current.blog_title.reportValidity();
        }
        let data = {...old_data};
        data['user_id'] = login_context.user_id;
        data['blog_title'] = ref.current.blog_title.value;
        data['category'] = ref.current.category.value;
        data['summary'] = ref.current.summary.value;
        data['content'] = ref.current.content.value;

        let formdata = new FormData();
        if(ref.current.blogimg.files.length > 0){
            formdata.append('blog_title_imgae' , ref.current.blogimg.files[0]);
        }

        let xhr = new XMLHttpRequest();
        xhr.open("POST" , configs.api_base_url + "draft_blog");
        xhr.setRequestHeader('data' , JSON.stringify(data));

        xhr.onreadystatechange = ()=>{
            if(xhr.readyState ==4  && xhr.status ==200){
                let response= JSON.parse(xhr.response);
                if(response.status == "success"){
                    history.push("/" + login_context.user_id + "/drafts/");
                }
            }
        }


    } , [ref])

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
                        <select ref={el=>ref.current.categroy = el} required name  ="bd_form" id="category">
                        <option value="Metal Helth">Metal Helth</option>
                        <option value="Heart Disease">Heart Disease</option>
                        <option value="COVID-19">COVID-19</option>
                        <option value="Immunization">Immunization</option>
                    </select>
                    </td>
                </tr>
                <tr>
                    <td><label htmlFor="summary">Summary</label></td>
                    <td><textarea name  ="bd_form" required ref={el=>ref.current.summary = el}
                      id="summary" maxLength={200} cols="20" rows="5"></textarea></td>
                </tr>
                <tr>
                    <td><label htmlFor="content">Content</label></td>
                    <td><textarea name  ="bd_form" required id="content" ref={el=>ref.current.content = el}
                     cols="20" rows="5"></textarea></td>
                </tr>
                <tr>
                    <td><button onClick = {draft} type="button" id="draft_button">Draft</button></td>
                    <td><button type="submit" id="submit_button">Submit</button></td>
                </tr>
            </table>
            </form>


        </div>
    );
}

export {Uploadblog};