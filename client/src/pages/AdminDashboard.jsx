 import {useEffect,useState} from "react";
import axios from "axios";
import {ethers} from "ethers";

export default function AdminDashboard(){

const [bookings,setBookings]=useState([]);
const [chainCount,setChainCount]=useState(0);

useEffect(()=>{
 loadBookings();
 loadBlockchainCount();
},[]);



async function loadBookings(){

const res=
await axios.get(
"http://localhost:5000/api/bookings"
);

setBookings(
res.data
);

}



async function loadBlockchainCount(){

try{

const provider=
new ethers.JsonRpcProvider(
"http://127.0.0.1:8545"
);

const abi=[
"function bookingCount() view returns(uint)"
];

const contract=
new ethers.Contract(
"0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
abi,
provider
);

const count=
await contract.bookingCount();

setChainCount(
Number(count)
);

}catch(err){
console.log(err);
}

}



async function cancelBooking(id){

await axios.put(
`http://localhost:5000/api/bookings/${id}/cancel`
);

alert(
"Cancelled"
);

loadBookings();

}



const revenue=
bookings.reduce(
(sum,b)=>
sum+(b.totalAmount||0),
0
);



return(

<div style={{padding:"30px"}}>

<h1>
Hotel Dashboard
</h1>

<h2>
Mongo Bookings:
{bookings.length}
</h2>

<h2>
Blockchain Bookings:
{chainCount}
</h2>

<h2>
Revenue:
${revenue}
</h2>


<hr/>


<table border="1" cellPadding="10">

<thead>
<tr>
<th>Name</th>
<th>Room</th>
<th>Status</th>
<th>Action</th>
</tr>
</thead>

<tbody>

{bookings.map((b)=>(
<tr key={b._id}>

<td>{b.userName}</td>

<td>{b.room}</td>

<td>{b.status}</td>

<td>

{b.status==="booked" ? (

<button
onClick={()=>
cancelBooking(b._id)
}
>
Cancel
</button>

):(
"Cancelled"
)}

</td>

</tr>
))}

</tbody>

</table>

</div>

)

}