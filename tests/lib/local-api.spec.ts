import api from "../../src/lib/local-api"

const mockPost = jest.fn()

jest.mock('axios', () => ({
    post: (url, data) => mockPost(url, data)
}))

describe('local-api', function () {
    it('authenticateUser', async () => {
        mockPost.mockReturnValue(Promise.resolve({data: {}}))

        const userName = 'pippo'
        const password = '123'
        await api.authenticateUser(userName, password)

        expect(mockPost).toHaveBeenCalledWith('/api/login', {password, userName})
    })
})
