import {gql} from "@apollo/client";

export const FILTERED_EXPENSES = gql`
    query FilteredExpenses(
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
        $userProjectId: ID,
        $categoryIds: [Int]
    ) {
        expenses_filtered_expenses(
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
            userProjectId: $userProjectId,
            categoryIds: $categoryIds
        ) {
            entities {
                id
                createdAt
                updatedAt
                title
                description
                amount
                balanceId
                date
                categoryId
                userProjectId
                createdUserId
                version
                favoriteExpenseId
                favoriteExpense {
                    id
                    title
                    description
                    limit
                    categoryId
                    frequencyId
                    currencyId
                    userProjectId
                    iconId
                    createdUserId
                    version
                }
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

export const FILTERED_PLANNED_EXPENSES = gql`
    query FilteredPlannedExpenses(
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
        $userProjectId: ID,
        $categoryIds: [Int]
    ) {
        expenses_filtered_planned_expenses(
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
            userProjectId: $userProjectId,
            categoryIds: $categoryIds
        ) {
            entities {
                id
                createdAt
                updatedAt
                title
                description
                amount
                categoryId
                balanceId
                startDate
                endDate
                nextDate
                createdUserId
                userProjectId
                frequencyId
                status
                version
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

export const FILTERED_FAVORITE_EXPENSES = gql`
    query FilteredFavoriteExpenses(
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
        $userProjectId: ID,
        $categoryIds: [Int]
    ) {
        expenses_filtered_favorite_expenses(
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
            userProjectId: $userProjectId,
            categoryIds: $categoryIds
        ) {
            entities {
                id
                createdAt
                updatedAt
                title
                description
                limit
                currentAmount
                categoryId
                frequencyId
                currencyId
                endDate
                userProjectId
                iconId
                createdUserId
                version
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

export const CREATE_EXPENSE = gql`
    mutation CreateOrUpdateExpenseInput(
        $title: String!,
        $description: String,
        $amount: Decimal!,
        $date: DateTime!,
        $categoryId: Int!,
        $userProjectId: ID!,
        $balanceId: ID!
        $favoriteExpenseId: ID
    ) {
        expenses_create_expense(
            input: {
                title: $title,
                description: $description,
                amount: $amount,
                date: $date,
                categoryId: $categoryId,
                userProjectId: $userProjectId,
                balanceId: $balanceId,
                favoriteExpenseId: $favoriteExpenseId
            }
        ) {
            id
        }
    }
`;

export const CREATE_PLANNED_EXPENSE = gql`
    mutation CreatePlannedExpense(
        $title: String!,
        $description: String,
        $amount: Decimal!,
        $categoryId: Int!,
        $balanceId: ID!,
        $startDate: DateTime!,
        $endDate: DateTime,
        $userProjectId: ID!,
        $frequencyId: Int!
    ) {
        expenses_create_planned_expense(
            input: {
                title: $title,
                description: $description,
                amount: $amount,
                categoryId: $categoryId,
                balanceId: $balanceId,
                startDate: $startDate,
                endDate: $endDate,
                userProjectId: $userProjectId,
                frequencyId: $frequencyId
            }
        ) {
            id
        }
    }
`;

export const UPDATE_EXPENSE = gql`
    mutation CreateOrUpdateExpenseInput(
        $id: Guid!,
        $title: String!,
        $description: String,
        $amount: Decimal!,
        $date: DateTime!,
        $categoryId: Int!,
        $balanceId: ID!
    ) {
        expenses_update_expense(
            id: $id,
            input: {
                title: $title,
                description: $description,
                amount: $amount,
                date: $date,
                categoryId: $categoryId,
                balanceId: $balanceId
            }
        ) {
            success
        }
    }
`;

export const UPDATE_PLANNED_EXPENSE = gql`
    mutation UpdatePlannedExpense(
        $id: Guid!,
        $title: String!,
        $description: String,
        $amount: Decimal!,
        $categoryId: Int!,
        $balanceId: ID!,
        $startDate: DateTime!,
        $endDate: DateTime,
        $frequencyId: Int!
    ) {
        expenses_update_planned_expense(
            id: $id,
            input: {
                title: $title,
                description: $description,
                amount: $amount,
                categoryId: $categoryId,
                balanceId: $balanceId,
                startDate: $startDate,
                endDate: $endDate,
                frequencyId: $frequencyId
            }
        ) {
            success
        }
    }
`;

export const REMOVE_EXPENSE = gql`
    mutation RemoveExpense($id: Guid!) {
        expenses_remove_expense(id: $id) {
            success
        }
    }
`;

export const REMOVE_PLANNED_EXPENSE = gql`
    mutation RemovePlannedExpense($id: Guid!) {
        expenses_remove_planned_expense(id: $id) {
            success
        }
    }
`;

export const CREATE_USER_PROJECT = gql`
    mutation CreateUserProjectInput($title: String!) {
        expenses_create_user_project(input: { title: $title }) {
            id
        }
    }
`;

export const UPDATE_USER_PROJECT = gql`
    mutation UpdateUserProjectInput($id: Guid!, $title: String!) {
        expenses_create_user_project(id: $id, input: { title: $title }) {
            success
        }
    }
`;

export const CREATE_USER_BALANCE = gql`
    mutation CreateUserBalanceInput(
        $title: String!,
        $currencyId: Int!,
        $balanceTypeId: Int!
        $userProjectId: Guid!
        $iconId: Int!
    ) {
        expenses_create_user_balance(
            input: {
                title: $title,
                currencyId: $currencyId,
                balanceTypeId: $balanceTypeId
                userProjectId: $userProjectId
                iconId: $iconId
            }) {
            id
        }
    }
`;

export const UPDATE_USER_BALANCE = gql`
    mutation UpdateUserBalanceInput(
        $id: Guid!,
        $title: String!,
        $currencyId: Int!,
        $balanceTypeId: Int!
        $userProjectId: Guid!
        $iconId: Int!
    ) {
        expenses_update_user_balance(
            id: $id,
            input: {
                title: $title,
                currencyId: $currencyId,
                balanceTypeId: $balanceTypeId
                userProjectId: $userProjectId
                iconId: $iconId
            }) {
            success
        }
    }
`;

export const REMOVE_USER_BALANCE = gql`
    mutation RemovePlannedExpense($id: Guid!) {
        expenses_remove_user_balance(id: $id) {
            success
        }
    }
`;

export const CREATE_FAVORITE_EXPENSE = gql`
    mutation CreateFavoriteExpenseInput(
        $title: String!,
        $description: String,
        $limit: Decimal,
        $categoryId: Int,
        $frequencyId: Int,
        $currencyId: Int!,
        $userProjectId: ID!,
        $iconId: Int!
    ) {
        expenses_create_favorite_expense(
            input: {
                title: $title,
                description: $description,
                limit: $limit,
                categoryId: $categoryId,
                frequencyId: $frequencyId,
                currencyId: $currencyId,
                userProjectId: $userProjectId,
                iconId: $iconId
            }) {
            id
        }
    }
`;

export const UPDATE_FAVORITE_EXPENSE = gql`
    mutation UpdateFavoriteExpenseInput(
        $id: Guid!,
        $title: String!,
        $description: String,
        $limit: Decimal,
        $categoryId: Int,
        $frequencyId: Int,
        $currencyId: Int!,
        $userProjectId: ID!,
        $iconId: Int!
    ) {
        expenses_update_favorite_expense(
            id: $id,
            input: {
                title: $title,
                description: $description,
                limit: $limit,
                categoryId: $categoryId,
                frequencyId: $frequencyId,
                currencyId: $currencyId,
                userProjectId: $userProjectId,
                iconId: $iconId
            }) {
            success
        }
    }
`;

export const REMOVE_FAVORITE_EXPENSE = gql`
    mutation RemoveFavoriteExpense($id: Guid!) {
        expenses_remove_favorite_expense(id: $id) {
            success
        }
    }
`;

export const USER_PROJECT_BY_ID = gql`
    query UserProjectById($id: Guid) {
        expenses_user_project_by_id(id: $id) {
            id
            title
            status
            createdUserId
            balances {
                id
                title
                iconId
                createdAt
                updatedAt
                amount
                currencyId
                userProjectId
                balanceTypeId
                status
                version
                userId
            }
            version
            createdAt
            updatedAt
        }
    }
`;

export const FILTERED_USER_PROJECTS = gql`
    query FilteredUserProjects(
        $isFull: Boolean,
        $pageNumber: Int,
        $pageSize: Int,
        $dateFrom: DateTime,
        $dateTo: DateTime,
        $column: String,
        $direction: String,
        $query: String,
        $amountFrom: Decimal,
        $amountTo: Decimal
    ) {
        expenses_filtered_user_projects(
            isFull: $isFull,
            pageNumber: $pageNumber,
            pageSize: $pageSize,
            dateFrom: $dateFrom,
            dateTo: $dateTo,
            column: $column,
            direction: $direction,
            query: $query,
            amountFrom: $amountFrom,
            amountTo: $amountTo
        ) {
            entities {
                id
                title
                status
                createdUserId
                balances {
                    id
                    title
                    iconId
                    createdAt
                    updatedAt
                    amount
                    currencyId
                    userProjectId
                    balanceTypeId
                    status
                    version
                    userId
                }
                version
                createdAt
                updatedAt
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

export const FILTERED_USER_ALLOWED_PROJECTS = gql`
    query FilteredUserAllowedProjects(
        $isFull: Boolean,
        $pageNumber: Int,
        $pageSize: Int,
        $dateFrom: DateTime,
        $dateTo: DateTime,
        $column: String,
        $direction: String,
        $query: String,
        $amountFrom: Decimal,
        $amountTo: Decimal
    ) {
        expenses_filtered_user_allowed_projects(
            isFull: $isFull,
            pageNumber: $pageNumber,
            pageSize: $pageSize,
            dateFrom: $dateFrom,
            dateTo: $dateTo,
            column: $column,
            direction: $direction,
            query: $query,
            amountFrom: $amountFrom,
            amountTo: $amountTo
        ) {
            entities {
                id
                userProjectId
                userProject {
                    id
                    title
                    status
                    createdUserId
                    balances {
                        id
                        title
                        iconId
                        createdAt
                        updatedAt
                        amount
                        currencyId
                        userProjectId
                        balanceTypeId
                        status
                        version
                        userId
                    }
                    version
                    createdAt
                    updatedAt
                }
                userId
                isReadOnly
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
