// // test나 spec이 파일명에 들어가면 jest의 테스트 파일로 인식

const { isLoggedIn, isNotLoggedIn } = require('./index');

test("1 + 1은 2입니다.", () => { // arg1: 테스트 설명, arg2 : 어떤 일을 수행할지
    expect(1 + 1).toEqual(2); // ecpect(우리코드).toEqual(결과)
});

describe('isLoggedIn', () => { // grouping


    test("로그인되어 있으면 isLoggedIn이 next를 호출해야 함", () => {
        const res = {
            status: jest.fn(() => res),
            send: jest.fn(),
        };
        const req = {
            isAuthenticated: jest.fn(() => true),
        };
        const next = jest.fn(); // next는 jest가 추적하는 콜백함수가 됨
        isLoggedIn(req, res, next);
        // isLoggedIn을 호출했을 때 next가 called(불리는걸) 예상함 (Times로 횟수도 지정)
        expect(next).toBeCalledTimes(1);
    });

    test("로그인되어 있지 않으면 isLoggedIn이 에러를 응답해야함.", () => {
        const res = {
            status: jest.fn(() => res),
            send: jest.fn(),
        };
        const req = {
            isAuthenticated: jest.fn(() => false),
        };
        const next = jest.fn(); // next는 jest가 추적하는 콜백함수가 됨
        isLoggedIn(req, res, next);

        expect(res.status).toBeCalledWith(403);
        expect(res.send).toBeCalledWith('로그인 필요');
    });

});

describe('isNotLoggedIn', () => {

    test("로그인되어 있으면 isNotLoggedIn이 에러를 응답해야 함.", () => {

        const req = {
            isAuthenticated: jest.fn(() => true),
        }

        const res = {
            redirect: jest.fn(),
        }

        const next = jest.fn();

        isNotLoggedIn(req, res, next); // isNotLoggedIn 호출

        const message = encodeURIComponent('로그인한 상태입니다.');
        expect(res.redirect).toBeCalledWith(`/?error=${message}`);

    });

    test("로그인되어 있지 않으면 isNotLoggedIn이 next를 호출해야 함", () => {

        const req = {
            isAuthenticated: jest.fn(() => false),
        }

        const res = {
            redirect: jest.fn(),
        }

        const next = jest.fn();

        isNotLoggedIn(req, res, next); // isNotLoggedIn 호출

        expect(next).toBeCalledTimes(1);

    });

});

