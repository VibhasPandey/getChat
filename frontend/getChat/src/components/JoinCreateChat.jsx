import React from 'react'
import {useState} from 'react' 
import toast from 'react-hot-toast'
import { createRoomApi, joinChatApi } from '../Services/RoomService';
import useChatContext from '../ChatContext';
import { useNavigate } from 'react-router';

export const JoinCreateChat = () => {

    const [details,setDetails]=useState({
        roomId:"",
        userName:""
    });

    const {roomId,currentUser,connected,setRoomId,setCurrentUser,setConnected} = useChatContext();
    const navigate= useNavigate();
   
    
    
     function handleFormInputChange(event){
        setDetails({
            ...details,
        [event.target.name]:event.target.value
        });
    }

        function validateForm(){
            if(details.roomId.trim()==="" || details.userName.trim()=="")
            {
                toast.error("Invalid input");
                return false;
            }

            return true
        }

       async function joinChat(){

            if(validateForm()){
                

                try {
                    const room=await joinChatApi(details.roomId);
                    toast.success("joined...");
                    setCurrentUser(details.userName);
                    setRoomId(details.roomId);
                    setConnected(true);
                    navigate("/chat")

                } catch (error) {
                    if(error.status==400)
                        toast.error("room not found...");
                    else
                        toast.error("error joining room")
                    console.log(error)
                    
                }



            }


        }

        async function createRoom(){
            if(validateForm()){
                console.log(details);

                try {
                    const res=await createRoomApi(details.roomId);
                    console.log(res);
                    toast.success("Room created Successfully !!");
                    toast.success("Happy Chatting..")
                    setCurrentUser(details.userName);
                    setRoomId(details.roomId);
                    setConnected(true);
                    navigate("/chat")
               
                } catch (error) {
                    console.log(error);
                    if(error.status== 400){
                        toast.error("Room already exists!")
                    }
                    else
                    toast.error("Uh oh! some error occured :[");
                    
                }

            }

        }
  return (
      <div className='min-h-screen flex flex-col'>
         <nav className='w-full dark:bg-gray-800 shadow-md py-4 px-8'>
      
      <div className='flex items-center gap-3'>

        {/* Column 1: The Logo */}
        <span className='text-4xl text-blue-500 font-bold'>{`{}`}</span>

        {/* Column 2: The Title and Subtitle stacked vertically */}
        <div>
          <h1 className='text-2xl font-bold leading-tight'>getChat!</h1>
          <p className='text-sm text-gray-400'>a real time chat application</p>
        </div>
        
      </div>
    </nav>
    <main className='flex-grow flex items-center justify-center'>
    <div className='min-h-screen flex items-center justify-center '>
        
        <div className=' p-10 dark:border-gray-700 border w-full flex flex-col gap-5 max-w-md rounded dark:bg-gray-900 shadow'>
            <h1 className='text-2xl font-semibold text-center'>
                Join Room/Create room..
            </h1>
            <div className=''>

                <label htmlFor='name' className='block font-medium mb-2'>Your Name

                </label>
                   {/* name input field */}
                <input type='text'
                onChange={handleFormInputChange}
                value={details.userName} 
                id='name'
                name='userName'
                placeholder='Enter your name'
                className='w-full dark:ng-gray-600 px-4 py-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'>
                </input>
               

            </div>
            <div className=''>

                <label htmlFor='name' className='block font-medium mb-2'>Room ID/New Room ID

                </label>
                {/* room id input field */}
                <input type='text'
                onChange={handleFormInputChange}
                value={details.roomId} 
                id='name'
                name='roomId'
                placeholder='Enter room ID'
                className='w-full dark:ng-gray-600 px-4 py-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'>
                </input>
               

            </div>

            <div className='flex justify-center gap-10 mt-4'>
                <button
                onClick={joinChat} 
                className='px-3 py-2 dark:bg-blue-500 hover:dark:bg-blue-800 rounded-full'>Join Room </button>
                <button 
                onClick={createRoom}
                className='px-3 py-2 dark:bg-orange-500 hover:dark:bg-orange-800 rounded-full'>Create Room </button>
            </div>
        </div>

    </div>
</main>
    </div>  )
}
