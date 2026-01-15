const DEFAULT_USERS = [
    { id: '01', name: 'User 01', avatar: '01', color: 'green' },
    { id: '55', name: 'User 55', avatar: '55', color: 'blue' },
    { id: '75', name: 'User 75', avatar: '75', color: 'purple' },
    { id: '76', name: 'User 76', avatar: '76', color: 'pink' },
    { id: '111', name: 'User 111', avatar: '111', color: 'yellow' },
    { id: '214', name: 'User 214', avatar: '214', color: 'red' },
    { id: '245', name: 'User 245', avatar: '245', color: 'indigo' },
    { id: '1000', name: 'User 1000', avatar: '1K', color: 'gray' }
];

const COLORS = ['green', 'blue', 'purple', 'pink', 'yellow', 'red', 'indigo', 'gray'];

export function getUsers() {
    const stored = localStorage.getItem('users');
    return stored ? JSON.parse(stored) : DEFAULT_USERS;
}

export function addUser(id, name) {
    const users = getUsers();
    const newUser = {
        id,
        name,
        avatar: id.length > 3 ? id.substring(0, 2) : id,
        color: COLORS[users.length % COLORS.length]
    };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    return newUser;
}
