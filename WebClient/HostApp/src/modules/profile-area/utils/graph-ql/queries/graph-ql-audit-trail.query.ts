import { gql } from '@apollo/client';

export const FILTERED_AUDIT_TRAIL = gql`
    query FilteredAuditTrail(
        $isFull: Boolean,
        $pageNumber: Int,
        $pageSize: Int,
        $dateFrom: DateTime,
        $dateTo: DateTime,
        $column: String,
        $direction: String,
        $query: String,
        $amountFrom: Decimal,
        $amountTo: Decimal,
        $entityType: String,
        $action: String,
        $type: String,
        $exceptionType: String,
        $entityId: ID,
        $userId: ID,
        $translationKey: String
    ) {
        audit_trail_filtered_audit_trail(
            isFull: $isFull,
            pageNumber: $pageNumber,
            pageSize: $pageSize,
            dateFrom: $dateFrom,
            dateTo: $dateTo,
            column: $column,
            direction: $direction,
            query: $query,
            amountFrom: $amountFrom,
            amountTo: $amountTo,
            entityType: $entityType,
            action: $action,
            type: $type,
            exceptionType: $exceptionType,
            entityId: $entityId,
            userId: $userId,
            translationKey: $translationKey
        ) {
            entities {
                id
                createdAt
                entityType
                action
                type
                exceptionType
                message
                entityId
                oldValue
                newValue
                payload
                uri
                userId
                archiveDate
            }
            paginator {
                pageNumber
                pageSize
                isFull
            }
            totalCount
        }
    }
`;
