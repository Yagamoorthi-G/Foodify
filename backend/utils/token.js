import jwt from "jsonwebtoken"

const genToken = async (userId) => {
    try {                                                                       
        const token = await jwt.sign({userId}, process.env.JWT_SECRET_KEY, {expiresIn: "7d"})
        return token
    } catch (error) {
        console.log(`Error in Utils toekn.js: ${error}`)        
    }
}

export default genToken