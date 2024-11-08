const {follow} = require("./user");

jest.mock('../services/user');
const UserService = require('../services/user');
describe('user controller service mock test', () => {

    test('result == ok인 경우 res.send(success)', async () => {
       const req = {
        user: {
            id: 1,
        },
        params: {
            id: 2,
        }
       }
       const res = {
           send: jest.fn(),
           status: jest.fn(() => res)
       }
       const next = jest.fn();

       UserService.follow.mockReturnValue('ok');

       await follow(req, res, next);

       expect(res.send).toBeCalledWith('success');


    });

});