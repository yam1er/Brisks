class UserController {
    static getUsers(req, res) {
        res.status(200).send('We are users');
    }
}


export default UserController;