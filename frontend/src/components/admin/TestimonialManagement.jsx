import React from 'react'
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
function TestimonialManagement() {
  const [testimonials, setTestimonials] = useState([]);
  const [editTestimonial, setEditTestimonial] = useState(false);
  const [editTestimonialId, setEditTestimonialId] = useState(null);

  const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
  // react-hook-form
  const {
    register, 
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // fetch all testimonials
  useEffect(() => {
    axios.get(`${apiBase}/testimonial/testimonials`)
    .then((res)=>setTestimonials(res.data.payload || []))
    .catch((err)=>console.error(err));
  }, []);

  // handle edit click
  const handleEdit = (testimonialId) => {
    setEditTestimonial(true);
    setEditTestimonialId(testimonialId);  
    const testimonialToEdit = testimonials.find((t) => t.testimonialId === testimonialId);
    reset(testimonialToEdit); //to fill in exixting values in form
  }

  const handleUpdate = async (data) => {
    const formData = new FormData();
    try {
      
      Object.keys(data).forEach((key)=>{
        if(key=="testimonialImage" && data.testimonialImage && data.testimonialImage[0]){
          formData.append("testimonialImage",data[key]);
        }
        else
        {
          formData.append(key,data[key])
        }
      })
      const res=await axios.put(`${apiBase}/testimonial/testimonial/${editTestimonialId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if(res.status==200)
      {
        alert("Testimonial updated successfully");
        const refreshed=await axios.get(`${apiBase}/testimonial/testimonials`)
        setTestimonials(refreshed.data.payload||[]);
        setEditTestimonial(null)
        reset({});
      }
    }catch(err)
    {
    console.error(err);
      alert("Failed to update testimonial");
    }
  }
      
  
  return (
    <div>
      {
        !editTestimonial ?(
          <>
            <h2>Testimonials</h2>
          <table border="1" cellPadding="8" cellSpacing="0">
            <thead>
              <tr>
                <th>Author Name</th>
                <th>Last Updated</th>
                <th>Edit</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {testimonials.map((testimonial)=>(
                <tr key={testimonial.testimonialId}>
                  <td>{testimonial.testimonialAuthor}</td>
                  <td>{testimonial.updatedOn? new Date(testimonial.updatedOn).toLocaleDateString()
                      : "-"}</td>
                  <td>
                    <button onClick={()=>handleEdit(testimonial.testimonialId)}>
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          </>

        ):(
          <>
            <h2>Edit Testimonial (ID: {editTestimonialId})</h2>
            <form onSubmit={handleSubmit(handleUpdate)}>
            <div>
              <input type="number" {...register("testimonialId")} readOnly />
            </div>

            <div>
              <label>Title: </label>
              <input
                type="text"
                {...register("testimonialTitle", { required: true })}
              />
            </div>

            <div>
              <label>Author: </label>
              <input
                type="text"
                {...register("testimonialAuthor", { required: true })}
              />
            </div>

            <div>
              <label>Description: </label>
              <textarea
                {...register("testimonialDescription", { required: true })}
              />
            </div>

            <div>
              <label>Image Upload (optional): </label>
              <input type="file" {...register("testimonialImage")} />
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
                setEditTestimonial(false);
                setEditTestimonialId(null);
                reset({});
              }}
            >
              Cancel
            </button>
          </form>
          </>
        )
      }
    </div>
  )
}

export default TestimonialManagement