import { gql } from "@apollo/client";

export const CREATE_EVENT = gql`
    mutation CreateEvent(
        $input: CreateEventInput!
    ) {
        createEvent(input: $input) {
            orgName
            submitter
            eventType
            date
            time
            location
            subject
            matter
        }
    }
`;