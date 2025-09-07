import axios from 'axios';
import React from 'react'
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
function ConfigurationManagenment() {
    const [configuration, setConfiguration] = useState([]);
  
    const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
  
    // react-hook-form
    const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm();
  
    // fetch all configiurations
 useEffect(() => {
  axios
    .get(`${apiBase}/configuration/latest-configuration`,{withCredentials: true})
    .then((res) => {
      const data = res.data.payload || {};
      console.log("data",data);
      setConfiguration(data);
      reset(data); // reset form with API response
    })
    .catch((err) => console.error(err));
}, [handleSubmit, reset]);

  
  const handleUpdate = async (data) => {
    try {
         const formData = new FormData();
         Object.keys(data).forEach((key) => {
            if (key === "headerLogo" && data.headerLogo && data.headerLogo[0]) {
            formData.append("headerLogo", data.headerLogo[0]); // file
            }
            else if (key === "footerLogo" && data.footerLogo && data.footerLogo[0]) {
            formData.append("footerLogo", data.footerLogo[0]); // file
            }  else {
            formData.append(key, data[key]);
            }
        });
        const res=await axios.put(`${apiBase}/configuration/configuration/${configuration.configId}`,
                 formData,
        {withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
        );
        if (res.status === 200) {
        alert("Configuration updated successfully!");
        const refreshed = await axios.get(`${apiBase}/configuration/latest-configuration`,{withCredentials: true});
        const updatedData = refreshed.data.payload || {};
        setConfiguration(updatedData);
        reset(updatedData);
    }
      
    } catch (err) {
      console.error(err);
      alert("Failed to update configuration");
    }
  };
  
  
    return (
      <div>
            <h2>Edit configuration (ID: {configuration.configId})</h2>
            <form onSubmit={handleSubmit(handleUpdate)}>
        <div>
            <label>Website Title: </label>
            <input type="text" {...register("websiteTitle", { required: true })} />
        </div>

        <div>
            <label>Home Page Title: </label>
            <input type="text" {...register("homePageTitle", { required: true })} />
        </div>

        <div>
            <label>Header Logo: </label>
            <input type="file" {...register("headerLogo")} />
        </div>

        <div>
            <label>Footer Logo: </label>
            <input type="file" {...register("footerLogo")} />
        </div>

        <div>
            <label>Banner Caption Name: </label>
            <input type="text" {...register("bannerCaptionName", { required: true })} />
        </div>

        <div>
            <label>Banner Caption Link: </label>
            <input type="text" {...register("bannerCaptionLink", { required: true })} />
        </div>

        <div>
            <label>Google Analytics: </label>
            <input type="text" {...register("googleAnalytics", { required: true })} />
        </div>

        <div>
            <label>Contact Number: </label>
            <input type="text" {...register("websiteContactNumber", { required: true })} />
        </div>

        <div>
            <label>Mobile Number: </label>
            <input type="text" {...register("websiteMobileNumber", { required: true })} />
        </div>

        <div>
            <label>Address: </label>
            <textarea {...register("websiteAddress", { required: true })} />
        </div>

        <div>
            <label>Fax Number: </label>
            <input type="text" {...register("websiteFaxNumber", { required: true })} />
        </div>

        <div>
            <label>Email: </label>
            <input type="email" {...register("websiteEmail", { required: true })} />
        </div>

        <div>
            <label>Message Name: </label>
            <input type="text" {...register("messageName", { required: true })} />
        </div>

        <div>
            <label>Information Name: </label>
            <input type="text" {...register("informationName", { required: true })} />
        </div>

        <div>
            <label>Footer Text: </label>
            <textarea {...register("footerText", { required: true })} />
        </div>

        <div>
            <label>Quick Links (comma separated): </label>
            <input type="text" {...register("quickLinks", { required: true })} />
        </div>

        <div>
            <label>Our Services: </label>
            <textarea {...register("ourServices", { required: true })} />
        </div>

        <div>
            <label>Technologies: </label>
            <textarea {...register("technologies", { required: true })} />
        </div>

        <div>
            <label>USA Address: </label>
            <textarea {...register("usaAddress", { required: true })} />
        </div>

        <div>
            <label>Header Address: </label>
            <textarea {...register("headerAddress", { required: true })} />
        </div>

        <div>
            <label>Working Hours: </label>
            <input type="text" {...register("workingOur", { required: true })} />
        </div>

        <div>
            <label>Signalling Links (comma separated): </label>
            <input type="text" {...register("signallingLinks", { required: true })} />
        </div>

        <div>
            <label>Footer Contact: </label>
            <textarea {...register("footerContact", { required: true })} />
        </div>

        <div>
            <label>Indian Contact Details: </label>
            <textarea {...register("indianContactDetails", { required: true })} />
        </div>

        <div>
            <label>Google Map Embed: </label>
            <textarea {...register("googleMapEmbeded", { required: true })} />
        </div>

        <div>
            <label>Footer Copyright: </label>
            <input type="text" {...register("footerCopyRight", { required: true })} />
        </div>

        <div>
            <label>Twitter Link: </label>
            <input type="text" {...register("teitterLink", { required: true })} />
        </div>

        <div>
            <label>Instagram Link: </label>
            <input type="text" {...register("instagramLink", { required: true })} />
        </div>

        <div>
            <label>Facebook Link: </label>
            <input type="text" {...register("facebookLink", { required: true })} />
        </div>

        <div>
            <label>LinkedIn Link: </label>
            <input type="text" {...register("linkedinLink", { required: true })} />
        </div>

        <div>
            <label>YouTube Link: </label>
            <input type="text" {...register("youTubeLink", { required: true })} />
        </div>

        <div>
            <label>Under Construction: </label>
            <input type="checkbox" {...register("underConstruction")} />
        </div>

        <div>
            <label>Admin Panel Construction: </label>
            <input type="checkbox" {...register("adminPanelConstruction")} />
        </div>

        <div>
            <label>Meta Description: </label>
            <textarea {...register("metaDescription", { required: true })} />
        </div>

        <div>
            <label>Meta Keywords: </label>
            <textarea {...register("metaKeywords", { required: true })} />
        </div>

        <div>
            <label>Status: </label>
            <select {...register("status")}>
            <option value="A">Active</option>
            <option value="I">Inactive</option>
            </select>
        </div>

        <br />
        <button type="submit">Save</button>
        <button
            type="button"
            onClick={() => {
            reset(configuration);
            }}
        >
            Cancel
        </button>
        </form>

      </div>
    );
}

export default ConfigurationManagenment