import { useState } from "react";
import { ethers } from "ethers";

export default function WalletConnect(){

const [wallet,setWallet]=useState("");

async function connectWallet(){

if(!window.ethereum){
alert("Install MetaMask");
return;
}

const provider=
new ethers.BrowserProvider(
window.ethereum
);
const accounts=
await provider.send(
"eth_requestAccounts",
[]
);

setWallet(accounts[0]);

}

return(
<div style={{marginBottom:"20px"}}>

<button
onClick={connectWallet}
style={{
padding:"12px 20px",
background:"gold",
border:"none",
borderRadius:"10px"
}}
>
Connect Wallet
</button>

{wallet && (
<p>
Connected:
{wallet.slice(0,6)}...
{wallet.slice(-4)}
</p>
)}

</div>
)

}