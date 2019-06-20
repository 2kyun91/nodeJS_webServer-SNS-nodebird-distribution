/**
 * 배포 시 데이터베이스도 배포 환경으로 설정해야 한다.
 * 시퀄라이즈에서 가장 큰 문제는 비밀번호가 하드코딩되어 있다는 것이다.
 * 시퀄라이즈는 JSON 대신 js파일을 설정 파일로 쓸 수 있게 지원해준다.
 * 
 * 보안 정도에 나머지 정보도 process.env로 바꿔주면 된다. root 계정은 숨기는 게 좋다.
 * process.env가 development일 때는 development 속성의 설정 내용이 적용되고 production일 때는 production 속성의 설정 내용이 적용된다.
 * 콘솔에 sql문이 노출되지 않게 하려면 logging에 false를 주면 된다.
 */
require('dotenv').config();

module.exports = {
    development : {
        username : 'root',
        password : process.env.SEQUELIZE_PASSWORD,
        database : 'nodebird',
        host : '127.0.0.1',
        dialect : 'mysql',
        operatorsAliases : 'false',
    },
    production : {
        username : 'root',
        password : process.env.SEQUELIZE_PASSWORD,
        database : 'nodebird',
        host : '127.0.0.1',
        dialect : 'mysql',
        operatorsAliases : 'false',
        logging : false,
    },
};