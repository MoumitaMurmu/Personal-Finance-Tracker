import React, { useState } from 'react';
import './styles.css';
import Input from '../Input';
import Button from '../Button';
import { toast } from 'react-toastify';
import {GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, db, provider } from '../../firebase';
import { doc, getDoc, setDoc } from "firebase/firestore"; 
import { useNavigate } from 'react-router-dom';

const SignupSigninComponent = () => {
  const[loginForm, setLoginForm] = useState(false);
  const[name, setName] = useState("");
  const[email, setEmail] = useState("");
  const[password, setPassword] = useState("");
  const[confirmPassword, setConfirmPassword] = useState("");
  const[loading, setLoading] = useState(false);

  const navigate = useNavigate();

// Function for signup with Email and Password

  const signupWithEmail = () => {
    setLoading(true);
    console.log("Name:" , name);
    console.log("Email:" , email);
    console.log("Password:" , password);
    console.log("Confirm Pasword:" , confirmPassword);

    // Authenticate the users or basically create  a new account using Email and Password using firebase
    if(name.length !== "" && email !== "" && password !== "" && confirmPassword !== ""){
      if (password === confirmPassword){
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in 
          const user = userCredential.user;
          toast.success("User created!")
          console.log("User>> ", user);
          setLoading(false);
          setName("");
          setEmail("");
          setPassword("");
          setConfirmPassword("");
          createDoc(user);
          navigate("/dashboard");
          // ...
          // Create A DOC with user id as following id
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          toast.error(errorMessage);
          setLoading(false);

          // ..
        });
      }else{
        toast.error("Password and Confirm Password don't match!");
        setLoading(false);
      }
     
    }else{
      toast.error("All field are mandatory!");
      setLoading(false);
    }
  
  }



  // Funtion for Already Have an Account. Login with Email & Password. 

  const loginWithEmail = () => {
    console.log("Email:" , email);
    console.log("Password:" , password);
    setLoading(true);
    if(email !== "" && password !== ""){
      signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        toast.success("User Logged In Successfully!");
        console.log("User Logged In", user);
        setLoading(false);
        navigate("/dashboard");
    
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setLoading(false);
        toast.error(errorMessage);
      
      });
    }else{
      toast.error("All fields are mandatory!");
      setLoading(false);
    }
  
  }

    // CraeteDoc function

    async function createDoc(user){
      setLoading(true);
      // At first Make sure that the Doc with uid doesn't exist
      if (!user) return;
      const userRef = doc(db, "users", user.uid);
      const userData = await getDoc(userRef);
      // then will create Doc
      if (!userData.exists()){
        try{
          await setDoc(doc(db, "users", user.uid), {
            name: user.displayName ? user.displayName : name,
            email: user.email,
            photoURL: user.photoURL ? user.photoURL : "",
            createdAt: new Date(),
          });
        
          toast.success("DOC created!");
          setLoading(false);
        }catch(e){
           toast.error(e.message);
           setLoading(false);
        }
      }else{
        // toast.error("Doc has already exists!");
        setLoading(false);
      }
  }

  // Function signup/signin with Google
  
     function googleAuth(){
      setLoading(true);
      try{
        signInWithPopup(auth, provider)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          // The signed-in user info.
          const user = result.user;
          console.log("User>>>>", user);
          createDoc(user);
          setLoading(false);
          navigate("/dashboard");
          toast.success("User authenticated!");
          // IdP data available using getAdditionalUserInfo(result)
          // ...
        }).catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          toast.error(errorMessage);
          setLoading(false);
         
        });
      }catch(e) {
        toast.error(e.message);
        setLoading(false);
      }
   
     }
  
  return (
    <> 
    {
      loginForm ?( <><div className='signup-wrapper'>
        <h2 className='title'>
    Login on <span style={{color : "var(--theme)"}}>Financely.</span></h2>
    <form>
    
      <Input 
      type='email'
      label={"Email"} 
    state={email} 
    setState={setEmail} 
    placeholder={"johndoe@gmail.com"}

    />
     <Input 
    type='password'
    label={"Password"} 
    state={password} 
    setState={setPassword} 
    placeholder={"Example@123"}

    />
   
    <Button
    disabled={loading}
     text={ loading ? "Loading..." : "Login Using Email and Password"} 
     onClick={loginWithEmail}

     />
    <p className='p-login'>
    or </p>
    <Button 
    onClick={googleAuth}
    text={loading ? "Loading..." : "Login Using Google"} 
    blue={true}/>
    <p className='p-login'>Don't Have An Account? <span style={{cursor: 'pointer', color: 'blue'}} onClick={()=> setLoginForm(!loginForm)}>Click Here To Signup.</span></p>
    </form>
    </div>
    </>
      ) : (
        <div className='signup-wrapper'>
        <h2 className='title'>
    Sign Up on <span style={{color : "var(--theme)"}}>Financely.</span></h2>
    <form>
    <Input label={"FullName"} 
    state={name} 
    setState={setName} 
    placeholder={"John Doe"}

    />
      <Input 
      type='email'
      label={"Email"} 
    state={email} 
    setState={setEmail} 
    placeholder={"johndoe@gmail.com"}

    />
     <Input 
    type='password'
    label={"Password"} 
    state={password} 
    setState={setPassword} 
    placeholder={"Example@123"}

    />
     <Input 
     type='password'
     label={"Confirm Password"} 
    state={confirmPassword} 
    setState={setConfirmPassword} 
    placeholder={"Example@123"}

    />
    <Button
    disabled={loading}
     text={ loading ? "Loading..." : "Signup Using Email and Password"} 
     onClick={signupWithEmail}

     />
    <p className='p-login'>
    or</p>
    <Button 
    onClick={googleAuth}
    text={loading ? "Loading..." : "Signup Using Google"} 
    blue={true}/>
    <p className='p-login' >
    Already Have An Account? <span style={{cursor: 'pointer',color: 'blue'}} onClick={()=> setLoginForm(!loginForm)}>Click Here To Login.</span></p>
    </form>
    </div>
      )
    }
   
    </>
  )
}

export default SignupSigninComponent;