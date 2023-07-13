import Mailchimp from 'mailchimp-api-v3'
import keys from '../config/keys.js'

const {key, listkey} = keys.mailchimp

class MainchimpService{
    init(){
        try{
            return new Mailchimp(
                "67c8fc9480481c63536463dc5bd995dc-us14"
            )
        }catch(error){
            console.warn('Missing mailchimp keys')
        }
    }
}

const mailchimp = new MainchimpService().init()

async function subscribeToNewsletter(email){
    
    try{
        return await mailchimp.post(`list/${listkey}/members`, {
            email_address: email,
            status:'subscribed'
        })
    }catch(error){
        return error
    }
}

export default subscribeToNewsletter