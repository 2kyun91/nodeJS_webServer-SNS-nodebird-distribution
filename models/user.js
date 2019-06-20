// 사용자 정보 모델
module.exports = (sequelize, DataTypes) => (
    sequelize.define('user', {
        email : {
            type : DataTypes.STRING(40),
            allowNull : false,
            unique : true,
        },
        nick : {
            type : DataTypes.STRING(15),
            allowNull : false,
        },
        password : {
            type : DataTypes.STRING(100),
            allowNull : true,
        },
        provider : {
            type : DataTypes.STRING(10),
            allowNull : false,
            defaultValue : 'local',
        },
        snsId : {
            type : DataTypes.STRING(30),
            allowNull : true,
        },
    }, {
        timestamps : true,
        paranoid : true,
        // 데이터베이스 문자열을 UTF8로 설정
        charset : 'utf8',
        collate : 'utf8_general_ci',
    })
);