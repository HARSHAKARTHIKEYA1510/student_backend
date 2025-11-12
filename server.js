const { PrismaClient } = require("@prisma/client")
const express=require("express")
const PORT=4000 
const app=express()
const cors = require("cors");
const bcrypt=require("bcrypt")
const prisma = new PrismaClient()

app.use(express.json())
app.use(cors())

app.post("/login",async (req,res)=>{
    // res.status(200).json({"message":"hii"})
    const {email,password}=req.body
    if (!email || !password){
        return res.status(400).json({success: false,"message":"Fields should not be empty"})
    }
    const existing =await prisma.users.findFirst({
        where:{email}
    })
    if (!existing){
        return res.status(400).json({success: false,"message":"User not exists"})
    }
    // const hashedpass=await bcrypt.hash(password,10)
    const IscorrectPass=await bcrypt.compare(password,existing.password)
    if (existing && !IscorrectPass){
        return res.status(400).json({success: false,"message":"Incorrect Password"})
    }
    return res.status(200).json({success: true,"message":"Login Succesfull"})

})
app.post("/signup",async(req,res)=>{
    const {email,password}=req.body
    if (!email || !password){
        return res.status(400).json({"message":"All fields are required"})
    }
    const existing=await prisma.users.findFirst({
        where:{email}
    })
    if (existing){
        return res.status(400).json({"message":"Account Exists try Logging in"})
    }
    const hashedpass=await bcrypt.hash(password,10)
    if (!existing){
        const newuser=await prisma.users.create({
            data:{email:email,password:hashedpass}
        })
        return res.status(200).json({"message":"Account created succesfully"})
    }
})



app.listen(PORT,()=>{
    console.log("SERVER IS RUNNING ON 4000 PORT ")
})