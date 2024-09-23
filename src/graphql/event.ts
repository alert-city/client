import { gql } from "@apollo/client";

export const FIND_UNREVIEWED_EVENTS_BY_ID = gql`
    query findUnreviewedEventsById(
        $userId: String!
    ) {
        findUnreviewedEventsById(
            userId: $userId
        ) {
            id
            subject
            matter
            time
            date
            ERTime
            ERDate
            location
        }
    }
`;

export const FIND_REVIEWED_EVENTS_BY_ID = gql`
    query findReviewedEventsById(
        $userId: String!,
        $approved: Boolean!,
        $ascending: Boolean!
    ) {
        findReviewedEventsById(
            userId: $userId,
            approved: $approved,
            ascending: $ascending
        ) {
            id
            eventType
            subject
            matter
            time
            date
            ERTime
            ERDate
            location
        }
    }
`;

export const FIND_UNREVIEWED_EVENTS_BY_ORG_NAME = gql`
    query findUnreviewedEventsByOrgName(
        $orgName: String!
    ) {
        findUnreviewedEventsByOrgName(
            orgName: $orgName
        ) {
            id
            submitter {
                firstName
                lastName
            }
            orgName
            subject
            matter
            time
            date
            ERTime
            ERDate
            location
        }
    }
`;

export const FIND_REVIEWED_EVENTS_BY_ORG_NAME = gql`
    query findReviewedEventsByOrgName(
        $orgName: String!,
        $approved: Boolean!,
        $ascending: Boolean!
    ) {
        findReviewedEventsByOrgName(
            orgName: $orgName,
            approved: $approved,
            ascending: $ascending
        ) {
            id
            eventType
            subject
            matter
            time
            date
            ERTime
            ERDate
            location
        }
    }
`;

export const CREATE_EVENT = gql`
    mutation CreateEvent(
        $input: CreateEventInput!
    ) {
        createEvent(input: $input) {
            orgName
            submitter {
                firstName
                lastName
            }
            eventType
            date
            time
            location
            subject
            matter
        }
    }
`;

export const UPDATE_EVENT = gql`
    mutation updateEvent(
        $input: UpdateEventInput!
    ) {
        updateEvent(
            input: $input
        ) {
            id
            submitter {
                firstName
                lastName
            }
            orgName
            subject
            isReviewed
            isApproved
            reviewComment
        }
    }
`;

export const EVENT_CREATED = gql`
    subscription {
        eventCreated {
            id
            eventType
            subject
            matter
        }
    }
`;

export const EVENT_UPDATED = gql`
    subscription {
        eventUpdated {
            id
            eventType
            subject
            matter
        }
    }
`;