const Authentification = require('./controllers/authentification');
const passportService = require('./services/passport');
const passport = require('passport');
const {v4: uuidV4} = require('uuid');
const db = require('./database'); 

//authentificate with JWT and don't create a new cookie 
//based session since we are using JWT. 
const requireAuth = (req,res,next) => {
    //console.log('req.session.user', req.session.user)
    if(req.session.user){
        next()
    } else{
        res.redirect('/login')
    }
}

const setCookie = function(){
    const sql = ``
}
const isUserSignedIn = (req, res, next) => {
    if(req.session && req.session.user){
        res.redirect('/dashboard')
    } else{
    next()
    }
}; 

//change so this checks if the user when theyre at login or create user
// is signed in (if they are go to '/') and if not call next() to continue to
// the login or signup page.

module.exports = function(app){
    app.get('/login', isUserSignedIn, function(req,res){
        res.render('login', {renderErrorMessage: 'false'})
    })
    app.get('/signup', isUserSignedIn, function(req,res){
        res.render('signup')
    })
    app.get('/', requireAuth, function(req,res){
        //console.log('hi there')
        res.redirect(`/${uuidV4()}`)
    })
    app.get('/dashboard', requireAuth, function(req,res){
        res.render('dashboard', {searchResults: ''})
    })
    app.post('/search', requireAuth, async function(req,res){
        const searchInput = req.body.searchInput.trim().toLowerCase();
        //console.log('searchInput', searchInput)
        //console.log('search query pre sql')
        const sql = `SELECT * FROM userdata WHERE username LIKE '${searchInput}%'`
        await db.query(sql, function(err,data){
            //console.log('search query during sql before conditionals')
            //console.log('data', data)
            const dataArray = [];
            for (let i=0; i<data.length; i++){
                dataArray.push(`${data[i].username}`)
            }
            console.log(dataArray)
            if(data){
                //console.log('if data', dataArray)
                res.render('search', {searchResults: dataArray})
            }
            if(!data){
                //console.log('if !data')
                res.render('search', {searchResults: 'no user found'})
            }
            if(err){
                //console.log('if err')
                res.render('search', {searchResults: 'err'})
            }
        })
    })
    app.post('/searchUpdate', async function(req,res){
        const searchInput = req.body.searchInput.trim().toLowerCase();
        const sql = `SELECT * FROM userdata WHERE username LIKE '${searchInput}%'`
        await db.query(sql, function(err,data){
            //console.log('search query during sql before conditionals')
            //console.log('data', data)
            const dataArray = [];
            for (let i=0; i<data.length; i++){
                dataArray.push(`${data[i].username}`)
            }
            //console.log(dataArray)
            if(data){
                //console.log('if data', dataArray)
                res.send(`${dataArray}`)
            }
            if(!data){
                //console.log('if !data')
                res.send('')
            }
            if(err){
                //console.log('if err')
                res.send(``)
            }
        })
    })
    app.post('/addfriend', async function(req,res){
        //username of user being added
        const username = req.body.username;
        console.log('username', username)
        //my user id
        const id = Number(req.body.id);
        console.log('id', req.body.id)
        console.log('from addfriend')
        let currentUsername = '';
        let targetUserId = 0;
        const getCurrentUserInfo = `SELECT * FROM userdata WHERE id = '${id}'`
        await db.query(getCurrentUserInfo, function(err,data){
            if (err){
                console.log(err)
            } else{
                console.log('data from get current user request',data[0].username.toLowerCase())
                currentUsername = data[0].username.toLowerCase();
            }
        })
        const getTargetUserId = `SELECT id FROM userdata WHERE username = '${username}' LIMIT 1`

        await db.query(getTargetUserId, function(err,data){
            if(err){
                console.log(err)
            } else{
                //add pending request to the current user             
                targetUserId = parseInt(data[0].id);
                console.log('getTargetUserId SQL', targetUserId)
                console.log('parseInt', data[0].id)
                const sql = `INSERT IGNORE INTO ${currentUsername} (id, username, status) VALUES (${targetUserId}, '${username}', 2)`
        db.query(sql, function(err,data){
            if(err){
                console.log(err)
            } else{
                console.log('friend created')
            }
        })
        //add pending request to the target user
        const sqlForSecondUser = `INSERT IGNORE INTO ${username} (id, username, status) VALUES (${id}, '${currentUsername}', 3)`
        db.query(sqlForSecondUser, function(err,data){
            if(err){
                console.log(err)
            } else{
                console.log('friend created')
                res.send('user_added')
            }
            })
        }})
        console.log('getTargetUserId SQL', targetUserId)
        //I need to get a way to get the current user- maybe set the current user in the logout name
        //get the id of the said user somehow- by sending a query to the id here
        console.log('currentUsername:', currentUsername)
        console.log('targetUserId:', targetUserId)
        console.log('username:', username)
    })
    app.post('/checkuserstatus', function(req,res){
        const id = req.body.id;
        console.log('checkuserstatus id', id)
        console.log(req.body)
        console.log(typeof id)
        const searchResults = req.body.searchResults;
        const mainTableRequest = `SELECT * FROM userdata WHERE id = '${id}'`
        db.query(mainTableRequest, function(err,data){
            if(err){
                console.log(err)
            } else{
                console.log('data from check user status', data)
                //console.log('username', data[0].username)
                data[0].username
            }
        })

    })
    app.get('/getCurrentUser', function(req,res){
        res.send(`${req.session.user.id}`)
    } )
    app.get('/logout', function(req,res){
        req.session.destroy()
        res.redirect('/login')
    })
    app.get('/room/:room', requireAuth, (req, res)=>{
        res.render('room', {roomID: req.params.room})
    });
    //Authenticate user before Authentication.signin route handler
    //this handler gives them a token.
    app.post('/userlogin', Authentification.signin);
    app.post('/createuser', Authentification.signup);
    app.get('/:otherPage', function(req,res,next){
        if(req.session && req.session.user){
            res.redirect('/dashboard')
        } else {
            res.redirect('/login')
        }
    })
    
}