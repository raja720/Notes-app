const bcrypts = require("bcryptjs")
const User = require("../models/User")
const jwt = require("jsonwebtoken")

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email is already registered" })
        }

        const hashedPassword = await bcrypts.hash(password, 10);

        const user = await User.create({ name, email, password: hashedPassword });

        res.status(201).json({
            message: "Signup successful",
            user: { id: user._id, name: user.name, email: user.email },

        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

const login = async (req,res)=>{
    try{
        const{email,password} = req.body;

        if(!email||!password){
            return res.status(400).json({message:"All fileds are required"});
        }

        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({message:"Invalid email or password"});

        }
        const isMatch = await bcrypts.compare(password,user.password);
        if(!isMatch){
           return res.status(400).json({message:"Invalid email or password"});
        }

        const token =jwt.sign({id:user._id},process.env.JWT_SECRET,{
            expiresIn: "7d"
        })
        res.status(200).json({
            message:"Login successful",
            token,
            user:{id: user._id,name:user.name,email: user.email},

        });

    }catch (error){
        res.status(500).json({message:"server error",error:error.message});
    }
};


const getMe = async (req,res)=>{
    try{
        const user = await User.findById(req.userId).select("-password");
        res.status(200).json(user);
    }catch(error){
        res.status(500).json({ message:"Server error" ,error: error.message})
    }
}
module.exports = { signup ,login,getMe};