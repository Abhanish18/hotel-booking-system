 import express from "express";
import Booking from "../models/Booking.js";
import contract from "../services/blockchain.js";

const router = express.Router();


// GET ALL BOOKINGS
router.get("/", async(req,res)=>{

try{

const bookings=
await Booking.find().sort({
createdAt:-1
});

res.json(bookings);

}

catch(err){

res.status(500).json({
message:"Fetch failed"
});

}

});



// CREATE BOOKING
router.post("/", async(req,res)=>{

try{

const {
userName,
userEmail,
room,
checkIn,
checkOut
}=req.body;


if(
!userName||
!userEmail||
!room||
!checkIn||
!checkOut
){
return res.status(400).json({
message:"All fields required"
});
}


const start=
new Date(checkIn);

const end=
new Date(checkOut);


if(end<=start){
return res.status(400).json({
message:"Invalid dates"
});
}



const nights=
Math.ceil(
(end-start)/(1000*60*60*24)
);

const totalAmount=
nights*100;



// BLOCKCHAIN
const unixCheckIn=
Math.floor(
start.getTime()/1000
);

const unixCheckOut=
Math.floor(
end.getTime()/1000
);

await contract.createBooking(
room,
unixCheckIn,
unixCheckOut
);



// MONGO
const booking=
await Booking.create({

userName,
userEmail,
room,
checkIn:start,
checkOut:end,
totalAmount,
status:"booked"

});


res.status(201).json({

message:
"Saved in Mongo + Blockchain",

booking

});


}

catch(err){

console.log(err);

res.status(500).json({
message:"Booking failed"
});

}

});




// CANCEL BOOKING
router.put(
"/:id/cancel",
async(req,res)=>{

try{

const booking=
await Booking.findById(
req.params.id
);

if(!booking){
return res.status(404).json({
message:"Booking not found"
});
}


booking.status=
"cancelled";

await booking.save();


// blockchain cancel
await contract.cancelBooking(
1
);


res.json({
message:
"Cancelled in Mongo + Blockchain"
});

}

catch(err){

console.log(err);

res.status(500).json({
message:"Cancel failed"
});

}

}
);


export default router;