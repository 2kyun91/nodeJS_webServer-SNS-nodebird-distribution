/**
 * winston 패키지는 실제 서버 운영 시 console.log와 console.error를 대체하기 위한 모듈이다.
 * 서버 종료시 console의 에러 메세지를 확인할 수 가 없기 때문에 로그를 파일이나 다른 데이터베이스에 저장해야 한다.
 * 
 * winston 패키지의 createLogger 메소드로 logger를 만든다. 인자로 logger에 대한 설정을 넣는다.
 */
const {createLogger, format, transports} = require('winston');

const logger = createLogger({
    level : 'info', // 로그의 심각도
    format : format.json(), // 로그의 형식
    transports : [ // 로그 저장 방식
        new transports.File({filename : 'combined.log'}),
        new transports.File({filename : 'error.log', level : 'error'}),
    ],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({format : format.simple()}));
}

module.exports = logger;