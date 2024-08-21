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
