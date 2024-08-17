import { gql } from "@apollo/client";

export const LOGIN = gql`
    mutation Login($input: LoginRequestDto!) {
        login(input: $input) {
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


export const REVOKETOKENS = gql(`
  mutation RevokeTokens {
  revokeTokens
  }
`);

