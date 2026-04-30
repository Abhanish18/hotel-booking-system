import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard(){

const [bookings,setBookings]=useState([]);

const loadBookings = async ()=>{
const res = await axios.get("http://localhost:5000/api/bookings");
setBookings(res.data);
};

useEffect(()=>{
loadBookings();
},[]);

const cancelBooking = async(id)=>{
await axios.put(`http://localhost:5000/api/bookings/${id}/cancel`);
loadBookings();
};

return(
<div style={{padding:"40px"}}>

<h1>Admin Dashboard</h1>

{bookings.map((b)=>(
<div key={b._id} style={{border:"1px solid gray",margin:"10px",padding:"10px"}}>

<p>{b.userName}</p>
<p>{b.userEmail}</p>
<p>{b.room}</p>

<button onClick={()=>cancelBooking(b._id)}>
Cancel Booking
</button>

</div>
))}

</div>
);
}