const express =require('express');
const req = require('express/lib/request');
const axios=require('axios')
const redis=require('redis')
const client=redis.createClient({
    port:6379,
})
client.on('error', (err) => console.log('Redis Client Error', err));
const app=express()

async function cacher(req,res,next){
    console.log("Helloooooooo")
    //await client.connect()
    client.get('cacheData',(err,data)=>{
        if(err) throw err
        if(data){
            res.send(JSON.parse(data))
        }else{
            console.log("Inside Else =------")
            next()
        }
    })
}
app.get('/repos',cacher,async(req,res)=>{

   const users= await axios.get('https://jsonplaceholder.typicode.com/posts/1')
   const data=users.data
   console.log(data)
   await client.set('cacheData',JSON.stringify(data),'EX',3600)
   
   res.send(data)
})


app.listen(8000,()=>{
    console.log("Server is running on port 8000")
})

