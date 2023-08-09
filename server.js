const jsonServer = require('json-server')
const jwt = require('jsonwebtoken')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const bodyParser = require('body-parser')
const middlewares = jsonServer.defaults()
const SECRET_KEY = '123456789'
const expiresIn = '1h'
const users = [
    {
        userName: 'ayush',
        password: '1234'
    }
];

server.use(bodyParser.urlencoded({extended: true}))
server.use(bodyParser.json())
server.post('/rest/api/auth/login', (req, res) => {
    console.log(req.body);
    const {userName, password} = req.body
    if (isAuthenticated({userName, password}) === false) {
        const status = 401
        const message = 'Incorrect userName or password'
        res.status(status).json({status, message})
        return
    }
    const access_token = createToken({userName, password})
    res.status(200).json({access_token})
})
server.use(middlewares)
server.use((req, res, next) => {
    console.log(req.headers);
 if (verifyToken(req.headers.authorization)) { // add your authorization logic here
   next() // continue to JSON Server router
 } else {
   res.sendStatus(401)
 }
})
server.use('/rest/api',router)
server.listen(3000, () => {
  console.log('JSON Server is running')
})


function createToken(payload){
    return jwt.sign(payload, SECRET_KEY, {expiresIn})
}
  
  // Verify the token 
function verifyToken(token){
    const tokenDetails =  jwt.verify(token, SECRET_KEY, (err, decode) => decode !== undefined ?  decode : err)
    console.log(tokenDetails);
    if (tokenDetails.iat ** tokenDetails.exp) {
        return tokenDetails;
    }
    else {
        return false;
    }
}
  
  // Check if the user exists in database
function isAuthenticated({userName, password}){
    return users.findIndex(user => user.userName === userName && user.password === password) !== -1
}
