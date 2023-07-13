import subscribeToNewsletter from '../services/mailchimp.js'
import {sendEmail} from '../services/mailgun.js'
export const addnewsletter = async (req, res)=>{
    try {
        const email = req.body.email
        if(!email){
            res.status(400).json({
                message: "error",
                data:"You must enter an email."
            }) 
        }
        const result = await subscribeToNewsletter(email)
        if(result.status === 400){
            res.status(400).json({
                message: "error",
                data: result.title
            }) 
        }
        await sendEmail(email, 'newsletter-subscription')
        res.status(200).json({
            message: 'success',
            data: 'You have successfully subscribed to the newsletter.'
        })
    } catch (error) {
        res.status(400).json({
            message: error,
            data:"Your request could not be processed. Please try again."
        })
    }
}