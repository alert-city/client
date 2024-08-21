import { gql } from '@apollo/client';

export const FIND_ALL_USERS = gql`
    query FindAllUsers {
        findAllUsers {
            id
            role
            organization
            name {
                firstName
                lastName
            }
        }
    }
`;


export const GET_VERIFICATION_CODE = gql(` 
    mutation SendVerificationEmail($input:SendVerificationEmailDto!) {
    sendVerificationEmail(input:$input)
    }
`);

export const RESET_PASSWORD = gql(`
    mutation ResetPassword($username:String!,$input:UpdateUserRequestDto!) {
    resetPassword(username:$username,input:$input)
    }
`);

export const CREATE_USER = gql`
    mutation  CreateUser($input:UserRequestDto!) {
        createUser(input: $input) {
            name {
                firstName
                lastName
            }
            username
        }
    }
`

export const UPDATE_USER_BY_USERNAME = gql`
    mutation UpdateUserByUsername($username: String!, $input: UpdateUserRequestDto!) {
        updateUserByUsername(username: $username, input: $input) {
            name {
                firstName
                lastName
            }
            username
        }
    }
`

export const ACTIVATE_USER_ACCOUNT = gql`
    mutation ActivateUserAccount($token: String!) {
        activateUserAccount(token: $token)
    }
`

export const RESEND_ACTIVATION_EMAIL = gql`
    mutation ResendActivationEmail($username: String!) {
        resendActivationEmail(username: $username)
    }
`