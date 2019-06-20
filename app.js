const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const helmet = require('helmet');
const hpp = require('hpp');
// connect-redis 패키지로부터 RedisStore 객체를 require한다. 이때 session을 인자로 넣어서 호출해야 한다.
// connect-redis는 express-session에 의존성이 있다.
const RedisStore = require('connect-redis')(session);
require('dotenv').config();

const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');
const {sequelize} = require('./models');
const passportConfig = require('./passport');
const logger = require('./logger');

const app = express();
sequelize.sync();
passportConfig(passport);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('port', process.env.PORT || 8001);

/**
 * process.env.NODE_ENV는 배포 환경인지 개발 환경인지를 판단할 수 있는 환경 변수이다.
 * 배포 환경일 때는 morgan을 combined 모드로 사용, 개발 환경일 때는 morgan을 dev 모드로 사용.
 * combined 모드가 더 많은 사용자 정보를 로그로 남긴다.
 * process.env.NODE_ENV는 .env에 넣을 수 없다. .env 파일은 정적 파일이기 때문이다.
 * NODE_ENV를 동적으로 바꾸는 방법으로는 cross-env가 있다.
 */
if (process.env.NODE_ENV === 'production') {
    app.use(morgan('combined'));
    app.use(helmet());
    app.use(hpp());
} else {
    app.use(morgan('dev'));
}

app.use(express.static(path.join(__dirname, 'public')));
app.use('/img', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({extended : false}));
/**
 * cookieParser와 express-session의 nodebirdsecret 같은 비밀키는 직접 하드코딩하지 않는다.
 * 키를 하드코딩하면 소스 코드가 유출되었을 때 키도 같이 유출되므로 별도로 관리해야 한다.
 * 이를 위한 패키지가 dotenv이다.
 * 비밀키는 .env라는 파일에 모아두고 dotenv가 .env 파일을 읽어 process.env 객체에 넣는다.
 * */ 
// app.use(cookieParser('nodebirdsecret'));
// app.use(session({
//     resave : false,
//     saveUninitialized : false,
//     secret : 'nodebirdsecret',
//     cookie : {
//         httpOnly : true,
//         secure : false,
//     },
// }));
// app.use(cookieParser(process.env.COOKIE_SECRET));
// app.use(session({
//     resave : false,
//     saveUninitialized : false,
//     secret : process.env.COOKIE_SECRET,
//     cookie : {
//         httpOnly : true,
//         secure : false,
//     },
// }));

/**
 * 배포 환경일 때는 proxy를 true로 cookie.secure를 true로 바꾼다. 단 https를 적용할 경우에만 사용하면 된다.
 * proxy를 true로 적용해야 하는 경우는 https 적용을 위해 노드 서버 앞에 다른 서버를 두었을 때이다.
 * 
 * express-session 미들웨어에 store 옵션을 추가하면 RedisStore에 저장한다.
 * RedisStore의 옵션으로 .env에 저장했던 값들을 사용한다.
 * logErrors 옵션으로 레디스에 에러가 났을때 콘솔에 표시할지를 결정하는 옵션이다.
 */
app.use(cookieParser(process.env.COOKIE_SECRET));
const sessionOption = {
    resave : false,
    saveUninitialized : false,
    secret : process.env.COOKIE_SECRET,
    cookie : {
        httpOnly : true,
        secure : false,
    },
    store : new RedisStore({
        host : process.env.REDIS_HOST,
        port : process.env.REDIS_PORT,
        pass : process.env.REDIS_PASSWORD,
        logsErrors : true,
    }),
};

if (process.env.NODE_ENV === 'production') {
    sessionOption.proxy = true;
}

app.use(session(sessionOption));
app.use(flash());
/**
 * passport.initialize() 미들웨어는 요청(req 객체)에 passport 설정을 심고
 * passport.session() 미들웨어는 req.session 객체에 passport 정보를 저장한다.
 * req.session 객체는 express-session에서 생성하는 것이므로 passport 미들웨어는 express-session 미들웨어보다 뒤에 연결해야 한다(5, 7라인).
 */
app.use(passport.initialize());
app.use(passport.session());

app.use('/', pageRouter);
app.use('/auth', authRouter);
app.use('/post', postRouter);
app.use('/user', userRouter);

app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    logger.info('hello');
    logger.error(err.message);
    next(err);
});

app.use((err, req, res) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중!');
});