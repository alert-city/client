import { gql } from '@apollo/client';

export const FIND_ALL_USERS = gql`
    query FindAllUsers {
        findAllUsers {
            id
            role
            organization
            firstName
            lastName
        }
    }
`;


export const FIND_ONE_USER = gql`
    query FindOneUser($id: String!) {
        findOneUser(id: $id) {
            id
            role
            organization
            firstName
            lastName
            avatarUrl
            username
            displayName
            mobilePhone
            orgName
            is2FAEnabled
        }
    }
`;


export const UPDATE_USER = gql`
    mutation UpdateUser($id: String!, $input: UpdateUserRequestDto!) {
        updateUser(id: $id, input: $input)
    }
`;

export const CREATE_USER = gql`
    mutation  CreateUser($input:UserRequestDto!) {
        createUser(input: $input) {
            id
        }
    }
`;

export const DELETE_USER = gql`
    mutation DeleteUser($id: String!) {
        deleteUser(id: $id)
    }
`;


export const GET_VERIFICATION_CODE = gql`
    mutation SendVerificationCodeEmail($username:String!, $emailInfoType:Int!) {
        sendVerificationCodeEmail(username:$username,emailInfoType:$emailInfoType)
    }
`;

export const RESET_PASSWORD = gql`
    mutation ResetPassword($username:String!,$input:ResetPasswordRequestDto!) {
        resetPassword(username:$username,input:$input)
    }
`;

export const SEND_UPDATE_USERNAME_EMAIL = gql`
    mutation SendUpdateUsernameEmail($id: String!,$input:SendUpdateUsernameEmailRequestDto!) {
        sendUpdateUsernameEmail(id: $id, input: $input)
    }
`;

export const VALIDATE_EMAIL_LINK = gql`
    mutation ValidateEmailLink($token: String!, $emailInfoType: Int!) {
        validateEmailLink(token: $token, emailInfoType: $emailInfoType)
    }
`;

export const RESEND_ACTIVATION_LINK_EMAIL = gql`
    mutation ResendActivationLinkEmail($id: String!, $emailInfoType: Int!, $newUsername: String) {
        resendActivationLinkEmail(id: $id, emailInfoType: $emailInfoType, newUsername: $newUsername)
    }
`;

export const FIND_USER_BY_USERNAME = gql`
    query FindUserByUsername($username: String!) {
        findUserByUsername(username: $username) {
            id
            role
            firstName
            lastName
            username
            mobilePhone
            is2FAEnabled
            avatarUrl
            displayName
            orgName
        }
    }
`;