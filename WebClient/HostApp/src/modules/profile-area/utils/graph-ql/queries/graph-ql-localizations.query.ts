import {gql} from "@apollo/client";

export const LOCALES_DICTIONARY = gql`
    query Locales($version: String) {
        localizations_locales_dictionary(version: $version) {
            items {
                id
                isoCode
                title
                titleEn
                titleNormalized
                titleEnNormalized
                isDefault
                status
                localeEnum
                culture
            }
            version
        }
    }
`;

export const PUBLIC_LOCALIZATIONS = gql`
    query PublicLocalizations($version: String) {
        localizations_public_localizations(version: $version) {
            version
            data {
                locale
                items {
                    key
                    value
                }
            }
        }
    }
`;

export const LOCALIZATIONS = gql`
    query Localizations($version: String) {
        localizations_localizations(version: $version) {
            version
            data {
                locale
                items {
                    key
                    value
                }
            }
        }
    }
`;