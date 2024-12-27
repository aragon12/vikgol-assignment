const { fetchAndAggregateData } = require("../src/fetchAndAggregateData");

global.fetch = jest.fn();

const mockUserData = [{
    "id": 1,
    "name": "Leanne Graham",
    "username": "Bret",
    "email": "Sincere@april.biz",
    "address": {
        "street": "Kulas Light",
        "suite": "Apt. 556",
        "city": "Gwenborough",
        "zipcode": "92998-3874",
        "geo": {
            "lat": "-37.3159",
            "lng": "81.1496"
        }
    },
    "phone": "1-770-736-8031 x56442",
    "website": "hildegard.org",
    "company": {
        "name": "Romaguera-Crona",
        "catchPhrase": "Multi-layered client-server neural-net",
        "bs": "harness real-time e-markets"
    }
},
{
    "id": 2,
    "name": "Ervin Howell",
    "username": "Antonette",
    "email": "Shanna@melissa.tv",
    "address": {
        "street": "Victor Plains",
        "suite": "Suite 879",
        "city": "Wisokyburgh",
        "zipcode": "90566-7771",
        "geo": {
            "lat": "-43.9509",
            "lng": "-34.4618"
        }
    },
    "phone": "010-692-6593 x09125",
    "website": "anastasia.net",
    "company": {
        "name": "Deckow-Crist",
        "catchPhrase": "Proactive didactic contingency",
        "bs": "synergize scalable supply-chains"
    }
},
]

const mockPostData = [
    {
        "userId": 1,
        "id": 1,
        "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
        "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
    },
    {
        "userId": 1,
        "id": 2,
        "title": "qui est esse",
        "body": "est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla"
    },
    {
        "userId": 2,
        "id": 3,
        "title": "ea molestias quasi exercitationem repellat qui ipsa sit aut",
        "body": "et iusto sed quo iure\nvoluptatem occaecati omnis eligendi aut ad\nvoluptatem doloribus vel accusantium quis pariatur\nmolestiae porro eius odio et labore et velit aut"
    }
]

describe('fetchAndAggregateData', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should successfully fetch and aggregate posts and users data', async () => {
        const mockPosts = [
            { userId: 1, id: 1, title: 'Post 1', body: 'Content 1' },
            { userId: 1, id: 2, title: 'Post 2', body: 'Content 2' },
            { userId: 2, id: 3, title: 'Post 3', body: 'Content 3' },
        ];
        const mockUsers = [
            { id: 1, name: 'User 1', username: 'user1', email: 'user1@example.com' },
            { id: 2, name: 'User 2', username: 'user2', email: 'user2@example.com' },
        ];

        fetch.mockResolvedValueOnce({
            status: 200,
            json: () => Promise.resolve(mockPostData)
        });
        fetch.mockResolvedValueOnce({
            status: 200,
            json: () => Promise.resolve(mockUserData)
        });

        const result = await fetchAndAggregateData();

        expect(result).toEqual([{
            "id": 1,
            "name": "Leanne Graham",
            "username": "Bret",
            "email": "Sincere@april.biz",
            "address": {
                "street": "Kulas Light",
                "suite": "Apt. 556",
                "city": "Gwenborough",
                "zipcode": "92998-3874",
                "geo": {
                    "lat": "-37.3159",
                    "lng": "81.1496"
                }
            },
            "phone": "1-770-736-8031 x56442",
            "website": "hildegard.org",
            "company": {
                "name": "Romaguera-Crona",
                "catchPhrase": "Multi-layered client-server neural-net",
                "bs": "harness real-time e-markets"
            },
            "posts" : [
                {
                    "userId": 1,
                    "id": 1,
                    "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
                    "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
                },
                {
                    "userId": 1,
                    "id": 2,
                    "title": "qui est esse",
                    "body": "est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla"
                }
            ]
        },
        {
            "id": 2,
            "name": "Ervin Howell",
            "username": "Antonette",
            "email": "Shanna@melissa.tv",
            "address": {
                "street": "Victor Plains",
                "suite": "Suite 879",
                "city": "Wisokyburgh",
                "zipcode": "90566-7771",
                "geo": {
                    "lat": "-43.9509",
                    "lng": "-34.4618"
                }
            },
            "phone": "010-692-6593 x09125",
            "website": "anastasia.net",
            "company": {
                "name": "Deckow-Crist",
                "catchPhrase": "Proactive didactic contingency",
                "bs": "synergize scalable supply-chains"
            },
            "posts" : [
                {
                    "userId": 2,
                    "id": 3,
                    "title": "ea molestias quasi exercitationem repellat qui ipsa sit aut",
                    "body": "et iusto sed quo iure\nvoluptatem occaecati omnis eligendi aut ad\nvoluptatem doloribus vel accusantium quis pariatur\nmolestiae porro eius odio et labore et velit aut"
                }
            ]
        },
        ]);
    });

    test('should return error if failed to fetch posts', async () => {
        fetch.mockResolvedValueOnce({
            status: 500,
            json: () => Promise.reject('Internal Server Error')
        });

        fetch.mockResolvedValueOnce({
            status: 500,
            json: () => Promise.reject('Internal Server Error')
        });

        const result = await fetchAndAggregateData();

        expect(result).toEqual({
            success: false,
            message: 'Failed to fetch posts'
        });
    });

    test('should return error if failed to fetch users', async () => {
        fetch.mockResolvedValueOnce({
            status: 200,
            json: () => Promise.resolve(mockPostData)
        });
        fetch.mockResolvedValueOnce({
            status: 500,
            json: () => Promise.reject('Internal Server Error')
        });

        const result = await fetchAndAggregateData();

        expect(result).toEqual({
            success: false,
            message: 'Failed to fetch users'
        });
    });

    test('should return error if no users found', async () => {
        const mockUsers = [];

        fetch.mockResolvedValueOnce({
            status: 200,
            json: () => Promise.resolve(mockPostData)
        });
        fetch.mockResolvedValueOnce({
            status: 200,
            json: () => Promise.resolve(mockUsers)
        });

        const result = await fetchAndAggregateData();

        expect(result).toEqual({
            success: false,
            message: 'No users found'
        });
    });

    test('should return error if posts response status is not 200', async () => {
        fetch.mockResolvedValueOnce({
            status: 400,
            json: () => Promise.resolve([])
        });

        const result = await fetchAndAggregateData();

        expect(result).toEqual({
            success: false,
            message: 'Failed to fetch posts'
        });
    });

    test('should return error if users response status is not 200', async () => {
        fetch.mockResolvedValueOnce({
            status: 200,
            json: () => Promise.resolve(mockPostData)
        });
        fetch.mockResolvedValueOnce({
            status: 400,
            json: () => Promise.resolve([])
        });

        const result = await fetchAndAggregateData();

        expect(result).toEqual({
            success: false,
            message: 'Failed to fetch users'
        });
    });
});
