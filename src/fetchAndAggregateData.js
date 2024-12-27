const BASE_URL = "https://jsonplaceholder.typicode.com";

const fetchAndAggregateData = async () => {
    const [postsResponse, usersResponse] = await Promise.all([
        fetch(`${BASE_URL}/posts`),
        fetch(`${BASE_URL}/users`)
    ]);

    if (postsResponse.status != 200) {
        return { success: false, message: 'Failed to fetch posts' };
    }
    if (usersResponse.status != 200) {
        return { success: false, message: 'Failed to fetch users' };
    }

    let posts = await postsResponse.json();
    const users = await usersResponse.json();

    if (!users.length) {
        return { success: false, message: 'No users found' };
    }

    const postHash = {};
    posts.map(p => {
        if (postHash[p.userId] == undefined) {
            postHash[p.userId] = [];
        }
        postHash[p.userId].push(p);
    });
    posts = null;

    const aggregatedData = users.map(user => {
        const posts = postHash[user.id] ?? [];
        return {
            ...user,
            posts
        };
    });

    return aggregatedData;
}

module.exports = { fetchAndAggregateData };
