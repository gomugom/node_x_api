const { follow } = require('./user');
jest.mock('../models/user');
const User = require('../models/user');

describe('user service', () => {
    test('US-사용자를 찾아 팔로잉을 추가하고 ok 응답해야 함.', async () => {

        User.findOne.mockReturnValue({
            addFollowings(id) {
                return Promise.resolve(true);
            }
        });

        const result = await follow(1, 2);
        expect(result).toEqual('ok');
    });

    test('US-사용자를 못찾으면 res.status(404).send(no user)를 호출함', async () => {

        // 사용자 못찾음
        User.findOne.mockReturnValue(Promise.resolve(null));

        const result = await follow(1, 2);

        expect(result).toEqual('no user');

    });

    test('US-DB에서 에러가 발생하면 next(error)를 호출함', async () => {

        // 사용자 못찾음
        const message = 'DB 에러';
        const err = new Error(message);

        User.findOne.mockReturnValue(Promise.reject(err));

        try {

            await follow(1, 2);

        } catch (error) {
            expect(error.message).toEqual('DB 에러');
        }

    });
});