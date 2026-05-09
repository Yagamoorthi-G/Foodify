import jwt from "jsonwebtoken"

const isAuth = (req, res, next) => {
  try {
    // 1. Log to see if the cookie actually reached the server
    console.log("Cookies received:", req.cookies); 

    const token = req.cookies?.token;

    if (!token) {
      console.log("Auth Failed: Token not found in cookies."); 
      return res.status(401).json({ message: "Token not found" })
    }

    // 2. Try to verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
    
    req.userId = decoded.userId
    next()
  } catch (error) {
    // 3. Log the exact reason verification failed (e.g. missing secret, expired)
    console.log("Auth Error Details:", error.message); 
    return res.status(401).json({ message: "Invalid token" })
  }
}

export default isAuth