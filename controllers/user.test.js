const {follow} = require("./user");

// controller에서 실행하는 DB model을 가로채서 가짜 데이터로 만듬(DB 접근이 안되기 때문에)
jest.mock('../models/user');
const User = require('../models/user');
describe('user', () => {
    test('사용자를 찾아 팔로잉을 추가하고 success를 응답해야 함.', async () => {
        const req = {
            user: {
                id: 1,
            },
            params: {
                id: 2,
            }
        };
        const res = {
            send: jest.fn(),
            status: jest.fn(() => res),
        };
        const next = jest.fn();

        // DB는 단위테스트에서 실행불가함
        // jest mock을 통해 가짜 DB 데이터를 리턴하도록 설정
        User.findOne.mockReturnValue({
           addFollowings(id) {
               return Promise.resolve(true);
           }
        });

        await follow(req, res, next);
        expect(res.send).toBeCalledWith('success');
    });

    test('사용자를 못찾으면 res.status(404).send(no user)를 호출함', async () => {
        const req = {
            user: {
                id: 100,
            },
            params: {
                id: 2,
            }
        };
        const res = {
            send: jest.fn(),
            status: jest.fn(() => res),
        };
        const next = jest.fn();

        // 사용자 못찾음
        User.findOne.mockReturnValue(Promise.resolve(null));

        await follow(req, res, next);

        expect(res.status).toBeCalledWith(404);
        expect(res.send).toBeCalledWith('no user');
    });

    test('DB에서 에러가 발생하면 next(error)를 호출함', async () => {
        const req = {
            user: {
                id: 1,
            },
            params: {
                id: 2,
            }
        };
        const res = {
            send: jest.fn(),
            status: jest.fn(() => res),
        };
        const next = jest.fn();

        // 사용자 못찾음
        const message = 'DB 에러';
        const err = new Error(message);

        User.findOne.mockReturnValue(Promise.reject(err));

        await follow(req, res, next);

        expect(next).toBeCalledWith(err);

    });
});