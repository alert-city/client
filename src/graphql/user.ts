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


export const FIND_ONE_USER_BY_ID = gql`
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
        updateUser(id: $id, input: $input) {
            id
            role
            organization
            firstName
            lastName
            avatarUrl
        }
    }
`;

export const CREATE_USER = gql`
    mutation  CreateUser($input:UserRequestDto!) {
        createUser(input: $input) {
            firstName
            lastName
            username
        }
    }
`;

export const DELETE_USER = gql`
    mutation DeleteUser($id: String!) {
        deleteUser(id: $id)
    }
`;


export const UPDATE_USER_BY_USERNAME = gql`
    mutation UpdateUserByUsername($username: String!, $input: UpdateUserRequestDto!) {
        updateUserByUsername(username: $username, input: $input) {
            firstName
            lastName
            username
            displayName
            is2FAEnabled
            avatarUrl
            mobilePhone
            orgName
        }
    }
`;

export const GET_VERIFICATION_CODE = gql`
    mutation SendVerificationCodeEmail($input:SendVerificationEmailDto!) {
        sendVerificationCodeEmail(input:$input)
    }
`;

export const RESET_PASSWORD = gql`
    mutation ResetPassword($username:String!,$input:UpdateUserRequestDto!) {
        resetPassword(username:$username,input:$input)
    }
`;

export const SEND_UPDATE_USERNAME_EMAIL = gql`
    mutation SendUpdateUsernameEmail($username: String!,$input:SendUpdateUsernameEmailRequestDto!) {
        sendUpdateUsernameEmail(username: $username, input: $input)
    }
`;

export const VALIDATE_EMAIL_LINK = gql`
    mutation ValidateEmailLink($token: String!, $emailInfoType: Int!) {
        validateEmailLink(token: $token, emailInfoType: $emailInfoType)
    }
`;

export const RESEND_ACTIVATION_LINK_EMAIL = gql`
    mutation ResendActivationLinkEmail($username: String!, $emailInfoType: Int!, $newUsername: String) {
        resendActivationLinkEmail(username: $username, emailInfoType: $emailInfoType, newUsername: $newUsername)
    }
`;

export const FIND_USER_BY_USERNAME = gql`
    query FindUserByUsername($username: String!) {
        findUserByUsername(username: $username) {
            id
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
