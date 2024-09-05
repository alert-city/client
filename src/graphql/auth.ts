import { gql } from "@apollo/client";

export const LOGIN = gql`
    mutation Login($input: LoginRequestDto!) {
        login(input: $input) {
            id
            username
            accessToken
            accountType
            role
            organization
            displayName
            firstName
            lastName
            avatarUrl
            isFirstLogin
        }
    }
`;


export const REVOKE_TOKENS = gql(`
  mutation RevokeTokens {
  revokeTokens
  }
`);


export const GENERATE_2FA = gql`
    mutation Generate2FA($id:String!,$issuer:String!) {
        generate2FA(id:$id,issuer:$issuer) {
            qrCodeUrl
            secret
        }
    }
`;

export const VERIFY_2FA_CODE = gql`
    mutation Verify2FACode($id:String!,$code:String!) {
        verify2FACode(id:$id,code:$code)
    }
`;


