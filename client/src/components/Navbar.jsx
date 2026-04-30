import {Link} from "react-router-dom";

export default function Navbar(){

return(
<div style={{
background:"#081f4d",
padding:"20px",
display:"flex",
gap:"30px"
}}>

<Link to="/" style={link}>
Home
</Link>

<Link to="/mybookings" style={link}>
My Bookings
</Link>

<Link to="/admin" style={link}>
Admin
</Link>

</div>
)
}

const link={
color:"gold",
textDecoration:"none",
fontWeight:"bold"
}