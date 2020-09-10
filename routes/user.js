const express = require('express');
const router = express.Router();
const passDb = require('../dbAndModel/model');
const bcrypt = require('bcryptjs');
const passport = require('passport');


router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/register', (req, res) => {
    res.render('register');
});

// Register
router.post('/register', (req, res) => {
    // console.log(req.body);
    const {name, email, password, password2} = req.body;
    let errors = [];

    //Check required fields
    if(!name || !email || !password || !password2){
        errors.push({message: 'Please fill in all fields'});
    }

    // Check passwords match
    if(password !== password2) {
        errors.push({message: 'Passwords do not match'})
    }

    // Check passwords length
    if(password.length <3){
        errors.push({message: 'Password should be at least 6 characters'})
    }

    if(errors.length > 0){
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        })

    } else {
        //Email Validation 
        passDb.findOne({email: email})
            .then(data => {
                if(data){
                    //user exists
                    errors.push({message: 'Email is alrady registered'});
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    })

                } else {
                    const newUser = new passDb({
                        name,
                        email,
                        password
                    });
                    // console.log(newUser);
                    //Hash password using bcrypt
                    bcrypt.genSalt(10, (err, salt) =>
                    bcrypt.hash(newUser.password, salt, (err, hash) =>{
                        if(err) throw err;
                        //set password to hashed
                        newUser.password = hash;
                        //save user
                        newUser.save()
                            .then(user => {
                                req.flash('success_msg', 'You are now registered and can log in');
                                res.redirect('/user/login');
                            })
                            .catch(err => console.log(err));
                    }))
                    
                }
            });
    }
    // const passDocument = new passDb({
    //     name: req.body.name,
    //     email: req.body.email,
    //     password: req.body.password
    // });

    // passDocument.save()
    //     .then(data => {
    //         console.log(data);
    //         res.send('saved!!')
    //     })
    //     .catch( err => {
    //         res.status(500).json({
    //             message: 'error occured',
    //             err
    //         })            
    //     })
    
});

//Login Handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/user/login',
        failureFlash: true
    })(req, res, next);
});

// LogOut Handle
router.get('/logout', (req, res) => {
    req.logOut();
    req.flash('success_msg', 'You are logged out')
    res.redirect('/user/login');
})

module.exports = router;