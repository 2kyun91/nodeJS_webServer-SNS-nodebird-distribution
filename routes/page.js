const express = require('express');
const {isLoggedIn, isNotLoggedIn} = require('./middlewares');
const {Post, User} = require('../models');
const router = express.Router();

router.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile', {title : '내 정보 - NodeBird', user : req.user});
});

router.get('/join', isNotLoggedIn, (req, res) => {
    res.render('join', {
        title : '회원가입-NodeBird',
        user : req.user,
        joinError : req.flash('joinError'),
    });
});

// 먼저 데이터베이스에서 게시글을 조회한 뒤 결과를 twits에 넣어 렌더링 한다.
router.get('/', (req, res, next) => {
    Post.findAll({
        include : {
            model : User,
            attributes : ['id', 'nick'],
        },
        order : [['createdAt', 'DESC']],
    }).then((posts) => { // 결과를 posts로 지칭.
        res.render('main', {
            title : 'NodeBird',
            twits : [],
            user : req.user,
            loginError : req.flash('loginError'),
        });    
    }).catch((error) => {
        console.error(error);
        next(error);
    });
});

module.exports = router;

module.exports = router;