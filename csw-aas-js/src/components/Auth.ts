import { AASConfig, Config } from '../config/configs'
import KeyCloak, {
  KeycloakError,
  KeycloakInstance,
  KeycloakProfile,
  KeycloakPromise,
  KeycloakResourceAccess,
  KeycloakRoles,
  KeycloakTokenParsed,
} from 'keycloak-js'
import {ServiceResolver} from "./ServiceResolver";
import { AuthContextConfig } from './context/AuthContextProvider'

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

export interface AuthenticateResult {
  keycloak: KeycloakInstance
  authenticated: KeycloakPromise<boolean, KeycloakError>
}

/**
 * Adapter for authentication and authorization service
 */
class AuthStore {
  /**
   * Create instance of TMTAuth from keycloak.
   *
   * @param keycloak keycloak instance instantiated using keyclok-js
   */
  public from: (keycloak: KeycloakInstance) => Auth = keycloak => ({
    logout: keycloak.logout,
    token: () => keycloak.token,
    tokenParsed: () => keycloak.tokenParsed,
    realmAccess: () => keycloak.realmAccess, // todo: should this be called realmRoles?
    resourceAccess: () => keycloak.resourceAccess, // todo: should this be called resourceRoles?
    loadUserProfile: keycloak.loadUserProfile,
    isAuthenticated: () => keycloak.authenticated,
    hasRealmRole: keycloak.hasRealmRole,
    hasResourceRole: keycloak.hasResourceRole,
  })

  /**
   * Responsible for instantiating keycloak using provided config and authentication. It also creates hooks for refreshing token when
   * token is expired which silently refresh token resulting seamless user experience once logged in
   *
   * @param config json object which is UI application specific keycloak configuration e.g. realm and clientID.
   * @param url json object which contains AAS url
   * @param redirect boolean which decides instantiation mode for keycloak. e.g. login-required or check-sso.
   * login-required mode redirects user to login screen if not logged in already. check-sso only checks if already
   * logged in without redirecting to login screen if not logged in.
   * @return {{ keycloak, authenticated }} json which contains keycloak instance and authenticated which is promise after
   * initializing keycloak
   */
  public authenticate = (
    config: AuthContextConfig,
    url: string,
    redirect: boolean,
  ): AuthenticateResult => {
    console.info('instantiating AAS')
    const keycloakConfig = { ...AASConfig, ...config, url }
    const keycloak = KeyCloak(keycloakConfig)

    keycloak.onTokenExpired = () => {
      keycloak
        .updateToken(0)
        .success(function() {
          // todo: remove console.info
          console.info('token refreshed successfully')
        })
        .error(function() {
          console.error(
            'Failed to refresh the token, or the session has expired',
          )
        })
    }

    const authenticated = keycloak.init({
      onLoad: redirect ? 'login-required' : 'check-sso',
      flow: 'hybrid',
    })
    return { keycloak, authenticated }
  }

  /**
   * Responsible for resolving AAS Server using location service. If not found returns AAS-server-url specified in
   * config
   *
   * @return url string which is AAS server url
   */
  public getAASUrl: () => Promise<string> = async () => {
    const url = await ServiceResolver(Config['AAS-server-name'])
    return url || Config['AAS-server-url']
  }
}

export const TMTAuth = new AuthStore()
