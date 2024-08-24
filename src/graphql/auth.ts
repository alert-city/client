import { gql } from "@apollo/client";

export const LOGIN = gql`
    mutation Login($input: LoginRequestDto!) {
        login(input: $input) {
            username
            accessToken
            accountType
            role
            organization
            displayName
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


export const GENERATE_2FA = gql`
    mutation Generate2FA($username:String!,$issuer:String!) {
        generate2FA(username:$username,issuer:$issuer) {
            qrCodeUrl
            secret
        }
    }
`;

export const VERIFY_2FA_CODE = gql`
    mutation Verify2FACode($username:String!,$code:String!) {
        verify2FACode(username:$username,code:$code)
    }
`;


