/**
 * https://www.keycloak.org/docs-api/25.0.2/rest-api/index.html#ClientRepresentation
 */
export interface ClientRepresentation {
    id?: string
    clientId: string
    secret?: string
    name?: string
    standardFlowEnabled?: boolean
    directAccessGrantsEnabled?: boolean
    serviceAccountsEnabled?: boolean
    publicClient?: boolean
    enabled?: boolean
    redirectUris?: string[]
    webOrigins?: string[]
    defaultRoles?: string[]
}

export interface UserRepresentation {
    id?: string
    createdTimestamp?: number
    username?: string
    firstName?: string
    lastName?: string
    email: string
    emailVerified?: boolean
    enabled?: boolean
    credentials?: CredentialRepresentation[]
    requiredActions?: string[]
    groups?: string[]
    attributes?: Record<string, string[]>
}

export interface CredentialRepresentation {
    type?: string
    value?: string
    temporary?: boolean
    secretData?: string
    credentialData?: string
    userLabel?: string
}

export interface RealmRepresentation {
    realm: string

    smtpServer: {
        host: string
        port: string
        envelopeFrom: string
        from: string
        fromDisplayName: string
    }
}

export interface UPConfig {
    attributes: unknown[]
    groups: unknown[]
    unmanagedAttributePolicy?: 'ENABLED'
}
