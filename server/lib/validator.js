import { body, check, param, validationResult } from 'express-validator';


const registerValidator = () => {
    return [
        body('name').notEmpty().withMessage('Name is required'),
        body('username').notEmpty().withMessage('Username is required'),
        body('password').notEmpty().withMessage('Password is required'),
        body('bio').notEmpty().withMessage('Bio is required'),
        
    ];
};


const loginValidator = () => {
    return [
        body('username').notEmpty().withMessage('Username is required'),
        body('password').notEmpty().withMessage('Password is required'),
    ]
}

const newGroupValidator = () => {
    return [
        body('name')
            .notEmpty()
            .withMessage('Group name is required'),

        body('members')
            .notEmpty()
            .withMessage("Group members are required")
            .isArray({ min: 2, max: 100 })
            .withMessage('Group members must be between 2 and 100'),
    ]
}

const addMembersValidator = () => {
    return [
        body('chatId')
            .notEmpty()
            .withMessage('Chat id is required'),

        body('members')
            .notEmpty()
            .withMessage("Group members are required")
            .isArray({ min: 2, max: 97 })
            .withMessage('Group members must be between 1 and 97'),
    ]
}

const removeMemberValidator = () => {
    return [
        body('chatId')
            .notEmpty()
            .withMessage('Chat id is required'),

        body('members')
            .notEmpty()
            .withMessage("Group member is required")
    ]
}



const sendAttachemtsValidator = () => {
    return [
        body('chatId')
            .notEmpty()
            .withMessage('Chat id is required'),
        check('attachments')
            .notEmpty()
            .withMessage("Attachment is required")
            .isArray({ min: 1, max: 5 })
            .withMessage('Upto 5 attachments only'),
    ]
}
const chatIdValidator = () => {
    return [
        param('id').notEmpty().withMessage('Chat id is required'),
    ]
}


const renameGroupValidator = () => {
    return [
        param('id').notEmpty().withMessage('Chat id is required'),
        body('groupName').notEmpty().withMessage('Group Name is required')
    ]
}

const sendRequestValidator = () => {
    return [
        body('userId').notEmpty().withMessage('user id is required'),
    ]
}


const adminLoginValidator = () => {
    return [
        body('secretkey').notEmpty().withMessage('Secret Key is required'),
    ]
}

const acceptRequestValidator = () => {
    return [
        body('requestId')
        .notEmpty()
        .withMessage('Request id is required'),

        
        body('accept')
        .notEmpty()
        .withMessage('Accept is required')
        .isBoolean()
        .withMessage("Accept must be boolean")
    ]
}

// Middleware to handle validation errors
const handleValidationError = (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const messages = errors.array().map(err => err.msg);
            return res.status(400).json({
                success: false,
                errors: messages
            });
        }
        next();
    } catch (err) {
        return res.status(500).json({
            success: false,
            messages: err.message
        })
    }
};



export {
    registerValidator,
    handleValidationError,
    loginValidator,
    newGroupValidator,
    addMembersValidator,
    removeMemberValidator,
    sendAttachemtsValidator,
    chatIdValidator,
    renameGroupValidator,
    sendRequestValidator,
    acceptRequestValidator,
    adminLoginValidator
};
