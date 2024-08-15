import { gql } from "@apollo/client";

export const FINDALLUSERS = gql`
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
