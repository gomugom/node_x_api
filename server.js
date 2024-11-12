const app = require('./app');
const {sequelize} = require("./models");
// app.listen이 있는 파일이 main 파일이 된다. => package.json에서 수정 필요
// => 통합테스트 라이브러리인 supertest가 app만 필요로 하기 때문에 app과 listen하는 부분을 분리


// jest TEST를 위해 DB 동기화도 server.js로 분리
sequelize.sync({force: false}).then(() => console.log('db connection success')).catch((err) => console.error('DB connection Fail', err));

app.listen(app.get('port'), () => {
    console.log(`${app.get('port')} server is running...`);
});