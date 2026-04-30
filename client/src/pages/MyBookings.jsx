 import { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";

export default function MyBookings() {

const [bookings,setBookings]=useState([]);

useEffect(()=>{
loadBookings();
},[]);

const loadBookings = async ()=>{
try{
const res = await axios.get("http://localhost:5000/api/bookings");
setBookings(res.data);
}catch(err){
console.log(err);
}
};

const cancelBooking = async(id)=>{
try{
await axios.put(`http://localhost:5000/api/bookings/${id}/cancel`);
loadBookings();
alert("Booking Cancelled");
}catch(err){
alert("Cancel failed");
}
};

const downloadReceipt=(booking)=>{
const pdf = new jsPDF();

pdf.setFontSize(22);
pdf.text("Hotel Booking Receipt",20,30);

pdf.setFontSize(14);
pdf.text(`Guest: ${booking.name}`,20,60);
pdf.text(`Email: ${booking.email}`,20,75);
pdf.text(`Room: ${booking.room}`,20,90);
pdf.text(`Status: ${booking.status}`,20,105);

const amount=
booking.room==="Deluxe Room"?100:180;

pdf.text(`Amount: $${amount}`,20,120);

pdf.text(
`Transaction:
0x${Math.random().toString(16).substring(2,18)}`,
20,
140
);

pdf.save("booking-receipt.pdf");
};

const roomImage=(room)=>{
if(room==="Suite Room"){
return "https://images.unsplash.com/photo-1566073771259-6a8506099945";
}
return "https://images.unsplash.com/photo-1631049307264-da0ec9d70304";
};

return (
<div
style={{
background:"#f4f7fb",
minHeight:"100vh",
padding:"40px"
}}
>

<h1
style={{
fontSize:"50px",
marginBottom:"30px",
color:"#0d2b6b"
}}
>
My Luxury Bookings
</h1>

<div
style={{
display:"grid",
gridTemplateColumns:"repeat(auto-fit,minmax(420px,1fr))",
gap:"30px"
}}
>

{bookings.map((booking)=>{

const amount=
booking.room==="Deluxe Room"?100:180;

return(

<div
key={booking._id}
style={{
background:"white",
borderRadius:"25px",
overflow:"hidden",
boxShadow:"0 8px 30px rgba(0,0,0,.1)"
}}
>

<img
src={roomImage(booking.room)}
style={{
width:"100%",
height:"250px",
objectFit:"cover"
}}
/>

<div style={{padding:"30px"}}>

<h2 style={{color:"#0d2b6b"}}>
{booking.room}
</h2>

<p><b>Guest:</b> {booking.name}</p>
<p><b>Email:</b> {booking.email}</p>

<p>
<b>Status:</b>{" "}
<span
style={{
color:
booking.status==="cancelled"
? "red"
: "green",
fontWeight:"bold"
}}
>
{booking.status}
</span>
</p>

<p>
<b>Amount:</b> ${amount}
</p>

<p>
<b>Blockchain Tx:</b><br/>
0xabc123...demo
</p>

<div
style={{
display:"flex",
gap:"15px",
marginTop:"25px"
}}
>

<button
onClick={()=>downloadReceipt(booking)}
style={{
background:"#0d2b6b",
color:"white",
border:"none",
padding:"12px 20px",
borderRadius:"10px",
cursor:"pointer"
}}
>
Download Receipt
</button>

{booking.status!=="cancelled" && (
<button
onClick={()=>cancelBooking(booking._id)}
style={{
background:"#d62828",
color:"white",
border:"none",
padding:"12px 20px",
borderRadius:"10px",
cursor:"pointer"
}}
>
Cancel Booking
</button>
)}

</div>

</div>
</div>

)

})}

</div>

</div>
);
}