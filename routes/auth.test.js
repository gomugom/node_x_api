const app = require('../app');
const request = require('supertest');

const { sequelize } = require('../models'); // sequelize를 이번엔 mock이 아닌 실재 사용하는 객체를 가져옴

// 테스트 실행 전 DB 연결
// beforeAll => 모든 테스트 실행 전 딱 한번 호출
beforeAll(async () => {
    await sequelize.sync({ force: true }); // 새로 시작할 때마다 데이터 날리고 새로 생성함
});

// 각 테스트 호출 직전 호출되는 메서드
beforeEach(() => {

});

describe('POST /join', () => {
   test('로그인 안 했으면 가입', async () => {
      await request(app).post('/auth/join')
          .send({
              email: 'dudfhd705@gmail.com',
              nick: 'dudfhd705',
              password: '!2345Qwert'
          })
          .expect('Location', '/') // 성공시 redirect('/')
          .expect(302);

      /*
      * redirect가 아닌 json값을 응답받는다면? ex) { code: 'success', message: 'login success' }
      * */
       /*
       const result = await request(app).post('/auth/join')
           .send({
               email: 'dudfhd705@gmail.com',
               nick: 'dudfhd705',
               password: '!2345Qwert'
           })
           .expect(200);
       expect(result.body).toEqual({
           code: 'success',
           message: 'login success',
       });
       */
   });
    test('회원가입 했는대 또 가입', async () => {
        await request(app).post('/auth/join')
            .send({
                email: 'dudfhd705@gmail.com',
                nick: 'dudfhd705',
                password: '!2345Qwert'
            })
            .expect('Location', `/join?error=dudfhd705@gmail.com`) // 성공시 redirect('/')
            .expect(302);
    });
});

// 테스트 전 로그인을 먼저 시키기 위해 describe를 분리함
describe('POST /join', () => {

    // 같은 request를 사용하고자 할 때 request.agent사용
    const agent = request.agent(app);

    beforeEach(async () => {
        // 로그인
        await agent.post('/auth/login').send({ // send를 통해서 body 파라미터 전달
            email: 'dudfhd705@gmail.com',
            password: '!2345Qwert',
        });
    });
    test('로그인 되어있으면 회원가입 진행이 안되어야함', async () => {
        const message = encodeURIComponent('로그인한 상태입니다.');
        await agent.post('/auth/join')
            .send({
                email: 'dudfhd705@gmail.com',
                nick: 'dudfhd705',
                password: '!2345Qwert'
            })
            .expect('Location', `/?error=${message}`) // 로그인 체크 미들웨어에 걸려 이동
            .expect(302);
    });
});

describe('POST /login', () => {
   test('로그인 수행', async () => {
       // 이렇게하면 app에 post로 /auth/login을 호출하는 샘이 됨
       await request(app).post('/auth/login').send({ // send를 통해서 body 파라미터 전달
           email: 'dudfhd705@gmail.com',
           password: '!2345Qwert',
       }).expect('Location', '/') // redirect('/') 의 의미 => expect('Location', '/').expect(302)
         .expect(302); // 끝났음을 알려줘야 jest가 한없이 기다리지 않음
   });

    test('회원가입한적 없는 사용자 로그인 수행', async () => {
        // 이렇게하면 app에 post로 /auth/login을 호출하는 샘이 됨
        await request(app).post('/auth/login').send({ // send를 통해서 body 파라미터 전달
            email: 'whatthefuck@gmail.com',
            password: 'whatthefuck',
        }).expect('Location', `/?loginError=${encodeURIComponent('가입되지 않은 사용자입니다.')}`) // redirect('/') 의 의미 => expect('Location', '/').expect(302)
            .expect(302); // 끝났음을 알려줘야 jest가 한없이 기다리지 않음
    });

    test('비밀번호 틀린 사용자 로그인 수행', async () => {
        // 이렇게하면 app에 post로 /auth/login을 호출하는 샘이 됨
        await request(app).post('/auth/login').send({ // send를 통해서 body 파라미터 전달
            email: 'dudfhd705@gmail.com',
            password: 'whatthefuck',
        }).expect('Location', `/?loginError=${encodeURIComponent('비밀번호가 일치하지 않습니다.')}`) // redirect('/') 의 의미 => expect('Location', '/').expect(302)
            .expect(302); // 끝났음을 알려줘야 jest가 한없이 기다리지 않음
    });
});

// 각 테스트 호출 직후 호출되는 메서드
afterEach(() => {

});

// 모든 테스트가 끝나고 호출되는 함수
afterAll(async () => {
    
});