import { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";

export default function CustomerDashboard(){

const [bookings,setBookings]=useState([]);
const email = localStorage.getItem("email");

useEffect(()=>{
loadBookings();
},[]);

const loadBookings = async ()=>{
const res = await axios.get("http://localhost:5000/api/bookings");
const mine = res.data.filter(b=>b.userEmail===email);
setBookings(mine);
};

const downloadReceipt=(b)=>{
const doc = new jsPDF();

doc.text("Hotel Receipt",20,20);
doc.text(`Name: ${b.userName}`,20,40);
doc.text(`Room: ${b.room}`,20,60);
doc.text(`CheckIn: ${b.checkIn}`,20,80);
doc.text(`CheckOut: ${b.checkOut}`,20,100);

doc.save("receipt.pdf");
};

return(
<div style={{padding:"40px"}}>

<h1>My Bookings</h1>

{bookings.map((b)=>(
<div key={b._id} style={{border:"1px solid gray",margin:"10px",padding:"10px"}}>

<p>{b.room}</p>
<p>{b.checkIn} → {b.checkOut}</p>

<button onClick={()=>downloadReceipt(b)}>
Download Receipt
</button>

</div>
))}

</div>
);
}