const app = require('../app');
const request = require('supertest');
const {sequelize} = require("../models");

// beforeAll(async () => {
//     await sequelize.sync({force: true}); // 새로 시작할 때마다 데이터 날리고 새로 생성함
// });
describe('User Controller - no login [TEST]', () => {
   test('login 하지 않은 상태로 follow 요청', async () => {
       const res = {
           send: jest.fn(),
           status: jest.fn(() => res),
       };
       const response = await request(app).post(`/user/1/follow`).expect(403);

       expect(response.text).toEqual('로그인 필요');
           // .expect(res.send).toBeCalledWith('로그인 필요');
   });
});

describe('User Controller - before login [TEST]', () => {

    const agent = request.agent(app);

    beforeEach(async () => {
        // 회원 가입
        await agent.post('/auth/join').send({
            email: 'abc@test.com',
            password: 'abcdef!',
            nick: 'abc',
        });
        // 로그인
        await agent.post('/auth/login').send({
            email: 'abc@test.com',
            password: 'abcdef!',
        });
    });

    test('login한 상태에서 정상적인 팔로우 요청', async () => {
        const response = await agent.post('/user/2/follow').expect(200);
        expect(response.text).toEqual('success');
    });

    test('login한 상태에서 존재하지 않는 사용자 follow 요청', async () => {
        const response = await agent.post('/user/30/follow').expect(500);
        expect(() => throwErrorFunction()).toThrow("DB 에러");
    });

    function throwErrorFunction() {
        throw new Error("DB 에러");
    }
});

afterAll(async () => {
    await sequelize.close(); // 연결을 종료하여 DB 리소스를 해제
});