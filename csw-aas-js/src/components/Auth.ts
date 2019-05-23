import {
  KeycloakProfile,
  KeycloakPromise,
  KeycloakResourceAccess,
  KeycloakRoles,
  KeycloakTokenParsed,
} from 'keycloak-js'

export interface Auth {
  logout: (options?: any) => KeycloakPromise<void, void>
  token: () => string | undefined
  tokenParsed: () => KeycloakTokenParsed | undefined
  realmAccess: () => KeycloakRoles | undefined
  resourceAccess: () => KeycloakResourceAccess | undefined
  loadUserProfile: () => KeycloakPromise<KeycloakProfile, void>
  isAuthenticated: () => boolean | undefined
  hasRealmRole: (role: string) => boolean
  hasResourceRole: (role: string, resource?: string) => boolean
}
