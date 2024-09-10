import { gql } from "@apollo/client";

const USER_FIELDS = gql`
    fragment UserFields on UserResponseDto {
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
`;

export const LOGIN = gql`
    mutation Login($input: LoginRequestDto!) {
        login(input: $input) {
            ...UserFields
        }
    }
    ${USER_FIELDS}
`;

export const OAUTH_LOGIN = gql`
    mutation OAuthLogin($input: OAuthLoginRequestDto!) {
        OAuthLogin(input: $input) {
            ...UserFields
        }
    }
    ${USER_FIELDS}
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


