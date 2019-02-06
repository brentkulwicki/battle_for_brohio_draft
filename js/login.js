let usernames = [
    {name: 'Jeremy', username: 'jmo', password: 'jmo'},
    {name: 'Seth', username: 'seth', password: 'seth'},
    {name: 'Taylor', username: 'bruc', password: 'bruc'},
    {name: 'Zak', username: 'vin', password: 'vin'},
    {name: 'Mark', username: 'ww', password: 'ww'},
    {name: 'Jesse', username: 'patt', password: 'patt'},
    {name: 'Jared', username: 'jwj', password: 'jwj'},
    {name: 'Chip', username: 'bb', password: 'bb'},
    {name: 'Sam', username: 'xtg', password: 'xtg'},
    {name: 'Brent', username: 'bk', password: 'bk'},
    {name: 'Commish', username: 'commish', password: 'commish'}
];

function checkPassword() {
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    username = username.toLowerCase();
    password = password.toLowerCase();
    for (let i = 0; i < usernames.length; i++) {
        if (username === usernames[i].username) {
            if (password === usernames[i].password) {
                alert(`Hello ${usernames[i].name}!`);
                document.cookie = "username=" + usernames[i].username;
                window.location.href = 'draftPage.html';
            } else {
                alert('Password incorrect')
            }
            
        };
    };
}

document.getElementById('submit').addEventListener('click', checkPassword);