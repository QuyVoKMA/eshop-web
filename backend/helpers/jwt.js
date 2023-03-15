import  {expressjwt}  from "express-jwt";

function authJwt() {
    const secret = process.env.secret;
    const api = process.env.API_URL;
    return expressjwt({
        secret: secret,
        algorithms: ["HS256"],
        isRevoked: isRevoked
    }).unless({
       path: [
        {url: /\/public\/uploads(.*)/ , methods: ['GET', 'OPTIONS'] },
        {url: /\/api\/v1\/product(.*)/ , methods: ['GET', 'OPTIONS'] },
        {url: /\/api\/v1\/categories(.*)/ , methods: ['GET', 'OPTIONS'] },
        {url: /\/api\/v1\/orders(.*)/ , methods: ['GET', 'OPTIONS'] },
        `${api}/user/login`,
        `${api}/user/register`,
          
       ] 
    })
}

async function isRevoked(req, token) {
    console.log(token.payload.isAdmin);
    if (token.payload.isAdmin == false) {
      console.log('Not Admin');
     return true;
    }
    console.log('Admin');
    return false;
  }

export default authJwt;