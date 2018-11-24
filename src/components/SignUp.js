import React from 'react'; 

export default function SignUp(props){ 

  return (
    <form>
      <label>Full Name</label>
      <input type="text" placeholder="Jane Doe"></input>
      <label>Username</label>
      <input type="text" placeholder="JayD23"></input>
      <label>Password</label>
      <input type="password" placeholder="password123"></input>
      <label>Email</label>
      <input type="email" placeholder="jdoe23@fawn.com"></input>
    </form>
  ); 
}