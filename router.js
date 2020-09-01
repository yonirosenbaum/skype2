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
    app.get('/room', requireAuth, function(req,res){
        //console.log('hi there')
        res.redirect(`/room/${uuidV4()}`)
    })
    app.get('/room/:room', (req, res)=>{
        res.render('room', { roomID: req.params.room })
    });
    app.get('/dashboard', requireAuth, function(req,res){
        res.render('dashboard', {searchResults: ''})
    })
    app.get('/friendsList', function(req,res){
        const id = req.session.user.id;
        const getUsername = `SELECT * FROM userdata where id = '${id}'`;
        db.query(getUsername, function(err,data){
            if(err){
                res.send('error')
            } 
            if(!data){
                res.send('no friends found')
            }
            else if (data[0]){
            const username = data[0].username;
            const getFriends = `SELECT * FROM ${username} WHERE status = '4'`
            db.query(getFriends, function(err,data){
                if(err){
                    console.log(err)
                    res.end()
                } else {
                    let friends = []
                    let user = []
                    for(let i=0; i<data.length; i++){
                        friends.push(data[i].id)
                        user.push(data[i].username)
                    }
                    res.send(friends);
                   // res.end()
                }
            })
        }
        })
    })
    app.post('/getusers', function(req,res){
        const idArray = req.body.id.split(',')
        let getUsernames = `SELECT username FROM userdata WHERE (id = '${idArray[0]}')`
        if(idArray[1]){
        for(let i = 1; i<idArray.length; i++){
            getUsernames += ` OR (id = '${idArray[i]}')`
        }
    }
    console.log(getUsernames)
    db.query(getUsernames, function(err,data){
        if(err){
            console.log(err)
        } else {
            console.log(data)
            let usernames = []
            for(let i=0; i<data.length;i++){
                usernames.push(data[i].username)
            }
            console.log(usernames)
            res.send(usernames)
        }
    })
    })
    app.post('/newrequests', function(req,res){
        const userId = req.session.user.id
        const getUsername = `SELECT * FROM userdata WHERE id = '${userId}'`
        db.query(getUsername, function(err, data){
            if(err){
                console.log(err)
                res.end()
            }
            else{ 
            let username = data[0].username;
            console.log('current user', username)
            const getFriendRequests = `SELECT * FROM ${username} WHERE status = '3'`
            db.query(getFriendRequests, function(err, data){
                if(err){
                    console.log(err)
                    res.send('[]')
                }
                if(!data[0]){
                    console.log('no friend requests')
                    res.send('')
                }
                else if(data){
                    console.log('data from friend requests', data)
                    let dataArray = [];
                    for(let i=0; i<data.length;i++){
                        dataArray.push(data[i])
                    }
                    console.log('dataArray',dataArray)
                    res.send(dataArray)
                    //res.render('requests')
                }
            })
        }
        })
    })
    app.post('/addorremoveuser', function(req,res){
        console.log('add remove id', req.body.id)
        console.log('add remove button',req.body.button)
        console.log('req.session', req.session.user.id)
        console.log('targetUser', req.body.targetUser)
        const id = req.session.user.id;
        const targetUser = req.body.targetUser
        
        const getUsername = `SELECT * FROM userdata WHERE id = "${id}"`
        db.query(getUsername, function(err,data){
            if(err){
                console.log(err)
                res.end()
            } else{
                const username = data[0].username;
                console.log('my username', username)
                if(req.body.button == 'plus'){
                    //update from both
                    const addUserToCurrent =
                    `UPDATE ${username} SET status='4' WHERE username='${targetUser}'`
                    db.query(addUserToCurrent, function(err,data){
                        if(err){
                            console.log(err)
                        } else{
                            console.log(`updated ${targetUser} in ${username}`)
                        }
                    })
                    const addUserToTarget =
                    `UPDATE ${targetUser} SET status='4' WHERE username='${username}'`
                    db.query(addUserToTarget, function(err,data){
                        if(err){
                            console.log(err)
                        } else{
                            console.log(`updated ${username} in ${targetUser}`)
                        }
                    })
                }
                else if(req.body.button == 'minus'){
                    //delete from both
                    const deleteTargetUserFromCurrentUser=
                    `DELETE FROM ${username} WHERE username='${targetUser}'`
                    db.query(deleteTargetUserFromCurrentUser, function(err, data){
                        if(err){
                            console.log(err)
                        } else{
                            console.log(`${targetUser} deleted from ${username}`)
                        }
                    })
                    const deleteCurrentUserFromTargetUser=
                    `DELETE FROM ${targetUser} WHERE username='${username}'`
                    db.query(deleteCurrentUserFromTargetUser, function(err, data){
                        if(err){
                            console.log(err)
                        } else{
                            console.log(`${username} deleted from ${targetUser}`)
                        }
                    })
                }
            }
        })
    })
    app.get('/requests', requireAuth, function(req,res){
        res.render('requests')
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
            console.log('data for status 4 on search', data[0].status)
            for (let i=0; i<data.length; i++){
                    console.log('post not equal to status 4', data)
                dataArray.push(`${data[i].username}`)
        }
            console.log('datarray for search', dataArray)
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
        console.log('searchupdate searchinput', searchInput)
        const sql = `SELECT * FROM userdata WHERE username LIKE '${searchInput}%' LIMIT 10`
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
        //console.log('username', username)
        //my user id
        const id = Number(req.body.id);
        console.log('addfriend username', username )
        console.log('addfriend id', id )
        //console.log('id', req.body.id)
       // console.log('from addfriend')
        let currentUsername = '';
        let targetUserId = 0;
        const getCurrentUserInfo = `SELECT * FROM userdata WHERE id = '${id}'`
        await db.query(getCurrentUserInfo, function(err,data){
            if (err){
                console.log(err)
            } 
            if (!data[0]){
                res.send('friend not found')
            }
            else if(data[0]){
                console.log('data from get current user request',data[0].username.toLowerCase())
                currentUsername = data[0].username.toLowerCase();
            }
        })
        const getTargetUserId = `SELECT id FROM userdata WHERE username = '${username}' LIMIT 1`

        await db.query(getTargetUserId, function(err,data){
            if(err){
                console.log(err)
            } else{
                console.log('adding user data object', data)
                console.log('adding user username', username)
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
        //console.log('getTargetUserId SQL', targetUserId)
        //I need to get a way to get the current user- maybe set the current user in the logout name
        //get the id of the said user somehow- by sending a query to the id here
        //console.log('currentUsername:', currentUsername)
       // console.log('targetUserId:', targetUserId)
       // console.log('username:', username)
    })
    app.post('/checkuserstatus', async function(req,res){
        const id = req.body.id;
       // console.log('checkuserstatus id', id)
       // console.log(req.body)
       // console.log(typeof id)
        const searchResults = req.body.searchResults;
        console.log('id from checkuserstatus', id)
        console.log('searchresults checkuserstatus', searchResults)
        //console.log('search result', searchResults)
       // console.log('typeof search result', searchResults)
       const newsearchResults = searchResults.split(',')
       /*console.log('split searchresults',newsearchResults)
       console.log(typeof newsearchResults)
       let SQLSearchResultsArray = []; 
       for (let i=0; i<newsearchResults.length; i++){
           SQLSearchResultsArray.push(`${newsearchResults[i]}`)
       }
       */
       //console.log('post loop array', SQLSearchResultsArray);
       let ArrayAsString = `${newsearchResults}`
       //let ArrayWithoutBrackets = ArrayAsString.substring(0, (ArrayAsString.length))
       console.log('type of array', ArrayAsString)
       console.log('arrayasstring',ArrayAsString)
      /* 
       console.log(ArrayWithoutBrackets)
       console.log(typeof ArrayWithoutBrackets)
       console.log(ArrayWithoutBrackets[0])
       console.log(ArrayWithoutBrackets[(ArrayWithoutBrackets.length-1)])
       */
        let username = []
        const mainTableRequest = `SELECT * FROM userdata WHERE id = '${id}'`
        await db.query(mainTableRequest, async function(err,data){
            if(err){
                console.log(err)
                res.send('error')
            }
            if(!data[0]){
                res.send('no user found')
            }
            else if(data[0]){
            
                console.log('data from check user status array[0]', data[0].username)

                //console.log('username', data[0].username)

                //Get user information of all users in search page
                const currentUserUsername = data[0].username
                let queryFriendStatus = `SELECT * FROM ${currentUserUsername} WHERE username IN(`;
                for(let i = 0 ;i<newsearchResults.length;i++){
                    queryFriendStatus = queryFriendStatus + `"` + newsearchResults[i].toLowerCase() + `"` + `,`;
                  }
                  
                  queryFriendStatus = queryFriendStatus.substring(0, (queryFriendStatus.length - 1));
                  console.log('queryFriendStatus', queryFriendStatus)
                  queryFriendStatus = queryFriendStatus + `)`
                
                await db.query(queryFriendStatus, function(err, data){
                    if(err){
                        console.log(err)
                    } else{
                        //console.log('data from queryfriend status request',data)
                        const sendUserFriendInfo = []
                       /* for(let i=0; data.length; i++){
                        const userFriendStatus = {username: `${data[0].username}`, status: `${data[i].status}`}
                        sendUserFriendInfo.push(userFriendStatus)
                        }*/
                        console.log('queryFriend status final request on router', data)
                        res.send(data)
                    }
                })
            }
        })
        console.log('checkuserstatus username', username[0])
    })
    app.get('/getCurrentUser', function(req,res){
        console.log('getCurrentUser_ID FROM req.session', req.session.user.id)
        res.send(`${req.session.user.id}`)
    } )
    app.get('/logout', function(req,res){
        req.session.destroy()
        res.redirect('/login')
    })
    app.get('/', requireAuth, function(req,res,next){
        res.redirect('dashboard')
    })
    //Authenticate user before Authentication.signin route handler
    //this handler gives them a token.
    app.post('/userlogin', Authentification.signin);
    app.post('/createuser', Authentification.signup);
    app.get('/:otherPage', function(req,res,next){
        if (req.originalUrl.startsWith('/peerjs')) {
            // skip any /peerjs websocket routes to prevent
            // unauthorised error
            next();
        }
        if(req.session && req.session.user){
            res.redirect('/dashboard')
        } else {
            res.redirect('/login')
        }
    })
    
}