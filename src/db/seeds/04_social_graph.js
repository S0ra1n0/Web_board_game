const minutesAgo = (minutes) => new Date(Date.now() - minutes * 60 * 1000);

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
    await knex('messages').del();
    await knex('friend_requests').del();
    await knex('friendships').del();

    const users = await knex('users').select('id', 'username');
    const userByName = users.reduce((acc, user) => {
        acc[user.username] = user.id;
        return acc;
    }, {});

    const friendships = [
        ['user1', 'user2', minutesAgo(6000)],
        ['user1', 'user3', minutesAgo(4200)],
        ['user4', 'user5', minutesAgo(1800)],
    ]
        .filter(([userOne, userTwo]) => userByName[userOne] && userByName[userTwo])
        .map(([userOne, userTwo, createdAt]) => {
            const [firstUserId, secondUserId] = [userByName[userOne], userByName[userTwo]].sort();

            return {
                user_one_id: firstUserId,
                user_two_id: secondUserId,
                created_at: createdAt,
                updated_at: createdAt,
            };
        });

    if (friendships.length > 0) {
        await knex('friendships').insert(friendships);
    }

    const friendRequests = [
        ['user1', 'user4', 'pending', minutesAgo(900)],
        ['user2', 'user5', 'pending', minutesAgo(300)],
        ['user5', 'user1', 'pending', minutesAgo(120)],
    ]
        .filter(([sender, receiver]) => userByName[sender] && userByName[receiver])
        .map(([sender, receiver, status, createdAt]) => ({
            sender_id: userByName[sender],
            receiver_id: userByName[receiver],
            status,
            created_at: createdAt,
            updated_at: createdAt,
        }));

    if (friendRequests.length > 0) {
        await knex('friend_requests').insert(friendRequests);
    }

    const messages = [
        ['user1', 'user2', 'Ready for another Tic-Tac-Toe round tonight?', minutesAgo(95)],
        ['user2', 'user1', 'Yes. I want a rematch after that draw.', minutesAgo(90)],
        ['user1', 'user2', 'Deal. I also found a faster route through the hub menu.', minutesAgo(85)],
        ['user2', 'user1', 'Send it over after class and I will test it.', minutesAgo(80)],
        ['user1', 'user3', 'Can you review my memory board strategy?', minutesAgo(60)],
        ['user3', 'user1', 'Sure. Focus on corner pairs first and the timer gets easier.', minutesAgo(57)],
        ['user1', 'user3', 'That helps. I am trying to unlock the next badge.', minutesAgo(55)],
        ['user4', 'user5', 'The free draw palette looks better in light mode.', minutesAgo(40)],
        ['user5', 'user4', 'Agreed. I saved a board sketch for tomorrow.', minutesAgo(35)],
        ['user4', 'user5', 'Let us present that version during the demo.', minutesAgo(30)],
    ]
        .filter(([sender, recipient]) => userByName[sender] && userByName[recipient])
        .map(([sender, recipient, content, createdAt], index) => ({
            sender_id: userByName[sender],
            recipient_id: userByName[recipient],
            content,
            read_at: index % 3 === 0 ? null : createdAt,
            created_at: createdAt,
            updated_at: createdAt,
        }));

    if (messages.length > 0) {
        await knex('messages').insert(messages);
    }
};
