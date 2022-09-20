async function login(e){
   e.preventDefaut();
   alert('helo')
   // const loginLink=`https://yogpose-api.herokuapp.com`;
   // let data={
   //    username: document.getElementById("login__username").value,
   //    password: document.getElementById("login__password").value 

   // }

   // const axios=require('axios')
   //  const resp=await axios.post(loginLink,data);
   //  console.log(resp);
   
   // console.log(username)
   // console.log(password)
   
}
function opensinup(){
   document.getElementById("loginform").style.display="none";
   document.getElementById("SignUpform").style.display="block";
}
function openlogin(){
   document.getElementById("loginform").style.display="block";
   document.getElementById("SignUpform").style.display="none";
}