let selectedProduct="";
function toggleMenu(){document.getElementById("navLinks").style.display=document.getElementById("navLinks").style.display==="flex"?"none":"flex"}
function openOrder(product){selectedProduct=product;document.getElementById("modalProduct").textContent=product;document.getElementById("orderModal").classList.add("show");document.getElementById("orderModal").setAttribute("aria-hidden","false");switchType()}
function closeOrder(){document.getElementById("orderModal").classList.remove("show");document.getElementById("orderModal").setAttribute("aria-hidden","true")}
function switchType(){let retail=document.getElementById("orderType").value==="retail";document.getElementById("retailFields").hidden=!retail;document.getElementById("wholesaleFields").hidden=retail;document.getElementById("paymentBox").hidden=!retail}
function details(){return {name:document.getElementById("name").value.trim(),phone:document.getElementById("phone").value.trim(),address:document.getElementById("address").value.trim()}}
function buildMessage(){let d=details(),type=document.getElementById("orderType").value;if(!d.name||!d.phone){alert("Please enter your name and phone number.");return null}
let m=`Hello ZYKA GOLD,\n\n${type==="retail"?"RETAIL ORDER":"WHOLESALE ENQUIRY"}\nProduct: ${selectedProduct}\n`;
if(type==="retail")m+=`Pack size: ${document.getElementById("pack").value}\nQuantity: ${document.getElementById("qty").value}\n`;
else m+=`Required quantity: ${document.getElementById("wqty").value||"Not specified"}\n`;
m+=`Name: ${d.name}\nPhone: ${d.phone}\nCity / Address: ${d.address||"Not specified"}\n\nPlease confirm the order details.`;
return m}
function sendWhatsApp(){let m=buildMessage();if(!m)return;let number=document.getElementById("orderType").value==="retail"?"918102942195":"916201453823";window.open("https://wa.me/"+number+"?text="+encodeURIComponent(m),"_blank")}
function payUPI(){let d=details();let product=selectedProduct,pack=document.getElementById("pack").value,qty=document.getElementById("qty").value;if(!d.name||!d.phone){alert("Please enter your name and phone number first.");return}let note=`ZYKA GOLD - ${product} ${pack} x ${qty}`;window.location.href=`upi://pay?pa=8102942195-5@axl&pn=ZYKA%20GOLD&cu=INR&tn=${encodeURIComponent(note)}`}
function paid(){let m=buildMessage();if(!m)return;m+="\n\nPAYMENT STATUS: I Have Paid\nI will send the payment screenshot in WhatsApp.";window.open("https://wa.me/918102942195?text="+encodeURIComponent(m),"_blank")}
window.addEventListener("click",e=>{if(e.target.id==="orderModal")closeOrder()})
