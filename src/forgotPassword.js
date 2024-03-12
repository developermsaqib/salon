
// forgot-password start
// Import required modules
const bodyParser = require('body-parser');
const { User } = require("./api/models");
const bcrypt = require("bcryptjs");




// Middleware to parse JSON bodies
app.use(bodyParser.json());

const nodemailer = require('nodemailer');
const {SMTP_HOST,SMTP_PORT, SMTP_EMAIL, SMTP_PASSWORD} = process.env;



// Create and configure Nodemailer transporter
const transporter = nodemailer.createTransport({
    host: SMTP_HOST, 
    port: SMTP_PORT, 
    secure: true, 
    auth: {
      user: SMTP_EMAIL, 
      pass: SMTP_PASSWORD, 
    },
  });
// send email Link For reset Password
app.post("/sendpasswordlink",async(req,res)=>{
    const {email} = req.body;
    if(!email){
        res.status(401).json({status:false,message:"Enter Your Email"})
    }
    try {
        const userfind = await User.findOne({email:email});
        // token generate for reset password
        const token = jwt.sign({_id:userfind._id},process.env.JWT_SECRET,{
            expiresIn: process.env.PASSWORD_LINK_EXPIRE_TIME
        });
        
        const setusertoken = await User.findByIdAndUpdate({_id:userfind._id},{verifytoken:token},{new:true});
        if(setusertoken){
            const mailOptions = {
                from:process.env.SMTP_EMAIL,
                to:email,
                subject:"Sending Email For password Reset",
                text:`This Link is Valid For 2 MINUTES http://localhost:${PORT}/forgotpassword/${userfind.id}/${setusertoken.verifytoken}`
            }
            
            try {
                console.log(transporter);
                transporter.sendMail(mailOptions,(error,info)=>{
                    if(error){
                        res.status(401).json({status:false,message:"Email not send"})
                    }else{
                        res.status(201).json({status:true,message:"Please Check Your Email and click the link"})
                    }
                })
            } catch (error) {
                console.log(error);
            }
           

        }

    } catch (error) {
        res.status(401).json({status:false,error:error})
    }

});



// verify user for forgot password time
app.get("/forgotpassword/:id/:token",async(req,res)=>{
    const {id,token} = req.params;

    try {
        const validuser = await User.findOne({_id:id,verifytoken:token});
        
        const verifyToken = jwt.verify(token,process.env.JWT_SECRET);

        if(validuser && verifyToken._id){
            res.status(201).json({status:true,validuser})
        }else{
            res.status(401).json({status:false,message:"user does not exist"})
        }

    } catch (error) {
        res.status(401).json({status:false,error})
    }
});



// change password
app.post("/changepassword/:id/:token",async(req,res)=>{
    const {id,token} = req.params;

    const {password} = req.body;


    try {
        const validuser = await User.findOne({_id:id,verifytoken:token});
        
        const verifyToken = jwt.verify(token,process.env.JWT_SECRET);

        if(validuser && verifyToken._id){
            const newpassword = await bcrypt.hash(password,10);

            const setnewuserpass = await User.findByIdAndUpdate({_id:id},{password:newpassword});

            setnewuserpass.save();
            res.status(201).json({status:true,message:"Password Change Successfully"})

        }else{
            res.status(401).json({status:false,message:"user not exist"})
        }
    } catch (error) {
        res.status(401).json({status:false,error})
    }
})



// forgot-password end
