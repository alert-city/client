import { gql } from "@apollo/client";

export const LOGIN = gql`
    mutation Login($input: LoginRequestDto!) {
        login(input: $input) {
            username
            accessToken
            accountType
            role
            organization
            name {
                firstName
                lastName
            }
        }
    }
`;


export const REVOKE_TOKENS = gql(`
  mutation RevokeTokens {
  revokeTokens
  }
`);


