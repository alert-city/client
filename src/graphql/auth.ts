import { gql } from "@apollo/client";

export const LOGIN = gql`
    mutation Login($input: LoginRequestDto!) {
        login(input: $input) {
            message
            accessToken
            role
            name {
                firstName
                lastName
            }
        }
    }
`;
