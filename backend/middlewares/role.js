export const check =
(...roles) => (req, res, next) =>{
    if(!req.user){
        return res.status(401).json({ message: "fail", data: "Unauthorized"});
    }
    const hasRole = roles.find(role => req.user.role ===role)
    if(!hasRole){
        return res.status(403).json({message:"fail", data:"You are not allowed to make this request."})
    }

    return next();
}


