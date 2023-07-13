import Contact from '../models/contact.js'
import {sendEmail} from '../services/mailgun.js'
export const addContact = async (req, res)=>{
    try {
        const name = req.body.name
        const email = req.body.email
        const message = req.body.message
        if(!email){
            res.status(400).json({
                message: "fail",
                data:"Your must enter an email address."
            })
        }
        if(!name){
            res.status(400).json({
                message: "fail",
                data:"Your must enter a name."
            })
        }
        if(!message){
            res.status(400).json({
                message: "fail",
                data:"Your must enter a message."
            })
        }
        const existingContact = await Contact.findOne({email})
        if(existingContact){
            res.status(400).json({
                message: "error",
                data:"A request already existed for same email address."
            })
        }
        const contact = new Contact({
            name,
            email,
            message
        })
        const contactDoc = await contact.save()
        await sendEmail(email, 'contact')
        res.status(200).json({
            success: true,
            message: `We receved your message, we will reach you on your email address ${email}!`,
            contact: contactDoc
          })
    } catch (error) {
        res.status(400).json({
            message: error,
            data:"Your request could not be processed. Please try again."
        })
    }
}