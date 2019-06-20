// 해시태그 모델
module.exports = (sequelize, DataTypes) => (
    sequelize.define('hashtag', {
        title : {
            type : DataTypes.STRING(15),
            allowNull : false,
            unique : true,
        },
    }, {
        timestamps : true,
        paranoid : true,
        // 데이터베이스 문자열을 UTF8로 설정
        charset : 'utf8', 
        collate : 'utf8_general_ci',
    })
);