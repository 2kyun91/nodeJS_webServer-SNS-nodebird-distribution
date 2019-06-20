// 게시글 모델
module.exports = (sequelize, DataTypes) => (
    sequelize.define('post', {
        content : {
            type : DataTypes.STRING(140),
            allowNull : false,
        },
        img : {
            type : DataTypes.STRING(200),
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
